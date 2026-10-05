import { createHmac, timingSafeEqual } from "node:crypto";

const json = (res: any, status: number, body: unknown) => {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
};

const getCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) throw new Error("Razorpay server credentials are not configured.");
  return { keyId, keySecret };
};

const safeEqualHex = (a: string, b: string) => {
  if (!/^[a-f0-9]{64}$/i.test(a) || !/^[a-f0-9]{64}$/i.test(b)) return false;
  return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
};

const fetchRazorpay = async (url: string, keyId: string, keySecret: string) => {
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  return fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });
};

const getVerifiedOrder = async (orderId: string, paymentId: string, keyId: string, keySecret: string) => {
  const orderResponse = await fetchRazorpay(
    `https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`,
    keyId,
    keySecret
  );
  const order = await orderResponse.json();
  if (!orderResponse.ok) throw new Error("Unable to fetch the Razorpay order.");

  const paymentResponse = await fetchRazorpay(
    `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,
    keyId,
    keySecret
  );
  const payment = await paymentResponse.json();
  if (!paymentResponse.ok) throw new Error("Unable to fetch the Razorpay payment.");

  const notes = order.notes || {};
  const valid =
    order.id === orderId &&
    order.amount === 19900 &&
    order.currency === "INR" &&
    payment.order_id === orderId &&
    payment.id === paymentId &&
    payment.amount === 19900 &&
    payment.currency === "INR" &&
    payment.status === "captured" &&
    notes.product === "smart-parking-sticker";

  if (!valid) throw new Error("Razorpay payment has not been captured for this Smart Parking Sticker order.");

  return {
    paid: true,
    orderId,
    paymentId,
    name: String(notes.name || ""),
    phone: String(notes.phone || ""),
    email: String(notes.email || ""),
    vehicle: String(notes.vehicle || ""),
    theme: notes.theme === "light" || notes.theme === "dark" ? notes.theme : "dark",
  };
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  const body = req.body || {};
  const orderId = String(body.razorpay_order_id || "");
  const paymentId = String(body.razorpay_payment_id || "");
  const signature = String(body.razorpay_signature || "");

  if (!orderId || !paymentId || !signature) {
    return json(res, 400, { error: "Missing Razorpay payment verification parameters." });
  }

  try {
    const { keyId, keySecret } = getCredentials();
    const expected = createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");

    if (!safeEqualHex(expected, signature)) {
      return json(res, 401, { error: "Invalid Razorpay payment signature." });
    }

    const result = await getVerifiedOrder(orderId, paymentId, keyId, keySecret);
    return json(res, 200, result);
  } catch (error) {
    return json(res, 402, {
      error: error instanceof Error ? error.message : "Unable to verify Razorpay payment.",
    });
  }
}
