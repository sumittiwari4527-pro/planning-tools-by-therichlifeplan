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

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed." });
  }

  const query = req.query || {};
  const paymentId = String(query.razorpay_payment_id || "");
  const paymentLinkId = String(query.razorpay_payment_link_id || "");
  const referenceId = String(query.razorpay_payment_link_reference_id || "");
  const status = String(query.razorpay_payment_link_status || "");
  const signature = String(query.razorpay_signature || "");

  if (!paymentId || !paymentLinkId || !referenceId || !signature) {
    return json(res, 400, { error: "Missing Razorpay callback parameters." });
  }

  try {
    const { keyId, keySecret } = getCredentials();
    const signedPayload = \`\${paymentLinkId}|\${referenceId}|\${status}|\${paymentId}\`;
    const expected = createHmac("sha256", keySecret).update(signedPayload).digest("hex");

    if (!safeEqualHex(expected, signature)) {
      return json(res, 401, { error: "Invalid Razorpay callback signature." });
    }

    const auth = Buffer.from(\`\${keyId}:\${keySecret}\`).toString("base64");
    const response = await fetch(
      \`https://api.razorpay.com/v1/payment_links/\${encodeURIComponent(paymentLinkId)}\`,
      { headers: { Authorization: \`Basic \${auth}\` } }
    );
    const link = await response.json();

    if (!response.ok) return json(res, 502, { error: "Unable to verify the Razorpay payment." });

    const captured = Array.isArray(link.payments)
      && link.payments.some((payment: any) => payment.payment_id === paymentId && payment.status === "captured");

    if (
      link.status !== "paid" ||
      link.amount !== 19900 ||
      link.amount_paid !== 19900 ||
      link.reference_id !== referenceId ||
      !captured
    ) {
      return json(res, 402, { error: "Razorpay payment has not been captured." });
    }

    const notes = link.notes || {};
    if (notes.product !== "smart-parking-sticker") {
      return json(res, 400, { error: "Invalid Smart Parking Sticker order." });
    }

    return json(res, 200, {
      paid: true,
      orderId: referenceId,
      paymentId,
      name: String(notes.name || ""),
      phone: String(notes.phone || ""),
      email: String(notes.email || ""),
      vehicle: String(notes.vehicle || ""),
      theme: notes.theme === "light" ? "light" : "dark",
    });
  } catch (error) {
    return json(res, 500, {
      error: error instanceof Error ? error.message : "Unable to verify Razorpay payment.",
    });
  }
}
