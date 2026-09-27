import { ArrowLeft, Check, FileText, ShieldCheck, Sparkles, ArrowRight, Phone, QrCode, Mail, Eye, Download } from "lucide-react";
import type { Product } from "./types";
import lightTemplateUrl from "../parking/assets/parking-template-light.svg?url";
import darkTemplateUrl from "../parking/assets/parking-template-dark.svg?url";

const typeLabels: Record<Product["type"], string> = {
  ebook: "Ebook",
  template: "Template",
  printable: "Printable",
  tool: "Digital Tool",
};

const parkingDetails = {
  headline: "Let people contact you when your parked car needs attention.",
  description:
    "A personalized QR parking sticker that gives someone a simple way to contact you without printing your phone number directly on the sticker.",
  highlights: [
    "Personalized QR code linked to your contact details",
    "Light and Dark sticker designs",
    "One-tap call and email from the contact page",
    "Free 24-hour personalized preview before purchase",
    "Downloadable SVG ready for printing",
    "No app required for the person scanning",
  ],
};

const productDetails: Record<string, {
  headline: string;
  description: string;
  highlights: string[];
}> = {
  "ai-life-upgrade": {
    headline: "Use AI to save time, think better and simplify everyday life.",
    description: "A practical, example-driven guide to using AI for work, planning, learning, family life and everyday tasks — without getting lost in technical jargon.",
    highlights: ["Ready-to-use prompts and workflows", "Real everyday examples", "Simple step-by-step guidance", "Designed for beginners and busy people"],
  },
  "smart-goal-planner": {
    headline: "Turn your goals into a practical monthly money plan.",
    description: "A goal-based planning system that helps you understand affordability, monthly allocations, timelines and trade-offs before you commit your money.",
    highlights: ["Plan multiple financial goals", "Account for expenses and EMIs", "See goal feasibility and timelines", "Build a practical SIP strategy"],
  },
  "mermaid-coloring-book": {
    headline: "A fun printable mermaid adventure for little artists.",
    description: "A kid-friendly printable coloring experience designed for young children, with simple illustrations and plenty of space to color.",
    highlights: ["Designed for ages 3–6", "24-page printable experience", "Simple, child-friendly illustrations", "Easy to print at home"],
  },
  "everyday-ai-prompt-pack": {
    headline: "Stop staring at a blank chat box.",
    description: "A collection of practical prompts you can copy, adapt and use for work, research, planning, writing and everyday problem solving.",
    highlights: ["Copy-and-use prompt library", "Work and productivity prompts", "Research and learning prompts", "Everyday life problem-solving prompts"],
  },
};

