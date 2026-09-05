/**
 * src/app/utils/constants.ts
 * All app-wide constants in one place
 */

export const SITE_NAME = "RichLifeTools";
export const SITE_URL = "https://richlifetools.com";
export const SITE_DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "INR";

export const CURRENCY_OPTIONS: Array<{ code: CurrencyCode; label: string; locale: string }> = [
  { code: "USD", label: "US Dollar", locale: "en-US" },
  { code: "EUR", label: "Euro", locale: "de-DE" },
  { code: "GBP", label: "British Pound", locale: "en-GB" },
  { code: "CAD", label: "Canadian Dollar", locale: "en-CA" },
  { code: "AUD", label: "Australian Dollar", locale: "en-AU" },
  { code: "JPY", label: "Japanese Yen", locale: "ja-JP" },
  { code: "INR", label: "Indian Rupee", locale: "en-IN" },
];

// Static FX rates for client-side conversion (replace with API in production)
export const USD_PER_CURRENCY: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  CAD: 0.74,
  AUD: 0.66,
  JPY: 0.0068,
  INR: 0.012,
};
