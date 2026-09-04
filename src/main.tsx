import React, { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "INR";

const REGION_TO_CURRENCY: Record<string, CurrencyCode> = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  JP: "JPY",
  AT: "EUR",
  BE: "EUR",
  CY: "EUR",
  DE: "EUR",
  EE: "EUR",
  ES: "EUR",
  FI: "EUR",
  FR: "EUR",
  GR: "EUR",
  HR: "EUR",
  IE: "EUR",
  IT: "EUR",
  LT: "EUR",
  LU: "EUR",
  LV: "EUR",
  MT: "EUR",
  NL: "EUR",
  PT: "EUR",
  SI: "EUR",
  SK: "EUR",
};

function getDefaultCurrency(): CurrencyCode {
  if (typeof navigator === "undefined") return "USD";

  const locales = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const locale of locales) {
    try {
      const region = new Intl.Locale(locale).region;
      if (region && REGION_TO_CURRENCY[region]) {
        return REGION_TO_CURRENCY[region];
      }
    } catch {
      // Ignore malformed locale values and continue with the next locale.
    }
  }

  return "USD";
}

/**
 * Select a sensible first-run currency from the visitor's browser locale.
 * Users can still change the currency manually in the app.
 */
function AppWithLocaleDefaults() {
  useLayoutEffect(() => {
    const targetCurrency = getDefaultCurrency();
    const currencySelect = Array.from(document.querySelectorAll("select")).find((select) =>
      Array.from(select.options).some(
        (option) => option.value === targetCurrency
      )
    );

    if (!currencySelect || currencySelect.value === targetCurrency) return;

    const nativeSetter = Object.getOwnPropertyDescriptor(
      HTMLSelectElement.prototype,
      "value"
    )?.set;

    nativeSetter?.call(currencySelect, targetCurrency);
    currencySelect.dispatchEvent(new Event("change", { bubbles: true }));
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(<AppWithLocaleDefaults />);
