import { createHmac, timingSafeEqual } from "node:crypto";

const json = (res: any, status: number, body: unknown) => res.status(status).setHeader("Content-Type", "application/json").json(body);

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return json(res, 405, { error: "Method not allowed." }); }
  const secret = process.env.MONEYFLOW_DOWNLOAD_SECRET?.trim();
  const token = String(req.query?.token || "");
  const asset = String(req.query?.asset || "");
  if (!secret || secret.length < 32) return json(res, 503, { error: "Secure downloads are not configured yet." });

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
  const storageToken = process.env.MONEYFLOW_ASSET_STORAGE_TOKEN?.trim();
  const sourceUrl = asset === "workbook" ? process.env.MONEYFLOW_WORKBOOK_PRIVATE_URL?.trim()
    : asset === "guide" ? process.env.MONEYFLOW_GUIDE_PRIVATE_URL?.trim() : "";
  if (!id || !keySecret || !sourceUrl) return json(res, 503, { error: "The digital file is not configured. Please contact support." });

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

    // Files must live in private storage, never in this public repository or /public.
    const fileResponse = await fetch(sourceUrl, { headers: storageToken ? { Authorization: "Bearer " + storageToken } : {} });
    if (!fileResponse.ok) return json(res, 502, { error: "Unable to retrieve the file from private storage." });
    const bytes = Buffer.from(await fileResponse.arrayBuffer());
    const workbook = asset === "workbook";
    res.setHeader("Content-Type", workbook ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="' + (workbook ? "MoneyFlow_Global_Budget_Planner.xlsx" : "MoneyFlow_README_and_Quick_Start_Guide.pdf") + '"');
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.status(200).send(bytes);
  } catch {
    return json(res, 502, { error: "Unable to prepare the secure download. Please try again." });
  }
}
