import { createHmac, timingSafeEqual } from "node:crypto";
import { careerPackageStore } from "./package-store";
import { createZip } from "./zip";

const sendError = (res: any, status: number, error: string) =>
  res.status(status).setHeader("Content-Type", "application/json").json({ error });

const safeEqual = (a: string, b: string) => {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendError(res, 405, "Method not allowed.");
  }

  try {
    const token = String(req.query?.token || "");
    const secret = process.env.CAREER_DOWNLOAD_SECRET?.trim();
    if (!secret || !token) return sendError(res, 401, "Invalid download link.");

    const parts = token.split(".");
    if (parts.length !== 4) return sendError(res, 401, "Invalid download link.");

    const [packageId, orderId, expiresText, signature] = parts;
    const expiresAt = Number(expiresText);
    if (!packageId || !orderId || !Number.isSafeInteger(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
      return sendError(res, 401, "This download link has expired.");
    }

    const payload = `${packageId}.${orderId}.${expiresAt}`;
    const expected = createHmac("sha256", secret).update(payload).digest("base64url");
    if (!safeEqual(expected, signature)) return sendError(res, 401, "Invalid download link.");

    const pkg = await careerPackageStore.getPackage(packageId);
    if (!pkg) return sendError(res, 404, "Package not found.");

    const zip = createZip(pkg.files);
    const filename = `${packageId}-application-kit.zip`;

    res.status(200);
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "private, no-store");
    return res.end(Buffer.from(zip));
  } catch {
    return sendError(res, 500, "Unable to prepare the download.");
  }
}
