import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Copy, Download, ShoppingBag } from "lucide-react";
import QRCode from "qrcode";
import { productPath } from "../../utils/routes";
import { encryptParkingPayload, svgToDataUrl, type ParkingTheme } from "./parking";
import { buildParkingTemplateSvg } from "./parkingTemplates";

export const PARKING_ORDER_SUCCESS_STORAGE_KEY = "richlifetools_parking_order_success";

type SuccessData = { orderId: string; stickerDataUrl?: string; vehicle?: string; deliveryType?: "digital" | "physical"; addressLine?: string; shippingEmail?: string; shippingPhone?: string; city?: string; state?: string; pincode?: string; country?: string; };

const buildFinalSticker = async ({
  name,
  phone,
  email,
  vehicle,
  theme,
  orderId,
}: {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  theme: ParkingTheme;
  orderId: string;
}) => {
  const payload = {
    v: 1 as const,
    type: "parking" as const,
    test: false,
    createdAt: Date.now(),
    orderId,
    name,
    phone,
    ...(email ? { email } : {}),
    vehicle,
    theme,
  };

  const encrypted = await encryptParkingPayload(payload);
  const url = `${window.location.origin}/parking?data=${encodeURIComponent(encrypted)}`;
  const qr = await QRCode.toDataURL(url, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 720,
    color: {
      dark: "#071421",
      light: "#ffffff",
    },
  });

  return svgToDataUrl(
    await buildParkingTemplateSvg({
      theme,
      qrDataUrl: qr,
    })
  );
};

