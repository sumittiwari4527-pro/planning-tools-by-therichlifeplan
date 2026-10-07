import { createHmac, randomUUID } from "node:crypto";
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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  try {
    const { keyId, keySecret } = getCredentials();
    const packageId = String(req.body?.packageId || "").trim();
    const pkg = await careerPackageStore.getPackage(packageId);

    if (!pkg) return json(res, 400, { error: "This package is not available." });

    const receipt = `RL-CJ-${randomUUID().replace(/-/g, "").slice(0, 28)}`;
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: PRICE,
        currency: "INR",
        receipt,
        partial_payment: false,
        notes: {
          product: PRODUCT,
          packageId: pkg.id,
          country: pkg.country,
          jobType: pkg.jobType,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok || !data?.id) {
      return json(res, 502, { error: data?.error?.description || "Unable to create Razorpay order." });
    }

    return json(res, 200, {
      keyId,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      packageId: pkg.id,
    });
  } catch (error) {
    return json(res, 500, { error: error instanceof Error ? error.message : "Unable to create Razorpay order." });
  }
}
