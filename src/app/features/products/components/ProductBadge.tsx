import type { Product } from "../types";

export function ProductBadge({ badge }: { badge: Product["badge"] }) {
  if (!badge) return null;

  const styles = {
    NEW: "bg-indigo-50 text-indigo-600 border-indigo-100",
    POPULAR: "bg-emerald-50 text-emerald-600 border-emerald-100",
    FREE: "bg-amber-50 text-amber-700 border-amber-100",
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-widest ${styles[badge]}`}>
      {badge}
    </span>
  );
}
