import { createHmac, timingSafeEqual } from "node:crypto";
import { careerPackageStore } from "./package-store";

const json = (res: any, status: number, body: unknown) => {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
};

const PRICE = 69900;
const PRODUCT = "tech-job-application-kit";

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
  return fetch(url, { headers: { Authorization: `Basic ${auth}`, Accept: "application/json" } });
};

const signToken = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

const createDownloadToken = (packageId: string, orderId: string, secret: string) => {
  const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60;
  const payload = `${packageId}.${orderId}.${expiresAt}`;
  return `${payload}.${signToken(payload, secret)}`;
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

    const orderResponse = await fetchRazorpay(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, keyId, keySecret);
    const order = await orderResponse.json();
    if (!orderResponse.ok) throw new Error("Unable to fetch the Razorpay order.");

    const paymentResponse = await fetchRazorpay(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, keyId, keySecret);
    const payment = await paymentResponse.json();
    if (!paymentResponse.ok) throw new Error("Unable to fetch the Razorpay payment.");

    const packageId = String(order?.notes?.packageId || "");
    const pkg = await careerPackageStore.getPackage(packageId);

    const valid =
      pkg &&
      order.id === orderId &&
      order.amount === PRICE &&
      order.currency === "INR" &&
      order.notes?.product === PRODUCT &&
      payment.order_id === orderId &&
      payment.id === paymentId &&
      payment.amount === PRICE &&
      payment.currency === "INR" &&
      payment.status === "captured";

    if (!valid) throw new Error("Razorpay payment has not been captured for this package.");

    const downloadSecret = process.env.CAREER_DOWNLOAD_SECRET?.trim();
    if (!downloadSecret) throw new Error("Career download secret is not configured.");

    return json(res, 200, {
      paid: true,
      orderId,
      paymentId,
      packageId: pkg.id,
      packageLabel: `${pkg.country} — ${pkg.jobType}`,
      downloadUrl: `/api/career/download?token=${encodeURIComponent(createDownloadToken(pkg.id, orderId, downloadSecret))}`,
    });
  } catch (error) {
    return json(res, 402, { error: error instanceof Error ? error.message : "Unable to verify Razorpay payment." });
  }
}
