export type ProductCategory = "AI" | "Money" | "Productivity" | "Health" | "Family & Kids";
export type ProductType = "ebook" | "template" | "printable" | "tool";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: ProductCategory;
  type: ProductType;
  price: number;
  currency: "INR";
  coverLabel: string;
  coverAccent: string;
  featured: boolean;
  badge?: "NEW" | "POPULAR" | "FREE";
  isFree: boolean;
  href: string;
  /** Optional future checkout destination; intentionally unused until commerce integration. */
  purchaseUrl?: string;
}
