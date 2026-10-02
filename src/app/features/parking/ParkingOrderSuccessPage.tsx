import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Copy, Download, ShoppingBag } from "lucide-react";
import { productPath } from "../../utils/routes";

export const PARKING_ORDER_SUCCESS_STORAGE_KEY = "richlifetools_parking_order_success";

declare global {
  interface Window {
    LemonSqueezy?: {
      Url: {
        Close: () => void;
      };
    };
  }
}


type SuccessData = {
  orderId: string;
  stickerDataUrl: string;
  vehicle?: string;
};

export function ParkingOrderSuccessPage() {
  const [data, setData] = useState<SuccessData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // The success event can navigate here while Lemon Squeezy is still
    // transitioning its confirmation modal. Close it again from the destination
    // page so navigation cannot leave the overlay behind.
    const closeCheckout = () => {
      try {
        window.LemonSqueezy?.Url.Close();
      } catch {
        // Lemon.js may not be ready yet; a later retry handles that case.
      }
    };

    closeCheckout();
    const retryDelays = [250, 750, 1500];
    const timers = retryDelays.map((delay) => window.setTimeout(closeCheckout, delay));

    try {
      const stored = sessionStorage.getItem(PARKING_ORDER_SUCCESS_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as SuccessData;
      if (parsed.orderId && parsed.stickerDataUrl) {
        setData(parsed);
      }
    } catch {
      // Ignore invalid or unavailable session storage.
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
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
            Your Smart Parking Sticker payment was successful and your permanent QR sticker is ready.
            Please save your order number below for future reference.
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

              <button
                type="button"
                onClick={downloadSticker}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#071421] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#102331]"
              >
                <Download size={17} /> Download your sticker
              </button>
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
        </section>
      </main>
    </div>
  );
}
