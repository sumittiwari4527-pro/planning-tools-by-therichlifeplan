import { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { products, getFeaturedProducts, getProductsByCategory } from "../../data/products/products";
import { productCategories } from "../../data/products/categories";
import type { Product } from "./types";
import { ProductFilters } from "./components/ProductFilters";
import { ProductGrid } from "./components/ProductGrid";

export function ProductsPage({ onOpenProduct }: { onOpenProduct: (product: Product) => void }) {
  const [activeCategory, setActiveCategory] = useState<(typeof productCategories)[number]["id"]>("all");
  const featured = getFeaturedProducts();

  const visibleProducts = useMemo(
    () => getProductsByCategory(activeCategory),
    [activeCategory]
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] pt-16">
      <section className="relative overflow-hidden border-b border-[#e4e8f0] bg-white">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-cyan-100/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-[#eef0fd] px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-[#4f46e5]">
              <Sparkles size={12} />
              Digital products
            </div>
            <h1 className="text-5xl font-bold leading-[1.04] tracking-tight text-[#0f1523] sm:text-6xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Useful things for a <span className="text-[#4f46e5]">richer life.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#6b7a99] sm:text-lg">
              Practical guides, templates, printables and digital tools designed to help you use AI better, manage money, save time and make everyday life easier.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <section className="mb-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-xs font-mono uppercase tracking-widest text-[#4f46e5]">Handpicked</div>
              <h2 className="text-3xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Featured products</h2>
            </div>
          </div>
          <ProductGrid products={featured} onOpen={onOpenProduct} />
        </section>

        <section>
          <div className="mb-8">
            <div className="mb-2 text-xs font-mono uppercase tracking-widest text-[#06b6d4]">Browse the collection</div>
            <h2 className="mb-6 text-3xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>All products</h2>
            <ProductFilters
              categories={productCategories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
          <ProductGrid products={visibleProducts} onOpen={onOpenProduct} />
        </section>

        <section className="mt-16 rounded-3xl border border-indigo-100 bg-[#eef0fd] px-6 py-8 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="text-sm font-semibold text-[#0f1523]">More products are coming.</div>
              <p className="mt-1 text-sm text-[#6b7a99]">This catalog is built to grow with new guides, templates and tools.</p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f46e5]">
              Explore the collection <ArrowRight size={14} />
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export { products };
