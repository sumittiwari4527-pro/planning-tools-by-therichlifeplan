import { useEffect, useState } from "react";
import { Car, Mail, Phone, ShoppingCart, ShieldCheck } from "lucide-react";
import { decryptParkingPayload, isPreviewExpired, type ParkingPayload } from "./parking";

declare global {
  interface Window {
    __parkingLemonCheckout?: () => void;
  }
}

export function ParkingScanPage({ encryptedPayload }: { encryptedPayload: string | null }) {
  const [payload, setPayload] = useState<ParkingPayload | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    if (!encryptedPayload) {
      setLoading(false);
      setError(true);
      return;
    }

    decryptParkingPayload(encryptedPayload)
      .then((value) => {
        if (active) setPayload(value);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [encryptedPayload]);

  const checkoutUrl = import.meta.env.VITE_LEMON_SQUEEZY_PARKING_CHECKOUT_URL as string | undefined;
  const expired = payload ? isPreviewExpired(payload) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] px-4 pt-24 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-[#e4e8f0] bg-white p-10 shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#dfe4ef] border-t-[#00b968]" />
          <p className="mt-5 text-sm text-[#6b7a99]">Opening parking details…</p>
        </div>
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] px-4 pt-24">
        <div className="mx-auto max-w-md rounded-3xl border border-[#e4e8f0] bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto text-[#ef4444]" size={34} />
          <h1 className="mt-4 text-2xl font-bold text-[#0f1523]">Invalid parking QR</h1>
          <p className="mt-2 text-sm leading-6 text-[#6b7a99]">This QR code could not be read by RichLifeTools.</p>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] px-4 pt-24">
        <div className="mx-auto max-w-md rounded-3xl border border-[#e4e8f0] bg-white p-8 text-center shadow-sm">
          <Car className="mx-auto text-[#00b968]" size={38} />
          <div className="mt-5 inline-flex rounded-full bg-[#eefaf3] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#008d50]">
            Preview expired
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#0f1523]">This preview sticker has expired</h1>
          <p className="mt-3 text-sm leading-6 text-[#6b7a99]">
            Create a Smart Parking Sticker to keep your contact details available to anyone who needs to reach you.
          </p>
          {checkoutUrl && (
            <a
              href={checkoutUrl}
              className="lemonsqueezy-button mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#00b968] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-100"
            >
              <ShoppingCart size={16} /> Get your sticker
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 pb-16 pt-24">
      <main className="mx-auto max-w-lg">
        <div className="overflow-hidden rounded-[2rem] border border-[#e4e8f0] bg-white shadow-xl shadow-slate-100">
          <div className="bg-[#071421] px-6 py-7 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00d978] text-sm font-black text-[#071421]">RL</div>
              <div>
                <div className="text-lg font-bold">TheRichLifePlan</div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-300">Smart Parking</div>
              </div>
            </div>
            <h1 className="mt-8 text-3xl font-bold tracking-tight">Please contact the owner</h1>
            <p className="mt-2 text-sm text-slate-300">This vehicle has a Smart Parking Sticker.</p>
          </div>

          <div className="space-y-4 p-6">
            <div className="rounded-2xl bg-[#f6f8fb] p-5">
              <div className="flex items-center gap-3 text-[#6b7a99]">
                <Car size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider">Vehicle</span>
              </div>
              <div className="mt-2 text-xl font-bold tracking-wide text-[#0f1523]">{payload.vehicle}</div>
            </div>

            <div className="rounded-2xl border border-[#e4e8f0] p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#6b7a99]">Owner</div>
              <div className="mt-2 text-xl font-bold text-[#0f1523]">{payload.name}</div>
              <div className="mt-1 text-sm text-[#6b7a99]">Use one of the options below to get in touch.</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${encodeURIComponent(payload.phone)}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00b968] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-100"
              >
                <Phone size={17} /> Call Owner
              </a>
              {payload.email ? (
                <a
                  href={`mailto:${encodeURIComponent(payload.email)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#dbe2ec] bg-white px-5 py-4 text-sm font-bold text-[#0f1523]"
                >
                  <Mail size={17} /> Email Owner
                </a>
              ) : (
                <div className="inline-flex items-center justify-center rounded-2xl bg-[#f6f8fb] px-5 py-4 text-sm text-[#8b95aa]">
                  Email not provided
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-[#eefaf3] p-4 text-sm text-[#2f5c45]">
              <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#00a85a]" />
              <span>Contact details are displayed only through this Smart Parking QR.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
