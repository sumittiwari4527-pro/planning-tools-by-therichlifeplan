import type { ProductCategoryOption } from "../../../data/products/categories";

export function ProductFilters({
  categories,
  activeCategory,
  onChange,
}: {
  categories: ProductCategoryOption[];
  activeCategory: ProductCategoryOption["id"];
  onChange: (category: ProductCategoryOption["id"]) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Product categories">
      {categories.map((category) => {
        const active = activeCategory === category.id;
        return (
          <button
            key={category.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(category.id)}
            className={`whitespace-nowrap rounded-2xl px-5 py-2.5 text-sm font-medium transition-all cursor-pointer ${
              active
                ? "bg-[#4f46e5] text-white shadow-lg shadow-indigo-200"
                : "border border-[#e4e8f0] bg-white text-[#6b7a99] hover:border-indigo-200 hover:text-[#0f1523]"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
