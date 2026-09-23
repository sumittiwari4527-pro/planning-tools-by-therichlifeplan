import { ArrowLeft, Check, FileText, ShieldCheck, Sparkles } from "lucide-react";
import type { Product } from "./types";

const typeLabels: Record<Product["type"], string> = {
  ebook: "Ebook",
  template: "Template",
  printable: "Printable",
  tool: "Digital Tool",
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
}: {
  product: Product;
  onBack: () => void;
}) {
  const detail = productDetails[product.slug] ?? {
    headline: product.shortDescription,
    description: product.shortDescription,
    highlights: ["Practical and easy to use", "Designed for everyday use", "Instant digital access"],
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] pt-16">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#6b7a99] hover:text-[#0f1523] cursor-pointer">
          <ArrowLeft size={15} /> Back to products
        </button>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#e4e8f0] bg-[#f3f5f9] p-6 shadow-sm">
              <div
                className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl px-8 text-center shadow-xl"
                style={{ background: `linear-gradient(145deg, ${product.coverAccent}, #0f1523)` }}
              >
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-white/10" />
                <div className="relative whitespace-pre-line text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  {product.coverLabel}
                </div>
              </div>
            </div>
          </div>

          <section>
            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider">
              <span className="text-[#4f46e5]">{product.category}</span>
              <span className="text-[#c4cad9]">·</span>
              <span className="text-[#6b7a99]">{typeLabels[product.type]}</span>
              {product.badge && (
                <>
                  <span className="text-[#c4cad9]">·</span>
                  <span className="rounded-full bg-[#eef0fd] px-2.5 py-1 text-[#4f46e5]">{product.badge}</span>
                </>
              )}
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#0f1523] sm:text-5xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {product.name}
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-[#4f46e5]">{detail.headline}</p>
            <p className="mt-5 text-base leading-7 text-[#6b7a99]">{detail.description}</p>

            <div className="mt-8 rounded-3xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[#6b7a99]">Digital product</div>
                  <div className="mt-1 text-3xl font-bold text-[#0f1523]">
                    {product.isFree ? "FREE" : `₹${product.price.toLocaleString("en-IN")}`}
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  title="Checkout will be connected in the payment integration phase."
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl bg-[#d9ddea] px-6 py-3.5 text-sm font-semibold text-[#7a849b]"
                >
                  Get this product
                  <Sparkles size={15} />
                </button>
              </div>
              <p className="mt-3 text-xs text-[#8b95aa]">Secure checkout will be connected in the next commerce phase. No payment flow is added to this PR.</p>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What you get</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {detail.highlights.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-[#e4e8f0] bg-white p-4 shadow-sm">
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check size={14} />
                    </div>
                    <span className="text-sm leading-6 text-[#45516a]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-[#eef0fd] p-4">
                <FileText size={18} className="text-[#4f46e5]" />
                <span className="text-sm font-medium text-[#33405a]">Digital delivery</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#eef0fd] p-4">
                <ShieldCheck size={18} className="text-[#4f46e5]" />
                <span className="text-sm font-medium text-[#33405a]">Simple, transparent pricing</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
