import { createHmac } from "node:crypto";

const json = (res: any, status: number, body: unknown) => {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
};

const getCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) throw new Error("Razorpay server credentials are not configured.");
  return { keyId, keySecret };
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

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed." });
  }

  const orderId = String(req.query?.razorpay_order_id || "");
  if (!orderId) return json(res, 400, { error: "Missing Razorpay order id." });

  try {
    const { keyId, keySecret } = getCredentials();

    const orderResponse = await fetchRazorpay(
      `https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`,
      keyId,
      keySecret
    );
    const order = await orderResponse.json();
    if (!orderResponse.ok) return json(res, 502, { error: "Unable to fetch the Razorpay order." });

    const paymentsResponse = await fetchRazorpay(
      `https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}/payments`,
      keyId,
      keySecret
    );
    const payments = await paymentsResponse.json();
    if (!paymentsResponse.ok) return json(res, 502, { error: "Unable to fetch Razorpay payment details." });

    const capturedPayment = Array.isArray(payments?.items)
      ? payments.items.find((payment: any) =>
          payment.order_id === orderId &&
          payment.amount === 19900 &&
          payment.currency === "INR" &&
          payment.status === "captured"
        )
      : null;

    const notes = order.notes || {};
    if (
      order.id !== orderId ||
      order.amount !== 19900 ||
      order.currency !== "INR" ||
      notes.product !== "smart-parking-sticker" ||
      !capturedPayment
    ) {
      return json(res, 402, { error: "Razorpay payment has not been captured for this order." });
    }

    return json(res, 200, {
      paid: true,
      orderId,
      paymentId: capturedPayment.id,
      name: String(notes.name || ""),
      phone: String(notes.phone || ""),
      email: String(notes.email || ""),
      vehicle: String(notes.vehicle || ""),
      theme: notes.theme === "light" ? "light" : "dark",
    });
  } catch (error) {
    return json(res, 500, {
      error: error instanceof Error ? error.message : "Unable to verify Razorpay order.",
    });
  }
}
