import { useEffect, useMemo, useState } from "react";
import { Download, Mail, Palette, Phone, QrCode, ShoppingCart, Sparkles } from "lucide-react";
import QRCode from "qrcode";
import {
  encryptParkingPayload,
  svgToDataUrl,
  type ParkingPayload,
  type ParkingTheme,
} from "./parking";
import { buildParkingTemplateSvg } from "./parkingTemplates";

type FormState = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  theme: ParkingTheme;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  vehicle: "",
  theme: "dark",
};

declare global {
  interface Window {
    LemonSqueezy?: {
      Setup: (options: { eventHandler: (event: { event: string; data?: { id?: string | number; identifier?: string; attributes?: { identifier?: string } } }) => void }) => void;
      Url: { Open: (url: string) => void };
      Refresh: () => void;
    };
    createLemonSqueezy?: () => void;
  }
}

const checkoutUrl = import.meta.env.VITE_LEMON_SQUEEZY_PARKING_CHECKOUT_URL as string | undefined;

const isValidPhone = (value: string) => value.replace(/\D/g, "").length >= 10;
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export function ParkingStickerBuilder() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [stickerDataUrl, setStickerDataUrl] = useState("");
  const [previewPayload, setPreviewPayload] = useState<ParkingPayload | null>(null);
  const [error, setError] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [finalOrderId, setFinalOrderId] = useState("");

  const canPreview =
    form.name.trim().length >= 2 &&
    isValidPhone(form.phone) &&
    isValidEmail(form.email) &&
    form.vehicle.trim().length >= 2;

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setPaymentComplete(false);
    setFinalOrderId("");
  };

  const generatePreview = async () => {
    if (!canPreview) return;

    setError("");

    try {
      const createdAt = Date.now();
      const payload: ParkingPayload = {
        v: 1,
        type: "parking",
        test: true,
        createdAt,
        expiresAt: createdAt + 24 * 60 * 60 * 1000,
        name: form.name.trim(),
        phone: form.phone.trim(),
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
        vehicle: form.vehicle.trim().toUpperCase(),
        theme: form.theme,
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

      setPreviewPayload(payload);
      setQrDataUrl(qr);
      setStickerDataUrl(
        svgToDataUrl(
          buildParkingTemplateSvg({
            theme: payload.theme,
            qrDataUrl: qr,
            vehicle: payload.vehicle,
          })
        )
      );
    } catch {
      setError("We couldn't generate the preview. Please try again.");
    }
  };

  const finalPayload = useMemo<ParkingPayload | null>(() => {
    if (!previewPayload || !paymentComplete) return null;
    return {
      ...previewPayload,
      test: false,
      expiresAt: undefined,
      orderId: finalOrderId || "paid",
      createdAt: Date.now(),
    };
  }, [previewPayload, paymentComplete, finalOrderId]);

  useEffect(() => {
    if (!finalPayload) return;

    let active = true;

    encryptParkingPayload(finalPayload)
      .then((encrypted) => {
        const url = `${window.location.origin}/parking?data=${encodeURIComponent(encrypted)}`;
        return QRCode.toDataURL(url, {
          errorCorrectionLevel: "H",
          margin: 2,
          width: 720,
          color: {
            dark: "#071421",
            light: "#ffffff",
          },
        });
      })
      .then((qr) => {
        if (!active) return;
        setQrDataUrl(qr);
        setStickerDataUrl(
          svgToDataUrl(
            buildParkingTemplateSvg({
              theme: finalPayload.theme,
              qrDataUrl: qr,
              vehicle: finalPayload.vehicle,
            })
          )
        );
      })
      .catch(() => {
        if (active) setError("Payment completed, but we couldn't prepare the final sticker. Please retry.");
      });

    return () => {
      active = false;
    };
  }, [finalPayload]);

  useEffect(() => {
    if (!checkoutUrl) return;

    const setup = () => {
      if (!window.LemonSqueezy) return false;
      window.LemonSqueezy.Setup({
        eventHandler: (event) => {
          if (event.event !== "Checkout.Success") return;
          const orderId =
            event.data?.attributes?.identifier ??
            event.data?.identifier ??
            event.data?.id ??
            "paid";
          setFinalOrderId(String(orderId));
          setPaymentComplete(true);
        },
      });
      return true;
    };

    if (setup()) return;

    const retry = window.setInterval(() => {
      if (setup()) window.clearInterval(retry);
    }, 250);

    const timeout = window.setTimeout(() => window.clearInterval(retry), 5000);

    return () => {
      window.clearInterval(retry);
      window.clearTimeout(timeout);
    };
  }, []);

  const startCheckout = () => {
    if (!previewPayload || !checkoutUrl) {
      setError("Checkout is not configured yet. Add the Lemon Squeezy parking checkout URL to the site environment.");
      return;
    }

    const url = new URL(checkoutUrl);
    url.searchParams.set("checkout[email]", form.email.trim());
    url.searchParams.set("checkout[name]", form.name.trim());

    if (window.LemonSqueezy) {
      window.LemonSqueezy.Url.Open(url.toString());
    } else {
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    }
  };

  const downloadSticker = () => {
    if (!stickerDataUrl) return;

    const link = document.createElement("a");
    link.href = stickerDataUrl;
    link.download = `richlifetools-smart-parking-${(form.vehicle || "sticker").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.svg`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] pt-16">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-[#eefaf3] px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-[#008d50]">
            <Sparkles size={12} /> Smart parking
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#0f1523] sm:text-5xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Create your Smart Parking Sticker
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6b7a99]">
            Add your contact details, choose a sticker style and see a live QR preview before you buy.
            Your preview QR is temporary; the purchased sticker gets a permanent QR.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr] lg:items-start">
          <section className="rounded-3xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0f1523]">Your details</h2>
              <p className="mt-1 text-sm text-[#6b7a99]">These details are encoded into the QR.</p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#33405a]">Name *</span>
                <input
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="e.g. Sumit Tiwari"
                  className="w-full rounded-2xl border border-[#dbe2ec] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#00b968] focus:ring-4 focus:ring-emerald-50"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#33405a]"><Phone size={15} /> Phone *</span>
                <input
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  inputMode="tel"
                  placeholder="+91 98765 43210"
                  className="w-full rounded-2xl border border-[#dbe2ec] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#00b968] focus:ring-4 focus:ring-emerald-50"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#33405a]"><Mail size={15} /> Email *</span>
                <input
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-[#dbe2ec] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#00b968] focus:ring-4 focus:ring-emerald-50"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#33405a]">Vehicle number *</span>
                <input
                  value={form.vehicle}
                  onChange={(event) => update("vehicle", event.target.value.toUpperCase())}
                  placeholder="DL01AB1234"
                  className="w-full rounded-2xl border border-[#dbe2ec] bg-white px-4 py-3 text-sm font-medium uppercase outline-none transition focus:border-[#00b968] focus:ring-4 focus:ring-emerald-50"
                />
              </label>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#33405a]"><Palette size={15} /> Sticker style</div>
                <div className="grid grid-cols-2 gap-3">
                  {(["dark", "light"] as const).map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => update("theme", theme)}
                      className={`rounded-2xl border p-3 text-left transition ${form.theme === theme ? "border-[#00b968] ring-4 ring-emerald-50" : "border-[#dbe2ec]"}`}
                    >
                      <div className={`relative h-20 overflow-hidden rounded-xl ${theme === "dark" ? "bg-[#03121d]" : "bg-white border border-slate-200"}`}>
                        <div className={`absolute inset-0 ${theme === "dark" ? "bg-[radial-gradient(circle_at_85%_10%,rgba(0,217,120,.35),transparent_40%)]" : "bg-[radial-gradient(circle_at_90%_5%,rgba(0,217,120,.18),transparent_42%)]"}`} />
                        <div className="relative flex h-full items-center gap-2 px-2">
                          <div className="min-w-0 flex-1">
                            <div className={`text-[10px] font-black leading-none ${theme === "dark" ? "text-white" : "text-[#071421]"}`}>SCAN TO</div>
                            <div className="text-[10px] font-black leading-none text-[#00d978]">CONTACT</div>
                            <div className={`text-[10px] font-black leading-none ${theme === "dark" ? "text-white" : "text-[#071421]"}`}>OWNER</div>
                          </div>
                          <div className="h-14 w-14 shrink-0 rounded-md border-[3px] border-[#00d978] bg-white p-1">
                            <div className="grid h-full w-full grid-cols-4 gap-0.5 bg-[#071421] opacity-90">
                              {Array.from({ length: 16 }).map((_, index) => (
                                <span key={index} className={index % 3 === 0 || index % 5 === 0 ? "bg-white" : "bg-[#071421]"} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm font-semibold capitalize text-[#0f1523]">{theme}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={generatePreview}
                disabled={!canPreview}
                className="w-full rounded-2xl bg-[#071421] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#102331] disabled:cursor-not-allowed disabled:bg-[#d9dfea]"
              >
                <span className="inline-flex items-center gap-2"><QrCode size={16} /> Preview your sticker</span>
              </button>

              {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            </div>
          </section>

          <section className="rounded-3xl border border-[#e4e8f0] bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#008d50]">Live preview</div>
                <h2 className="mt-1 text-xl font-bold text-[#0f1523]">Your sticker</h2>
              </div>
              {previewPayload && (
                <span className="rounded-full bg-[#eefaf3] px-3 py-1 text-xs font-semibold text-[#008d50]">
                  Preview QR
                </span>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-[#eef1f4] p-2 sm:p-4">
              {stickerDataUrl ? (
                <img src={stickerDataUrl} alt="Smart Parking Sticker preview" className="w-full rounded-xl" />
              ) : (
                <div className="flex min-h-[420px] items-center justify-center rounded-xl bg-[#f6f8fb] text-center">
                  <div className="max-w-sm px-6">
                    <QrCode className="mx-auto text-[#b5becd]" size={48} />
                    <p className="mt-4 text-sm font-semibold text-[#45516a]">Enter your details to preview the live sticker.</p>
                    <p className="mt-2 text-xs leading-5 text-[#8b95aa]">The QR is generated in your browser and points to your RichLifeTools parking page. Your purchased sticker gets a permanent QR.</p>
                  </div>
                </div>
              )}
            </div>

            {previewPayload && !paymentComplete && (
              <div className="mt-5 rounded-3xl border border-emerald-100 bg-[#eefaf3] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#0f1523]">Like the preview?</div>
                    <p className="mt-1 text-xs leading-5 text-[#527060]">
                      Your final sticker gets a permanent QR payload after successful checkout.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={startCheckout}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#00b968] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100"
                  >
                    <ShoppingCart size={16} /> Get yours
                  </button>
                </div>
                {!checkoutUrl && (
                  <p className="mt-3 text-xs text-[#7a6651]">
                    Checkout URL is not configured yet. The UI is ready for the Lemon Squeezy product checkout URL.
                  </p>
                )}
              </div>
            )}

            {paymentComplete && (
              <div className="mt-5 rounded-3xl border border-emerald-200 bg-[#eefaf3] p-5">
                <div className="text-sm font-bold text-[#0f1523]">Your sticker is ready 🎉</div>
                <p className="mt-1 text-xs leading-5 text-[#527060]">
                  Payment completed. The final QR is now marked as a purchased sticker.
                </p>
                <button
                  type="button"
                  onClick={downloadSticker}
                  disabled={!stickerDataUrl}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#071421] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  <Download size={16} /> Download sticker
                </button>
              </div>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Browser generated", "No backend or database required."],
                ["Encrypted QR", "AES-GCM payload with tamper detection."],
                ["Direct contact", "Phone and email become tappable after scan."],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl bg-[#f6f8fb] p-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#45516a]">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-[#8b95aa]">{description}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
