import { createDecipheriv, createHmac, createHash, timingSafeEqual } from "node:crypto";

const json = (res: any, status: number, body: unknown) => res.status(status).setHeader("Content-Type", "application/json").json(body);
const ASSET_BASE = "https://raw.githubusercontent.com/sumittiwari4527-pro/planning-tools-by-therichlifeplan/feat/moneyflow-budget-planner/private-assets/";
const ASSETS: Record<string, { path: string; mime: string; filename: string }> = {
  workbook: { path: "MoneyFlow_Global_Budget_Planner_v1_9_4_Excel_and_Sheets.xlsx.enc", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename: "MoneyFlow_Global_Budget_Planner_v1_9_4.xlsx" },
  guide: { path: "MoneyFlow_README_and_Quick_Start_Guide.pdf.enc", mime: "application/pdf", filename: "MoneyFlow_README_and_Quick_Start_Guide.pdf" },
};

// Encrypted file format: 12-byte nonce || 16-byte AES-GCM auth tag || ciphertext.
// The AES-256 key is SHA-256(MONEYFLOW_DOWNLOAD_SECRET). Never commit plaintext assets or the key.
const decryptAsset = (data: Buffer, secret: string) => {
  if (data.length < 29) throw new Error("Encrypted asset is malformed.");
  const nonce = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const ciphertext = data.subarray(28);
  const key = createHash("sha256").update(secret, "utf8").digest();
  const decipher = createDecipheriv("aes-256-gcm", key, nonce);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return json(res, 405, { error: "Method not allowed." }); }
  const secret = process.env.MONEYFLOW_DOWNLOAD_SECRET?.trim();
  const token = String(req.query?.token || "");
  const asset = String(req.query?.asset || "");
  const assetInfo = ASSETS[asset];
  if (!secret || secret.length < 32) return json(res, 503, { error: "Secure downloads are not configured yet." });
  if (!assetInfo) return json(res, 400, { error: "Unknown download." });

  let payload: any;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) throw new Error("Invalid token");
    const expected = createHmac("sha256", secret).update(parts[0]).digest();
    const actual = Buffer.from(parts[1], "base64url");
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw new Error("Invalid signature");
    payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (payload.product !== "moneyflow-budget-planner" || !payload.orderId || !payload.paymentId || payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Expired token");
  } catch {
    return json(res, 401, { error: "This download link is invalid or expired. Please contact support if you need help." });
  }

  const id = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!id || !keySecret) return json(res, 503, { error: "Payment verification is not configured." });

  try {
    const headers = { Authorization: "Basic " + Buffer.from(id + ":" + keySecret).toString("base64"), Accept: "application/json" };
    const [orderResponse, paymentResponse] = await Promise.all([
      fetch("https://api.razorpay.com/v1/orders/" + encodeURIComponent(payload.orderId), { headers }),
      fetch("https://api.razorpay.com/v1/payments/" + encodeURIComponent(payload.paymentId), { headers }),
    ]);
    const [order, payment] = await Promise.all([orderResponse.json(), paymentResponse.json()]);
    if (!orderResponse.ok || !paymentResponse.ok || order.notes?.product !== "moneyflow-budget-planner" ||
      order.amount !== 29900 || order.currency !== "INR" || payment.order_id !== payload.orderId ||
      payment.id !== payload.paymentId || payment.amount !== 29900 || payment.currency !== "INR" || payment.status !== "captured") {
      return json(res, 403, { error: "A verified captured MoneyFlow payment is required for this download." });
    }

    const fileResponse = await fetch(ASSET_BASE + assetInfo.path, { headers: { Accept: "application/octet-stream" } });
    if (!fileResponse.ok) return json(res, 503, { error: "The encrypted product file is not present in the repository yet." });
    const encrypted = Buffer.from(await fileResponse.arrayBuffer());
    const bytes = decryptAsset(encrypted, secret);
    res.setHeader("Content-Type", assetInfo.mime);
    res.setHeader("Content-Disposition", 'attachment; filename="' + assetInfo.filename + '"');
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.status(200).send(bytes);
  } catch {
    return json(res, 502, { error: "Unable to prepare the secure download. Please try again." });
  }
}
