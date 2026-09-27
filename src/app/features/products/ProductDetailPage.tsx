import { ArrowLeft, Check, FileText, ShieldCheck, Sparkles, ArrowRight, Phone, QrCode, MessageCircle, CarFront, Clock3 } from "lucide-react";
import type { Product } from "./types";
import lightTemplateUrl from "../parking/assets/parking-template-light.svg?url";
import darkTemplateUrl from "../parking/assets/parking-template-dark.svg?url";

import option2CarUrl from "./assets/option2-car-hero.webp?url";

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
      <div className="min-h-screen bg-[#f4f8f7]">
        <main className="mx-auto max-w-7xl">
          <section className="relative isolate min-h-[700px] overflow-hidden bg-[#03151c] text-white sm:min-h-[760px] lg:min-h-[680px]">
            <div
              className="absolute inset-0 bg-[#03151c] bg-no-repeat lg:left-[42%]"
              style={{ backgroundImage: `url(${option2CarUrl})`, backgroundSize: "cover", backgroundPosition: "center center" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,21,28,0.88)_0%,rgba(3,21,28,0.48)_48%,rgba(3,21,28,0.7)_100%)] lg:bg-[linear-gradient(90deg,rgba(3,21,28,0.99)_0%,rgba(3,21,28,0.94)_35%,rgba(3,21,28,0.52)_60%,rgba(3,21,28,0.12)_100%)]" />

            <div className="relative z-10 flex min-h-[700px] flex-col justify-center px-6 pb-10 pt-16 sm:min-h-[760px] sm:px-10 sm:pb-14 sm:pt-20 lg:min-h-[680px] lg:px-14 lg:py-14">
              <div className="max-w-[650px]">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-emerald-300/5 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.22em] text-emerald-200">
                  <Sparkles size={13} /> Smart parking
                </div>

                <h1
                  className="mt-7 max-w-[650px] text-[2.8rem] font-bold leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.6rem]"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  <span className="block">Someone needs</span>
                  <span className="block">to reach you?</span>
                </h1>

                <p className="mt-6 max-w-[590px] text-[1.02rem] leading-7 text-slate-100 sm:text-lg">
                  Scan the sticker to contact the owner — without printing your phone number on the sticker.
                </p>

                <div className="mt-8 grid max-w-[610px] grid-cols-3 gap-2 sm:gap-5">
                  {[
                    { icon: QrCode, title: "Scan", text: "They scan your sticker." },
                    { icon: MessageCircle, title: "Contact", text: "The contact page opens." },
                    { icon: Phone, title: "Reach You", text: "You get the call or email." },
                  ].map(({ icon: Icon, title, text }, index) => (
                    <div key={title} className="relative min-w-0">
                      {index > 0 && <ArrowRight className="absolute -left-4 top-5 text-white/80 sm:-left-5 sm:top-6" size={17} />}
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/80 bg-[#06262a]/55 text-[#00e890] sm:h-14 sm:w-14">
                        <Icon size={21} />
                      </div>
                      <div className="mt-3 text-sm font-bold text-white sm:text-base">{title}</div>
                      <div className="mt-1 max-w-[135px] text-[10px] leading-4 text-slate-200 sm:text-xs sm:leading-5">{text}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex w-full max-w-[610px] items-center gap-3 sm:gap-6">
                  <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="inline-flex min-h-[58px] min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#00d980] px-3 text-sm font-bold text-[#03121d] shadow-xl shadow-emerald-950/30 transition hover:bg-[#18e895] cursor-pointer sm:min-h-[62px] sm:px-5 sm:text-base"
                  >
                    Create My Sticker <ArrowRight size={19} />
                  </button>
                  <div className="shrink-0 border-l border-white/45 pl-3 sm:pl-6">
                    <div className="text-2xl font-bold text-white sm:text-3xl">₹199</div>
                    <div className="mt-1 text-xs text-slate-300 sm:text-sm">one-time</div>
                  </div>
                </div>

                <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-200 sm:text-sm">
                  <span className="mt-0.5 text-lg leading-4 text-emerald-200">◉</span>
                  Preview your personalized sticker before you buy.
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 overflow-hidden rounded-b-[1.75rem] bg-white shadow-sm lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Keep your number off the sticker", text: "Your phone number is not printed on the sticker." },
              { icon: Clock3, title: "Quick & easy to use", text: "Create, preview and order in minutes." },
              { icon: CarFront, title: "Perfect for parked cars", text: "Useful when your parked car needs attention." },
              { icon: ShieldCheck, title: "Simple, useful & safe", text: "No app is required to contact you." },
            ].map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className={
                  "flex flex-col items-center px-4 py-7 text-center sm:px-6 " +
                  (index < 2 ? "border-b border-[#e6eee9] lg:border-b-0 " : "") +
                  (index % 2 === 0 ? "border-r border-[#e6eee9] lg:border-r-0 " : "") +
                  (index > 0 ? "lg:border-l lg:border-[#e6eee9]" : "")
                }
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7faf1] text-[#00a961]">
                  <Icon size={21} />
                </div>
                <div className="mt-4 text-sm font-bold leading-5 text-[#0f1523]">{title}</div>
                <div className="mt-1.5 max-w-[180px] text-xs leading-5 text-[#6b7a99]">{text}</div>
              </div>
            ))}
          </section>

          <section className="px-5 py-14 sm:px-8 sm:py-20">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[#008d50]">Choose your design</div>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0f1523] sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Stylish. Clear. Effective.</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-[#6b7a99]">Pick a design that matches your style. Both designs use the same personalized QR experience.</p>
                <button type="button" onClick={onPrimaryAction} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#008d50] hover:text-[#006e3e] cursor-pointer">
                  Create my sticker <ArrowRight size={15} />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { src: darkTemplateUrl, label: "Dark Design" },
                  { src: lightTemplateUrl, label: "Light Design" },
                ].map((item) => (
                  <div key={item.label} className="overflow-hidden rounded-3xl border border-[#dfe7e3] bg-white p-3 shadow-sm">
                    <div className="overflow-hidden rounded-2xl bg-slate-100">
                      <img src={item.src} alt={"Smart Parking Sticker — " + item.label} className="block aspect-[3/2] w-full object-cover" />
                    </div>
                    <div className="px-2 pb-1 pt-3 text-sm font-semibold text-[#33405a]">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-5 rounded-[2rem] bg-white p-7 shadow-sm sm:mx-8 sm:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-xs font-mono uppercase tracking-widest text-[#008d50]">How it works</div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0f1523] sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Scan. Contact. Reach you.</h2>
              <p className="mt-3 text-sm leading-6 text-[#6b7a99]">A simple experience for you and the person who needs to reach you.</p>
            </div>
            <div className="mx-auto mt-9 grid max-w-5xl gap-4 md:grid-cols-3">
              {[
                { icon: QrCode, title: "Scan", text: "Someone scans the QR code on your parked-car sticker." },
                { icon: MessageCircle, title: "Contact", text: "The contact page opens in their browser, with no app required." },
                { icon: Phone, title: "Reach you", text: "They can call or email you with one tap." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-3xl border border-[#e4e8f0] bg-[#f9fbfa] p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7faf1] text-[#00a961]"><Icon size={20} /></div>
                  <h3 className="mt-5 text-lg font-bold text-[#0f1523]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6b7a99]">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-5 mt-8 grid gap-8 sm:mx-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-[#eefaf3] p-7 sm:p-9">
              <div className="text-xs font-mono uppercase tracking-widest text-[#008d50]">Before you buy</div>
              <h2 className="mt-2 text-2xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See your personalized sticker first.</h2>
              <p className="mt-4 text-sm leading-7 text-[#6b7a99]">Enter your details, choose Light or Dark, and generate a live preview before you pay. Your preview QR is temporary and expires after 24 hours.</p>
              <button type="button" onClick={onPrimaryAction} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#008d50] hover:text-[#006e3e] cursor-pointer">Create my preview <ArrowRight size={15} /></button>
            </div>
            <div className="rounded-3xl border border-[#e4e8f0] bg-white p-7 shadow-sm sm:p-9">
              <div className="flex items-center gap-3 text-[#008d50]"><ShieldCheck size={19} /><span className="text-xs font-mono uppercase tracking-widest">Privacy</span></div>
              <h2 className="mt-3 text-2xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your number isn't printed on the sticker.</h2>
              <p className="mt-4 text-sm leading-7 text-[#6b7a99]">The sticker contains a QR code. When someone scans it, the contact page gives them one-tap options to call or email you.</p>
            </div>
          </section>

          <section className="px-5 py-14 sm:px-8 sm:py-20">
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
                <div className="text-xs font-mono uppercase tracking-widest text-[#4f46e5]">Simple purchase</div>
                <h2 className="mt-2 text-2xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Personalize. Preview. Buy.</h2>
                <p className="mt-4 text-sm leading-7 text-[#6b7a99]">Create your sticker first. You will see the personalized preview before the payment step.</p>
                <button type="button" onClick={onPrimaryAction} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#00c878] px-5 py-3 text-sm font-bold text-[#03121d] hover:bg-[#18d688] cursor-pointer">Create My Sticker · ₹199 <ArrowRight size={16} /></button>
              </div>
            </div>
          </section>

          <section className="mx-5 rounded-[2rem] border border-[#e4e8f0] bg-white p-7 shadow-sm sm:mx-8 sm:p-10">
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

          <section className="mx-5 mb-8 mt-8 rounded-[2rem] bg-[#06131e] px-6 py-9 text-center sm:mx-8 sm:px-10 sm:py-12">
            <div className="mx-auto max-w-2xl">
              <div className="text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Ready to create yours?</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">Personalize it, preview it, then decide.</p>
              <button type="button" onClick={onPrimaryAction} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#00c878] px-7 py-3.5 text-sm font-bold text-[#03121d] hover:bg-[#18d688] cursor-pointer">Create My Sticker · ₹199 <ArrowRight size={16} /></button>
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
