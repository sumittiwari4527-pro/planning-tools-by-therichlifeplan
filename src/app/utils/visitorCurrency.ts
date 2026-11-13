export type VisitorCurrency = "INR" | "USD";

export const detectVisitorCurrency = (): VisitorCurrency => {
  if (typeof navigator === "undefined") return "USD";

  const locales = [...(navigator.languages || []), navigator.language].filter(Boolean);
  for (const locale of locales) {
    try {
      if (new Intl.Locale(locale).region?.toUpperCase() === "IN") return "INR";
    } catch {
      // Ignore malformed locale values.
    }
  }

  try {
    if (["Asia/Kolkata", "Asia/Calcutta"].includes(Intl.DateTimeFormat().resolvedOptions().timeZone)) return "INR";
  } catch {
    // Fall through to the international default.
  }

  return "USD";
};
