import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, onOpen }: { products: Product[]; onOpen: (product: Product) => void }) {
  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-[#d9deea] bg-white px-6 py-16 text-center">
        <p className="font-medium text-[#0f1523]">No products in this category yet.</p>
        <p className="mt-2 text-sm text-[#6b7a99]">More practical digital products are on the way.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onOpen={onOpen} />
      ))}
    </div>
  );
}
