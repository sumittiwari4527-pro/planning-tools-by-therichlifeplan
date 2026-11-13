import { createHmac, timingSafeEqual } from "node:crypto";

const json = (res: any, status: number, body: unknown) =>
  res.status(status).setHeader("Content-Type", "application/json").json(body);

const safeEqualHex = (a: string, b: string) => {
  if (!/^[a-f0-9]{64}$/i.test(a) || !/^[a-f0-9]{64}$/i.test(b)) return false;
  return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  const orderId = String(req.body?.razorpay_order_id || "");
  const paymentId = String(req.body?.razorpay_payment_id || "");
  const signature = String(req.body?.razorpay_signature || "");
  if (!orderId || !paymentId || !signature) {
    return json(res, 400, { error: "Missing Razorpay payment verification parameters." });
  }

  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const downloadSecret = process.env.PLAYBOOK_DOWNLOAD_SECRET?.trim();
  if (!keyId || !keySecret || !downloadSecret || downloadSecret.length < 32) {
    return json(res, 503, { error: "Payment verification or secure download is not configured." });
  }

  try {
    const expectedSignature = createHmac("sha256", keySecret).update(orderId + "|" + paymentId).digest("hex");
    if (!safeEqualHex(expectedSignature, signature)) {
      return json(res, 401, { error: "Invalid Razorpay payment signature." });
    }

    const headers = {
      Authorization: "Basic " + Buffer.from(keyId + ":" + keySecret).toString("base64"),
      Accept: "application/json",
    };
    const [orderResponse, paymentResponse] = await Promise.all([
      fetch("https://api.razorpay.com/v1/orders/" + encodeURIComponent(orderId), { headers }),
      fetch("https://api.razorpay.com/v1/payments/" + encodeURIComponent(paymentId), { headers }),
    ]);
    const [order, payment] = await Promise.all([orderResponse.json(), paymentResponse.json()]);
    if (!orderResponse.ok || !paymentResponse.ok) {
      return json(res, 502, { error: "Unable to verify the Razorpay payment with the payment provider." });
    }

    const currency = order.currency;
    const expectedAmount = currency === "INR" ? 49900 : currency === "USD" ? 999 : -1;
    const valid =
      order.id === orderId &&
      order.notes?.product === "digital-product-playbook" &&
      order.notes?.edition === "V5" &&
      order.amount === expectedAmount &&
      payment.order_id === orderId &&
      payment.id === paymentId &&
      payment.amount === expectedAmount &&
      payment.currency === currency &&
      payment.status === "captured";

    if (!valid) return json(res, 402, { error: "A captured payment for this playbook order could not be confirmed." });

    const payload = Buffer.from(JSON.stringify({
      product: "digital-product-playbook",
      orderId,
      paymentId,
      currency,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    })).toString("base64url");
    const tokenSignature = createHmac("sha256", downloadSecret).update(payload).digest("base64url");
    const downloadToken = payload + "." + tokenSignature;

    return json(res, 200, { paid: true, orderId, downloadToken, currency });
  } catch {
    return json(res, 500, { error: "Unable to verify Razorpay payment." });
  }
}