export function ParkingOrderSuccessPage() {
  const [data, setData] = useState<SuccessData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyRazorpayOrder = async () => {
      const params = new URLSearchParams(window.location.search);
      const razorpayOrderId = params.get("razorpay_order_id");
      if (razorpayOrderId) {
        setLoading(true);
        setError("");

        try {
          const response = await fetch(
            `/api/razorpay/verify-order?razorpay_order_id=${encodeURIComponent(razorpayOrderId)}`,
            { headers: { Accept: "application/json" } }
          );
          const result = await response.json();

          if (!response.ok || !result?.paid) {
            throw new Error(result?.error || "We couldn't verify the Razorpay payment.");
          }

          const deliveryType = result.deliveryType === "physical" ? "physical" : "digital";
          const stickerDataUrl = deliveryType === "physical" ? undefined : await buildFinalSticker({
            name: String(result.name || ""), phone: String(result.phone || ""), email: String(result.email || ""),
            vehicle: String(result.vehicle || ""), theme: result.theme === "light" ? "light" : result.theme === "physical" ? "physical" : "dark", orderId: String(result.orderId),
          });
          const successData: SuccessData = {
            orderId: String(result.orderId), ...(stickerDataUrl ? { stickerDataUrl } : {}), vehicle: String(result.vehicle || ""), deliveryType,
            addressLine: String(result.addressLine || ""), shippingEmail: String(result.shippingEmail || ""), shippingPhone: String(result.shippingPhone || ""), city: String(result.city || ""), state: String(result.state || ""), pincode: String(result.pincode || ""), country: String(result.country || ""),
          };

          sessionStorage.setItem(PARKING_ORDER_SUCCESS_STORAGE_KEY, JSON.stringify(successData));
          setData(successData);
          window.history.replaceState({}, "", window.location.pathname);
        } catch (verificationError) {
          setError(
            verificationError instanceof Error
              ? verificationError.message
              : "We couldn't verify the Razorpay payment. Please contact support."
          );
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const stored = sessionStorage.getItem(PARKING_ORDER_SUCCESS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as SuccessData;
          if (parsed.orderId && (parsed.stickerDataUrl || parsed.deliveryType === "physical")) setData(parsed);
        }
      } catch {
        // Ignore invalid or unavailable session storage.
      }
    };

    void verifyRazorpayOrder();
  }, []);

  const downloadSticker = async () => {
    if (!data?.stickerDataUrl) return;

    const filename = `richlifetools-smart-parking-${(data.vehicle || "sticker")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()}.svg`;

    try {
      const response = await fetch(data.stickerDataUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.open(data.stickerDataUrl, "_blank", "noopener,noreferrer");
    }
  };

  const copyOrderNumber = async () => {
    if (!data?.orderId) return;

    try {
      await navigator.clipboard.writeText(data.orderId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] pt-16">
      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center px-4 py-12 sm:px-6">
        <section className="w-full rounded-3xl border border-[#e4e8f0] bg-white p-6 text-center shadow-sm sm:p-10">
          {loading ? (
            <>
              <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-[#eefaf3]">
                <CheckCircle2 size={34} className="text-[#00a961]" />
              </div>
              <div className="mt-6 text-xs font-mono uppercase tracking-widest text-[#008d50]">
                Verifying payment
              </div>
              <h1
                className="mt-2 text-3xl font-bold tracking-tight text-[#0f1523] sm:text-4xl"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Preparing your sticker…
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6b7a99]">
                Your Razorpay payment is being verified and your permanent QR sticker is being prepared.
              </p>
            </>
          ) : error ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <CheckCircle2 size={34} className="text-red-500" />
              </div>
              <div className="mt-6 text-xs font-mono uppercase tracking-widest text-red-600">
                Payment verification
              </div>
              <h1
                className="mt-2 text-3xl font-bold tracking-tight text-[#0f1523] sm:text-4xl"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                We couldn't verify this payment
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6b7a99]">
                {error} If you were charged, please contact support with your Razorpay payment details.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eefaf3]">
                <CheckCircle2 size={34} className="text-[#00a961]" />
              </div>

              <div className="mt-6 text-xs font-mono uppercase tracking-widest text-[#008d50]">
                Order confirmed
              </div>
              <h1
                className="mt-2 text-3xl font-bold tracking-tight text-[#0f1523] sm:text-4xl"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Thank you for your order! 🎉
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6b7a99]">
                {data?.deliveryType === "physical" ? "Your ₹399 payment was successful. We’ll print your personalized Smart Parking Sticker and dispatch it to the address below. Please save your order number for reference." : "Your Smart Parking Sticker payment was successful and your permanent QR sticker is ready. Please save your order number below for future reference."}
              </p>

              {data ? (
                <>
                  <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#dbe2ec] bg-[#f8f9fb] p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#8b95aa]">
                      Order number
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="break-all text-lg font-bold tracking-wide text-[#0f1523]">
                        {data.orderId}
                      </span>
                      <button
                        type="button"
                        onClick={copyOrderNumber}
                        aria-label="Copy order number"
                        className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[#dbe2ec] bg-white p-2 text-[#45516a] transition hover:border-[#00b968] hover:text-[#008d50]"
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-[#8b95aa]">
                      {copied ? "Order number copied." : "Keep this number for future support or reference."}
                    </div>
                  </div>

                  {data.deliveryType === "physical" ? (
                    <div className="mx-auto mt-6 max-w-md rounded-2xl border border-emerald-100 bg-[#f5fffa] p-5 text-left">
                      <div className="text-sm font-bold text-[#0f1523]">Shipping address</div>
                      <p className="mt-2 text-sm leading-6 text-[#45516a]">{[data.addressLine, data.city, data.state, data.pincode, data.country || "India"].filter(Boolean).join(", ")}</p>
                      <div className="mt-4 border-t border-emerald-100 pt-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#8b95aa]">Delivery contact</div>
                        {data.shippingEmail && <p className="mt-2 break-words text-sm text-[#45516a]">Email: {data.shippingEmail}</p>}
                        {data.shippingPhone && <p className="mt-1 text-sm text-[#45516a]">Phone: {data.shippingPhone}</p>}
                      </div>
                      <p className="mt-3 text-xs leading-5 text-[#6b7a99]">Your order will be printed and shipped manually. Dispatch and tracking details will be shared using your delivery contact details when available.</p>
                    </div>
                  ) : (
                    <button type="button" onClick={downloadSticker} className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#071421] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#102331]"><Download size={17} /> Download your sticker</button>
                  )}
                </>
              ) : (
                <div className="mx-auto mt-8 max-w-md rounded-2xl bg-[#fff8ed] p-4 text-left text-sm leading-6 text-[#7a6651]">
                  This confirmation page was opened without the current order details. Please return to the
                  product page and complete the checkout again if you need to regenerate the download.
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={productPath("smart-parking-sticker")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#dbe2ec] bg-white px-5 py-3 text-sm font-semibold text-[#33405a] transition hover:border-emerald-200 hover:bg-[#f8f9fb]"
                >
                  Buy another sticker <ShoppingBag size={15} />
                </a>
                <a
                  href="/products"
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#6b7a99] transition hover:text-[#0f1523]"
                >
                  Back to products <ArrowRight size={15} />
                </a>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
