import { createDecipheriv, createHmac, createHash, timingSafeEqual } from "node:crypto";

const json = (res: any, status: number, body: unknown) =>
  res.status(status).setHeader("Content-Type", "application/json").json(body);

const ASSET_URL = "https://raw.githubusercontent.com/sumittiwari4527-pro/planning-tools-by-therichlifeplan/main/private-assets/digital-product-playbook-v5.pdf.enc";

const decryptAsset = (data: Buffer, secret: string) => {
  // Encrypted format: 12-byte nonce || 16-byte AES-GCM auth tag || ciphertext.
  if (data.length < 29) throw new Error("Encrypted playbook file is malformed.");
  const nonce = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const ciphertext = data.subarray(28);
  const key = createHash("sha256").update(secret, "utf8").digest();
  const decipher = createDecipheriv("aes-256-gcm", key, nonce);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed." });
  }

  const secret = process.env.PLAYBOOK_DOWNLOAD_SECRET?.trim();
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const token = String(req.query?.token || "");
  if (!secret || secret.length < 32 || !keyId || !keySecret) {
    return json(res, 503, { error: "Secure downloads are not configured yet." });
  }

  let payload: any;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) throw new Error("Invalid token");
    const expected = createHmac("sha256", secret).update(parts[0]).digest();
    const actual = Buffer.from(parts[1], "base64url");
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw new Error("Invalid signature");
    payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (
      payload.product !== "digital-product-playbook" ||
      !payload.orderId ||
      !payload.paymentId ||
      !["INR", "USD"].includes(payload.currency) ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) throw new Error("Expired token");
  } catch {
    return json(res, 401, { error: "This download link is invalid or expired. Please contact support if you need help." });
  }

  try {
    const headers = {
      Authorization: "Basic " + Buffer.from(keyId + ":" + keySecret).toString("base64"),
      Accept: "application/json",
    };
    const [orderResponse, paymentResponse] = await Promise.all([
      fetch("https://api.razorpay.com/v1/orders/" + encodeURIComponent(payload.orderId), { headers }),
      fetch("https://api.razorpay.com/v1/payments/" + encodeURIComponent(payload.paymentId), { headers }),
    ]);
    const [order, payment] = await Promise.all([orderResponse.json(), paymentResponse.json()]);
    const expectedAmount = payload.currency === "INR" ? 49900 : 999;
    if (
      !orderResponse.ok ||
      !paymentResponse.ok ||
      order.id !== payload.orderId ||
      order.notes?.product !== "digital-product-playbook" ||
      order.notes?.edition !== "V5" ||
      order.amount !== expectedAmount ||
      order.currency !== payload.currency ||
      payment.order_id !== payload.orderId ||
      payment.id !== payload.paymentId ||
      payment.amount !== expectedAmount ||
      payment.currency !== payload.currency ||
      payment.status !== "captured"
    ) {
      return json(res, 403, { error: "A verified captured playbook payment is required for this download." });
    }

    const fileResponse = await fetch(ASSET_URL, { headers: { Accept: "application/octet-stream" } });
    if (!fileResponse.ok) {
      return json(res, 503, { error: "The encrypted playbook PDF has not been uploaded to the private-assets folder yet." });
    }
    const encrypted = Buffer.from(await fileResponse.arrayBuffer());
    const pdf = decryptAsset(encrypted, secret);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="TheRichLifePlan-Digital-Product-Playbook-V5.pdf"');
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.status(200).send(pdf);
  } catch {
    return json(res, 502, { error: "Unable to prepare the secure PDF download. Please try again." });
  }
}
