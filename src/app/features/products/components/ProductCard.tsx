import { ArrowRight } from "lucide-react";
import type { Product } from "../types";
import { ProductBadge } from "./ProductBadge";
import lightTemplateUrl from "../../parking/assets/parking-template-light.svg?url";
import darkTemplateUrl from "../../parking/assets/parking-template-dark.svg?url";

const typeLabels: Record<Product["type"], string> = {
  ebook: "Ebook",
  template: "Template",
  printable: "Printable",
  tool: "Digital Tool",
};

export function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#e4e8f0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50">
      <button onClick={() => onOpen(product)} className="block w-full text-left cursor-pointer" aria-label={`View ${product.name}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f3f5f9] p-5">
          {product.slug === "smart-parking-sticker" ? (
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-[#eaf4ef] shadow-lg transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#00b968]/10" />
              <div className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-[#00b968]/10" />
              <div className="relative flex w-[82%] max-w-[290px] items-center justify-center gap-3 rounded-2xl border border-[#d8e7df] bg-white p-3 shadow-md sm:gap-4 sm:p-4">
                <img
                  src={lightTemplateUrl}
                  alt=""
                  aria-hidden="true"
                  className="h-auto w-[48%] max-w-[135px] drop-shadow-sm transition-transform duration-500 group-hover:-translate-y-1"
                />
                <img
                  src={darkTemplateUrl}
                  alt=""
                  aria-hidden="true"
                  className="h-auto w-[48%] max-w-[135px] drop-shadow-sm transition-transform duration-500 group-hover:translate-y-1"
                />
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-[#bde7d1] bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#008d50] shadow-sm">
                Choose your design
              </div>
            </div>
          ) : (
            <div
              className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl px-8 text-center shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
              style={{ background: `linear-gradient(145deg, ${product.coverAccent}, #0f1523)` }}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-white/10" />
              <div className="relative whitespace-pre-line text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {product.coverLabel}
              </div>
            </div>
          )}
          {product.badge && (
            <div className="absolute left-8 top-8">
              <ProductBadge badge={product.badge} />
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="font-mono uppercase tracking-wider text-[#4f46e5]">{product.category}</span>
            <span className="text-[#c4cad9]">·</span>
            <span className="text-[#6b7a99]">{typeLabels[product.type]}</span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-[#0f1523] transition-colors group-hover:text-[#4f46e5]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {product.name}
          </h3>
          <p className="min-h-[48px] text-sm leading-relaxed text-[#6b7a99]">{product.shortDescription}</p>
          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-base font-semibold text-[#0f1523]">
              {product.isFree ? "FREE" : `₹${product.price.toLocaleString("en-IN")}`}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4f46e5]">
              View product <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}
