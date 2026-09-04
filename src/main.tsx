import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "JPY" | "INR";

const REGION_TO_CURRENCY: Record<string, CurrencyCode> = {
  IN: "INR", US: "USD", GB: "GBP", CA: "CAD", AU: "AUD", JP: "JPY",
  AT: "EUR", BE: "EUR", CY: "EUR", DE: "EUR", EE: "EUR", ES: "EUR", FI: "EUR",
  FR: "EUR", GR: "EUR", HR: "EUR", IE: "EUR", IT: "EUR", LT: "EUR", LU: "EUR",
  LV: "EUR", MT: "EUR", NL: "EUR", PT: "EUR", SI: "EUR", SK: "EUR",
};

const TIMEZONE_TO_CURRENCY: Record<string, CurrencyCode> = {
  "Asia/Kolkata": "INR", "Asia/Calcutta": "INR",
  "America/New_York": "USD", "America/Chicago": "USD", "America/Denver": "USD", "America/Los_Angeles": "USD",
  "Europe/London": "GBP", "Australia/Sydney": "AUD", "Australia/Melbourne": "AUD",
  "Asia/Tokyo": "JPY", "America/Toronto": "CAD", "America/Vancouver": "CAD",
};

function getDefaultCurrency(): CurrencyCode {
  if (typeof navigator === "undefined") return "USD";

  const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const locale of locales) {
    try {
      const region = new Intl.Locale(locale).region;
      if (region && REGION_TO_CURRENCY[region]) return REGION_TO_CURRENCY[region];
    } catch {
      // Ignore malformed locale values.
    }
  }

  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone && TIMEZONE_TO_CURRENCY[timezone]) return TIMEZONE_TO_CURRENCY[timezone];
  } catch {
    // Ignore environments without timezone information.
  }

  return "USD";
}

function findCurrencySelect(): HTMLSelectElement | null {
  const currencies: CurrencyCode[] = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"];
  return Array.from(document.querySelectorAll("select")).find((select) => {
    const values = new Set(Array.from(select.options, option => option.value));
    return currencies.every(currency => values.has(currency));
  }) ?? null;
}

/** Initialize the existing controlled currency selector without changing App's public API. */
function AppWithLocaleDefaults() {
  useEffect(() => {
    const targetCurrency = getDefaultCurrency();
    let attempts = 0;
    let frame = 0;

    const applyDefaultCurrency = () => {
      const currencySelect = findCurrencySelect();
      if (!currencySelect) {
        if (attempts++ < 30) frame = requestAnimationFrame(applyDefaultCurrency);
        return;
      }

      if (currencySelect.value !== targetCurrency) {
        const nativeSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set;
        nativeSetter?.call(currencySelect, targetCurrency);
        currencySelect.dispatchEvent(new Event("input", { bubbles: true }));
        currencySelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    frame = requestAnimationFrame(applyDefaultCurrency);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(<AppWithLocaleDefaults />);