export function ProductDetailPage({
  product,
  onBack,
  onPrimaryAction,
}: {
  product: Product;
  onBack: () => void;
  onPrimaryAction?: () => void;
}) {
  const isParking = product.slug === "smart-parking-sticker";
  const detail = isParking ? parkingDetails : productDetails[product.slug] ?? {
    headline: product.shortDescription,
    description: product.shortDescription,
    highlights: ["Practical and easy to use", "Designed for everyday use", "Instant digital access"],
  };

  if (isParking) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] pt-16">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#6b7a99] hover:text-[#0f1523] cursor-pointer">
            <ArrowLeft size={15} /> Back to products
          </button>

          <section className="overflow-hidden rounded-[2rem] border border-[#dce8e2] bg-white shadow-sm">
            <div className="grid lg:grid-cols-[1fr_0.95fr]">
              <div className="relative overflow-hidden bg-[#06131e] px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="relative">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-emerald-300">
                    <Sparkles size={12} /> Smart parking
                  </div>
                  <h1 className="max-w-xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    Smart Parking Sticker
                  </h1>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{detail.headline}</p>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">{detail.description}</p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={onPrimaryAction}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#00c878] px-6 py-3.5 text-sm font-bold text-[#03121d] shadow-lg shadow-emerald-950/30 transition hover:bg-[#18d688] cursor-pointer"
                    >
                      Create My Sticker <ArrowRight size={16} />
                    </button>
                    <div className="text-sm text-slate-400">
                      <span className="font-bold text-white">₹199</span> · one-time
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">Preview your personalized sticker before you buy.</p>
                </div>
              </div>

              <div className="bg-[#f5f8f7] p-5 sm:p-8 lg:p-10">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                  {[
                    { src: darkTemplateUrl, label: "Dark design" },
                    { src: lightTemplateUrl, label: "Light design" },
                  ].map((item) => (
                    <div key={item.label} className="overflow-hidden rounded-3xl border border-[#dfe7e3] bg-white p-3 shadow-sm">
                      <div className="overflow-hidden rounded-2xl bg-slate-100">
                        <img src={item.src} alt={`Smart Parking Sticker — ${item.label}`} className="block aspect-[3/2] w-full object-cover" />
                      </div>
                      <div className="px-2 pb-1 pt-3 text-sm font-semibold text-[#33405a]">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-xs font-mono uppercase tracking-widest text-[#00a961]">How it works</div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0f1523] sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Park. Scan. Contact.</h2>
              <p className="mt-4 text-sm leading-7 text-[#6b7a99]">A simple experience for you and the person who needs to reach you.</p>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
              {[
                { icon: QrCode, number: "01", title: "Scan", text: "Someone scans the QR code on your parked-car sticker." },
                { icon: Eye, number: "02", title: "View", text: "Your contact page opens instantly in their browser." },
                { icon: Phone, number: "03", title: "Contact", text: "They can call or email you with one tap." },
              ].map(({ icon: Icon, number, title, text }) => (
                <div key={number} className="rounded-3xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eefaf3] text-[#00a961]"><Icon size={20} /></div>
                    <span className="text-xs font-mono text-[#b0b8c8]">{number}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-[#0f1523]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6b7a99]">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white py-2">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl bg-[#eefaf3] p-7 sm:p-9">
                <div className="text-xs font-mono uppercase tracking-widest text-[#008d50]">Why you'll use it</div>
                <h2 className="mt-2 text-2xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Built for everyday parking situations.</h2>
                <div className="mt-7 space-y-4">
                  {detail.highlights.map((item) => (
                    <div key={item} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#00a961] shadow-sm"><Check size={14} /></span>
                      <span className="text-sm leading-6 text-[#33405a]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#e4e8f0] bg-white p-7 shadow-sm sm:p-9">
                <div className="text-xs font-mono uppercase tracking-widest text-[#4f46e5]">Before you buy</div>
                <h2 className="mt-2 text-2xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See your personalized sticker first.</h2>
                <p className="mt-4 text-sm leading-7 text-[#6b7a99]">Enter your name, phone, email and vehicle number, choose Light or Dark, and generate a live preview. The preview QR is temporary and expires after 24 hours.</p>
                <button type="button" onClick={onPrimaryAction} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#008d50] hover:text-[#006e3e] cursor-pointer">
                  Create my preview <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>

          <section className="py-16 sm:py-20">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#4f46e5]">What's included</div>
                <h2 className="mt-2 text-3xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Everything you need.</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {detail.highlights.slice(0, 6).map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-[#e4e8f0] bg-white p-4 shadow-sm">
                      <Check size={16} className="mt-1 flex-shrink-0 text-[#00a961]" />
                      <span className="text-sm leading-6 text-[#45516a]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#e4e8f0] bg-white p-7 shadow-sm sm:p-9">
                <div className="flex items-center gap-3 text-[#008d50]"><ShieldCheck size={19} /><span className="text-xs font-mono uppercase tracking-widest">Privacy</span></div>
                <h2 className="mt-3 text-2xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your number isn't printed on the sticker.</h2>
                <p className="mt-4 text-sm leading-7 text-[#6b7a99]">The sticker contains a QR code. When someone scans it, the contact page gives them one-tap options to call or email you.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#e4e8f0] bg-white p-7 shadow-sm sm:p-10">
            <div className="text-xs font-mono uppercase tracking-widest text-[#06b6d4]">FAQ</div>
            <div className="mt-6 grid gap-7 md:grid-cols-2">
              {[
                ["Can I preview it before buying?", "Yes. Your personalized preview works for 24 hours, so you can see the design and scan the QR before purchasing."],
                ["Do I need an app?", "No. The QR opens the contact page in a normal mobile browser."],
                ["Can I choose the design?", "Yes. Choose between the Light and Dark sticker designs in the builder."],
                ["What do I receive after purchase?", "A personalized sticker with your permanent QR, downloadable as an SVG for printing."],
              ].map(([question, answer]) => (
                <div key={question}>
                  <h3 className="text-sm font-bold text-[#0f1523]">{question}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6b7a99]">{answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] bg-[#06131e] px-6 py-9 text-center sm:px-10 sm:py-12">
            <div className="mx-auto max-w-2xl">
              <div className="text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Ready to create yours?</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">Personalize it, preview it, then decide.</p>
              <button type="button" onClick={onPrimaryAction} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#00c878] px-7 py-3.5 text-sm font-bold text-[#03121d] hover:bg-[#18d688] cursor-pointer">
                Create My Sticker · ₹199 <ArrowRight size={16} />
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] pt-16">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6b7a99] hover:text-[#0f1523] cursor-pointer">
          <ArrowLeft size={15} /> Back to products
        </button>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#e4e8f0] bg-[#f3f5f9] p-6 shadow-sm">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl px-8 text-center shadow-xl" style={{ background: `linear-gradient(145deg, ${product.coverAccent}, #0f1523)` }}>
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-white/10" />
                <div className="relative whitespace-pre-line text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{product.coverLabel}</div>
              </div>
            </div>
          </div>
          <section>
            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider">
              <span className="text-[#4f46e5]">{product.category}</span><span className="text-[#c4cad9]">·</span><span className="text-[#6b7a99]">{typeLabels[product.type]}</span>
              {product.badge && <><span className="text-[#c4cad9]">·</span><span className="rounded-full bg-[#eef0fd] px-2.5 py-1 text-[#4f46e5]">{product.badge}</span></>}
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#0f1523] sm:text-5xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{product.name}</h1>
            <p className="mt-5 text-xl leading-relaxed text-[#4f46e5]">{detail.headline}</p>
            <p className="mt-5 text-base leading-7 text-[#6b7a99]">{detail.description}</p>
            <div className="mt-8 rounded-3xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div><div className="text-xs font-mono uppercase tracking-widest text-[#6b7a99]">Digital product</div><div className="mt-1 text-3xl font-bold text-[#0f1523]">{product.isFree ? "FREE" : `₹${product.price.toLocaleString("en-IN")}`}</div></div>
                <button type="button" disabled title="Checkout will be connected in the payment integration phase." className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl bg-[#d9ddea] px-6 py-3.5 text-sm font-semibold text-[#7a849b]">Get this product <Sparkles size={15} /></button>
              </div>
              <p className="mt-3 text-xs text-[#8b95aa]">Secure checkout will be connected in the next commerce phase. No payment flow is added to this PR.</p>
            </div>
            <div className="mt-10"><h2 className="text-2xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What you get</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{detail.highlights.map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-[#e4e8f0] bg-white p-4 shadow-sm"><div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check size={14} /></div><span className="text-sm leading-6 text-[#45516a]">{item}</span></div>)}</div></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-3 rounded-2xl bg-[#eef0fd] p-4"><FileText size={18} className="text-[#4f46e5]" /><span className="text-sm font-medium text-[#33405a]">Digital delivery</span></div><div className="flex items-center gap-3 rounded-2xl bg-[#eef0fd] p-4"><ShieldCheck size={18} className="text-[#4f46e5]" /><span className="text-sm font-medium text-[#33405a]">Simple, transparent pricing</span></div></div>
          </section>
        </div>
      </main>
    </div>
  );
}
