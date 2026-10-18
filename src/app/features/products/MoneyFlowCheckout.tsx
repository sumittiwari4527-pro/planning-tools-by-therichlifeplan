import { useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Download, Loader2, ShieldCheck } from "lucide-react";
import moneyFlowPreviewUrl from "./assets/moneyflow-dashboard-preview.svg?url";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on?: (event: string, handler: (response: any) => void) => void;
    };
  }
}

const loadRazorpay = () => new Promise<void>((resolve, reject) => {
  if (window.Razorpay) return resolve();
  const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
  if (existing) {
    existing.addEventListener("load", () => resolve(), { once: true });
    existing.addEventListener("error", () => reject(new Error("Could not load Razorpay Checkout.")), { once: true });
    return;
  }
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.onload = () => resolve();
  script.onerror = () => reject(new Error("Could not load Razorpay Checkout."));
  document.head.appendChild(script);
});

export function MoneyFlowCheckout({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ orderId: string; token: string } | null>(null);
  const lemonSqueezyCheckoutUrl = import.meta.env.VITE_LEMON_SQUEEZY_MONEYFLOW_CHECKOUT_URL?.trim() || "";

  const startCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loadRazorpay();
      const orderResponse = await fetch("/api/razorpay/moneyflow-create-order", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok || !order.orderId) throw new Error(order.error || "Could not start checkout.");
      const checkout = new window.Razorpay!({
        key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId,
        name: "RichLifeTools", description: "MoneyFlow Global Budget Planner",
        prefill: { name, email }, theme: { color: "#0f766e" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          setBusy(true);
          try {
            const verifiedResponse = await fetch("/api/razorpay/moneyflow-verify-payment", {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(response),
            });
            const verified = await verifiedResponse.json();
            if (!verifiedResponse.ok || !verified.paid || !verified.downloadToken) throw new Error(verified.error || "Payment verification failed.");
            setReceipt({ orderId: verified.orderId, token: verified.downloadToken });
          } catch (verificationError) {
            setError(verificationError instanceof Error ? verificationError.message : "Payment verification failed. If charged, contact support with your order ID.");
          } finally { setBusy(false); }
        },
        modal: { ondismiss: () => setBusy(false), escape: true, confirm_close: true },
      });
      checkout.on?.("payment.failed", (failure: any) => {
        setError(failure?.error?.description || "Payment did not complete. Please try again.");
        setBusy(false);
      });
      setBusy(false);
      checkout.open();
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      setBusy(false);
    }
  };

  const downloadUrl = (asset: "workbook" | "guide") => "/api/razorpay/moneyflow-download?asset=" + asset + "&token=" + encodeURIComponent(receipt!.token);

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 pb-16 pt-24">
      <main className="mx-auto max-w-3xl">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0f766e]"><ArrowLeft size={16} /> Back to MoneyFlow</button>
        <section className="overflow-hidden rounded-3xl border border-[#dce8e5] bg-white shadow-sm">
          <div className="bg-[#073b36] px-6 py-8 text-white sm:px-9">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-teal-200">MONEYFLOW · DIGITAL TOOL</div>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Your money, with a plan.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50">One practical workbook for budgets, transactions and savings goals. One-time payment, no account or bank connection required.</p>
          </div>
          <div className="grid gap-8 p-6 sm:grid-cols-[1fr_0.85fr] sm:p-9">
            <div>
              {receipt ? (
                <div className="rounded-2xl bg-teal-50 p-5">
                  <CheckCircle2 className="text-teal-700" size={32} />
                  <h2 className="mt-3 text-xl font-bold text-slate-900">Payment verified</h2>
                  <p className="mt-2 text-sm text-slate-600">Order: <strong>{receipt.orderId}</strong></p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Secure download links expire in 30 minutes.</p>
                  <div className="mt-5 grid gap-3">
                    <a href={downloadUrl("workbook")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white"><Download size={16} /> Download Excel workbook</a>
                    <a href={downloadUrl("guide")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 px-4 py-3 text-sm font-semibold text-[#0f766e]"><Download size={16} /> Download Quick Start PDF</a>
                  </div>
                </div>
              ) : (
                <form onSubmit={startCheckout} className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900">Checkout details</h2>
                  <label className="block text-sm font-medium text-slate-700">Your name<input required minLength={2} maxLength={80} autoComplete="name" value={name} onChange={e => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
                  <label className="block text-sm font-medium text-slate-700">Email for your order<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" /></label>
                  <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 py-3.5 text-sm font-bold text-white disabled:opacity-60">{busy ? <><Loader2 className="animate-spin" size={16} /> Preparing secure checkout…</> : "Pay ₹299 with Razorpay"}</button>
                  <div className="flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" /> OR <span className="h-px flex-1 bg-slate-200" /></div>
                  {lemonSqueezyCheckoutUrl ? <a href={lemonSqueezyCheckoutUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 hover:border-teal-600 hover:text-[#0f766e]">Pay with Lemon Squeezy</a> : <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Lemon Squeezy checkout is not configured yet.</p>}
                  <p className="text-xs leading-5 text-slate-500">Lemon Squeezy opens its hosted checkout in a new tab. Site-verified downloads currently activate automatically for Razorpay purchases only.</p>
                  {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm leading-5 text-red-700">{error}</p>}
                  <p className="text-xs leading-5 text-slate-500">Your payment is verified on our server before downloads are enabled.</p>
                </form>
              )}
            </div>
            <aside className="rounded-2xl bg-[#f1f8f6] p-5">
              <img src={moneyFlowPreviewUrl} alt="MoneyFlow budget planner dashboard preview" className="mb-5 block w-full rounded-xl border border-teal-100 bg-white" />
              <div className="text-xs font-bold uppercase tracking-widest text-[#0f766e]">Included · ₹299</div>
              <h2 className="mt-2 text-xl font-bold text-slate-900">MoneyFlow bundle</h2>
              <ul className="mt-4 space-y-3 text-sm leading-5 text-slate-600">
                <li>✓ Excel budget planner workbook</li><li>✓ Quick Start Guide PDF</li><li>✓ Dashboard, budget vs actual and charts</li><li>✓ Up to 5,000 transaction rows</li><li>✓ Savings goals and emergency-fund target</li><li>✓ Manual entry; no bank connection</li>
              </ul>
              <div className="mt-5 flex items-center gap-2 border-t border-teal-100 pt-4 text-xs leading-5 text-slate-500"><ShieldCheck size={18} className="shrink-0 text-[#0f766e]" /> Payment verified server-side.</div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
