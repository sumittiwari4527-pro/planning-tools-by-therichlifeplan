import { createHmac, timingSafeEqual } from "node:crypto";

const json = (res: any, status: number, body: unknown) => res.status(status).setHeader("Content-Type", "application/json").json(body);
const sameHex = (a: string, b: string) => {
  if (!/^[a-f0-9]{64}$/i.test(a) || !/^[a-f0-9]{64}$/i.test(b)) return false;
  return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
};
const apiGet = (url: string, id: string, secret: string) => fetch(url, {
  headers: { Authorization: "Basic " + Buffer.from(id + ":" + secret).toString("base64"), Accept: "application/json" },
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return json(res, 405, { error: "Method not allowed." }); }
  const orderId = String(req.body?.razorpay_order_id || "");
  const paymentId = String(req.body?.razorpay_payment_id || "");
  const signature = String(req.body?.razorpay_signature || "");
  if (!orderId || !paymentId || !signature) return json(res, 400, { error: "Missing Razorpay verification parameters." });

  try {
    const id = process.env.RAZORPAY_KEY_ID?.trim();
    const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
    const downloadSecret = process.env.MONEYFLOW_DOWNLOAD_SECRET?.trim();
    if (!id || !secret) throw new Error("Razorpay server credentials are not configured.");
    if (!downloadSecret || downloadSecret.length < 32) throw new Error("MONEYFLOW_DOWNLOAD_SECRET must be configured with at least 32 characters.");

    const expected = createHmac("sha256", secret).update(orderId + "|" + paymentId).digest("hex");
    if (!sameHex(expected, signature)) return json(res, 401, { error: "Invalid Razorpay payment signature." });

    const [orderResponse, paymentResponse] = await Promise.all([
      apiGet("https://api.razorpay.com/v1/orders/" + encodeURIComponent(orderId), id, secret),
      apiGet("https://api.razorpay.com/v1/payments/" + encodeURIComponent(paymentId), id, secret),
    ]);
    const [order, payment] = await Promise.all([orderResponse.json(), paymentResponse.json()]);
    const valid = orderResponse.ok && paymentResponse.ok && order.id === orderId && order.amount === 29900 &&
      order.currency === "INR" && order.notes?.product === "moneyflow-budget-planner" &&
      payment.order_id === orderId && payment.id === paymentId && payment.amount === 29900 &&
      payment.currency === "INR" && payment.status === "captured";
    if (!valid) return json(res, 402, { error: "Payment has not been captured for this MoneyFlow order." });

    const payload = Buffer.from(JSON.stringify({
      product: "moneyflow-budget-planner", orderId, paymentId,
      exp: Math.floor(Date.now() / 1000) + 30 * 60,
    })).toString("base64url");
    const tokenSignature = createHmac("sha256", downloadSecret).update(payload).digest("base64url");
    return json(res, 200, { paid: true, orderId, paymentId, downloadToken: payload + "." + tokenSignature });
  } catch (error) {
    return json(res, 500, { error: error instanceof Error ? error.message : "Unable to verify payment." });
  }
}
