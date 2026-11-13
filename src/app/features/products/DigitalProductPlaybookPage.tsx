import { useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ChevronDown, Download, Globe2, Loader2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, any>) => {
      open: () => void;
      on?: (event: string, handler: (response: any) => void) => void;
    };
  }
}

type Currency = "INR" | "USD";

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

const previews = [
  { src: "/images/playbook-preview-ideas.webp", title: "48 ideas across six categories", caption: "Explore planning, money, home, career, travel and creator-business ideas." },
  { src: "/images/playbook-preview-chatgpt.webp", title: "Build with ChatGPT", caption: "See a worked example with a product brief, prompts and a structured output." },
  { src: "/images/playbook-preview-claude.webp", title: "Review with Claude", caption: "Use a second AI assistant to challenge assumptions and find gaps." },
  { src: "/images/playbook-preview-selling.webp", title: "Choose where to sell", caption: "Compare storefront options and understand the practical trade-offs." },
  { src: "/images/playbook-preview-etsy.webp", title: "Understand platform constraints", caption: "Review marketplace considerations, including India-specific notes." },
  { src: "/images/playbook-preview-launch.webp", title: "Follow a 30-day launch plan", caption: "Turn the idea into a measured launch experiment." },
];

export function DigitalProductPlaybookPage() {
  const [currency, setCurrency] = useState<Currency>(() => navigator.language.toLowerCase().includes("-in") ? "INR" : "USD");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ orderId: string; token: string } | null>(null);

  const price = currency === "INR" ? "₹499" : "$9.99";

  const startCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loadRazorpay();
      const orderResponse = await fetch("/api/razorpay/playbook-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, currency }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok || !order.orderId || !order.keyId) throw new Error(order.error || "Could not start checkout.");

      const checkout = new window.Razorpay!({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "RichLifeTools",
        description: "35+ Digital Product Ideas — From Idea to Income",
        prefill: { name, email },
        theme: { color: "#0f766e" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          setBusy(true);
          setError("");
          try {
            const verifiedResponse = await fetch("/api/razorpay/playbook-verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verified = await verifiedResponse.json();
            if (!verifiedResponse.ok || !verified.paid || !verified.downloadToken) {
              throw new Error(verified.error || "Payment verification failed.");
            }
            setReceipt({ orderId: verified.orderId, token: verified.downloadToken });
          } catch (verificationError) {
            setError(verificationError instanceof Error ? verificationError.message : "Payment was received but verification needs attention. Contact support with your payment ID.");
          } finally {
            setBusy(false);
          }
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

  const downloadUrl = receipt ? "/api/razorpay/playbook-download?token=" + encodeURIComponent(receipt.token) : "#";

  return (
    <div className="min-h-screen bg-[#f5f8f6] pb-24 pt-16 text-[#10213f]">
      <section className="relative overflow-hidden bg-[#0d1b35] text-white">
        <div className="pointer-events-none absolute -right-40 -top-36 h-[520px] w-[520px] rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-24 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:gap-16 lg:px-10">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
              <Sparkles size={14} /> TheRichLifePlan · Practical step-by-step guide
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.8rem]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              35+ digital product ideas.
              <span className="mt-2 block text-emerald-300">A clear path from idea to income.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Find a real customer problem, build a useful digital product with AI, package it professionally, choose where to sell and launch with a practical 30-day plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">45-page PDF</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">48 product ideas</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">Instant digital access</span>
            </div>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a href="#playbook-checkout" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-7 py-4 text-sm font-bold text-[#06231d] shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300">
                Get the playbook <ArrowRight size={17} />
              </a>
              <span className="text-sm text-slate-300">One-time payment · No subscription</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[440px]">
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur">
              <img src="/images/digital-product-playbook-cover.webp" alt="35+ Digital Product Ideas — From Idea to Income, TheRichLifePlan playbook cover" className="mx-auto block max-h-[590px] w-full rounded-2xl object-contain" />
            </div>
            <p className="mt-4 text-center text-xs tracking-wide text-slate-300">THE DIGITAL PRODUCT PLAYBOOK · PREMIUM EDITION</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">A practical system, not another idea list</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Build something useful — not just something pretty.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">The playbook takes you through the full journey: validate a buyer problem, create a focused first version, check the work, package the files and learn from a real launch.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["01", "Find a problem", "Start with a specific buyer and a recurring task worth solving."],
            ["02", "Validate the idea", "Use a 10-minute research sequence and a seven-factor scorecard."],
            ["03", "Create with AI", "Work through a practical ChatGPT and Claude-assisted Budget Kit example."],
            ["04", "Design and package", "Turn the deliverable into clear, usable files with a proper handover."],
            ["05", "Choose where to sell", "Compare Gumroad, Etsy and your own site before choosing a route."],
            ["06", "Launch and learn", "Use a 30-day plan and measure the buyer journey, not vanity numbers."],
          ].map(([number, title, copy]) => (
            <article key={number} className="rounded-2xl border border-[#dce7e1] bg-white p-6 shadow-sm">
              <div className="text-xs font-bold tracking-[0.18em] text-emerald-700">{number} / THE WORKFLOW</div>
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#dce7e1] bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Inside the playbook</div>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See what you’ll actually get.</h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-500">A few real pages from the supplied PDF, including the idea library, AI workflow, selling guides and launch plan.</p>
          </div>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {previews.map((preview) => (
              <article key={preview.src} className="overflow-hidden rounded-2xl border border-slate-200 bg-[#f8faf9]">
                <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                  <img src={preview.src} alt={preview.title + " — actual interior page preview"} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold">{preview.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{preview.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Five flagship blueprints</div>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Turn broad ideas into products people can use.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">Each blueprint explains the likely buyer, what to include, a sample deliverable and what to validate before building the full version.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["30-Day Meal Planning Kit", "Menus, grocery lists, pantry inventory and meal prep."],
              ["The Budget Kit", "Income, expenses, bills, debt and savings."],
              ["15-Minute Home Organisation System", "Small daily resets, room routines and chores."],
              ["AI Career Toolkit", "Resume prompts, interview practice and application tracking."],
              ["Family Vacation Planner", "Trip budget, itinerary, packing and savings."],
            ].map(([title, copy], index) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-[#dce7e1] bg-white p-5 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-800">0{index + 1}</div>
                <div><h3 className="font-bold leading-5">{title}</h3><p className="mt-2 text-sm leading-5 text-slate-600">{copy}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eaf3ee] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Worked example</div>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Follow one product from brief to launch.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">The First Paycheck Budget Kit is used as a continuous fictional case study, so you can see how the pieces fit together instead of reading disconnected tips.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["ChatGPT", "Structure the product and draft a useful first outline."],
                ["Spreadsheet", "Build the actual workbook tabs and test the formulas."],
                ["Claude", "Challenge the draft and identify missing cases."],
                ["Canva", "Design the quick-start guide and package the files."],
              ].map(([title, copy]) => <div key={title}><div className="text-sm font-bold text-emerald-800">{title}</div><p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p></div>)}
            </div>
            <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950">AI can draft and critique. The creator still checks accuracy, usability, formulas and customer trust before publishing.</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Who this is for</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
              {["Beginners who want to create their first digital product.", "Creators looking for a practical product to offer their audience.", "People who want to use ChatGPT and Claude with human quality checks.", "Sellers comparing their own website with platforms such as Gumroad and Etsy."].map(item => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-700" size={18} />{item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold">What it won’t promise</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
              {["No guaranteed sales or income claims.", "No shortcut that replaces validating demand or speaking to buyers.", "No promise that AI output is correct without human review.", "No resell-rights bundle: the playbook teaches you to create your own product."].map(item => <li key={item} className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-slate-500" size={18} />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="playbook-checkout" className="scroll-mt-24 bg-[#0d1b35] py-16 text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200"><BookOpen size={14} /> Premium edition · V5</div>
              <h2 className="mt-5 text-3xl font-bold sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Get the complete playbook.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">A practical reference you can work through at your own pace. Pay once and download the PDF after your payment is verified.</p>
              <ul className="mt-7 space-y-3 text-sm text-slate-200">
                {["45-page PDF including cover", "48 ideas across six categories", "Five detailed product blueprints", "ChatGPT + Claude worked example", "Gumroad, Etsy and own-site selling guides", "30-day launch plan, prompts and worksheets"].map(item => <li key={item} className="flex items-start gap-3"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-300" />{item}</li>)}
              </ul>
              <div className="mt-8 flex items-center gap-3 text-xs text-slate-300"><LockKeyhole size={15} /> Secure Razorpay checkout · One-time payment</div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white p-6 text-[#10213f] shadow-2xl sm:p-8">
              {receipt ? (
                <div className="py-5 text-center">
                  <CheckCircle2 size={48} className="mx-auto text-emerald-600" />
                  <h3 className="mt-4 text-2xl font-bold">Payment verified!</h3>
                  <p className="mt-2 text-sm text-slate-600">Your order reference is <strong>{receipt.orderId}</strong>.</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">This secure download link expires in 24 hours. Keep a copy of your PDF after downloading.</p>
                  <a href={downloadUrl} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white hover:bg-emerald-700"><Download size={17} /> Download the PDF</a>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div><div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Choose your region</div><h3 className="mt-1 text-xl font-bold">Your playbook</h3></div>
                    <Globe2 className="text-emerald-700" size={24} />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                    <button type="button" onClick={() => setCurrency("INR")} className={"rounded-lg px-3 py-2.5 text-sm font-bold transition " + (currency === "INR" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500")}>India · INR</button>
                    <button type="button" onClick={() => setCurrency("USD")} className={"rounded-lg px-3 py-2.5 text-sm font-bold transition " + (currency === "USD" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500")}>International · USD</button>
                  </div>
                  <div className="mt-5 rounded-2xl bg-[#edf5f0] p-5">
                    <div className="text-sm font-medium text-slate-600">One-time price</div>
                    <div className="mt-1 text-4xl font-extrabold tracking-tight">{price}</div>
                    <div className="mt-1 text-xs text-slate-500">No recurring charges</div>
                  </div>
                  <form onSubmit={startCheckout} className="mt-5 space-y-4">
                    <label className="block text-sm font-semibold text-slate-700">Your name<input required minLength={2} maxLength={80} autoComplete="name" value={name} onChange={e => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
                    <label className="block text-sm font-semibold text-slate-700">Email for your order<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
                    <button type="submit" disabled={busy} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">{busy ? <><Loader2 size={17} className="animate-spin" /> Preparing secure checkout…</> : "Pay " + price + " securely"}</button>
                  </form>
                  {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-5 text-red-700">{error}</p>}
                  <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={15} className="mt-0.5 shrink-0" />Payment is verified on our server before the download is enabled. Card details are handled by Razorpay.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <h2 className="text-center text-3xl font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently asked questions</h2>
        <div className="mt-8 space-y-3">
          {[
            ["What do I receive after payment?", "You receive access to download the 45-page PDF playbook. The download becomes available after Razorpay payment verification."],
            ["Do I need paid ChatGPT, Claude or Canva subscriptions?", "No. The playbook says paid subscriptions are optional. You can begin with free accounts and upgrade only if their limits become a blocker."],
            ["Does the playbook guarantee that I will make money?", "No. It gives you a process for researching, building and testing an offer. Sales depend on the product, audience, demand and execution."],
            ["Can I resell or share the PDF?", "The playbook is for personal use. Please do not resell, republish or redistribute the PDF."],
            ["Can I use the ideas for any niche?", "The ideas span planning, money, food and home, career and learning, travel and events, and creator business. Validate the buyer and problem in your own niche."],
            ["What if I have trouble downloading the file?", "Contact us through the RichLifeTools contact page and include your Razorpay order reference so we can help."],
          ].map(([question, answer]) => (
            <details key={question} className="group rounded-xl border border-slate-200 bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold">{question}<ChevronDown size={17} className="shrink-0 text-emerald-700 transition-transform group-open:rotate-180" /></summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
