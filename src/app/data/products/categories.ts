import type { ProductCategory } from "../../features/products/types";

export interface ProductCategoryOption {
  id: "all" | ProductCategory;
  label: string;
}

export const productCategories: ProductCategoryOption[] = [
  { id: "all", label: "All" },
  { id: "AI", label: "AI" },
  { id: "Money", label: "Money" },
  { id: "Productivity", label: "Productivity" },
  { id: "Health", label: "Health" },
  { id: "Family & Kids", label: "Family & Kids" },
];
