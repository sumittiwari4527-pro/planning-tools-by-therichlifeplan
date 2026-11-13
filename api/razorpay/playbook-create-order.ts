import { randomUUID } from "node:crypto";

const json = (res: any, status: number, body: unknown) =>
  res.status(status).setHeader("Content-Type", "application/json").json(body);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) return json(res, 503, { error: "Razorpay server credentials are not configured." });

  try {
    const name = String(req.body?.name || "").trim().slice(0, 80);
    const email = String(req.body?.email || "").trim().slice(0, 254);
    const currency = String(req.body?.currency || "").toUpperCase();

    if (name.length < 2) return json(res, 400, { error: "Enter your name." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res, 400, { error: "Enter a valid email address." });
    if (currency !== "INR" && currency !== "USD") return json(res, 400, { error: "Choose INR or USD." });

    // Prices are fixed on the server; never trust an amount sent by the browser.
    const amount = currency === "INR" ? 49900 : 999;
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(keyId + ":" + keySecret).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: "DP-" + randomUUID().replace(/-/g, "").slice(0, 24),
        partial_payment: false,
        notes: {
          product: "digital-product-playbook",
          edition: "V5",
          name,
          email,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok || !data?.id) {
      return json(res, 502, { error: data?.error?.description || "Unable to create Razorpay order. Check that this currency is enabled on your Razorpay account." });
    }

    return json(res, 200, { keyId, orderId: data.id, amount: data.amount, currency: data.currency });
  } catch {
    return json(res, 500, { error: "Unable to create Razorpay order." });
  }
}
