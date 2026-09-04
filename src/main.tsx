import React, { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

/**
 * RichLifeTools is currently India-focused. The app already exposes INR in its
 * currency selector and converts the existing starter values when the currency
 * changes. Select INR on first render so Indian users don't land on a generic
 * USD demo state.
 */
function AppWithIndiaDefaults() {
  useLayoutEffect(() => {
    const currencySelect = Array.from(document.querySelectorAll("select")).find((select) =>
      Array.from(select.options).some(
        (option) => option.value === "INR" || option.textContent?.includes("Indian Rupee")
      )
    );

    if (!currencySelect || currencySelect.value === "INR") return;

    const nativeSetter = Object.getOwnPropertyDescriptor(
      HTMLSelectElement.prototype,
      "value"
    )?.set;

    nativeSetter?.call(currencySelect, "INR");
    currencySelect.dispatchEvent(new Event("change", { bubbles: true }));
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(<AppWithIndiaDefaults />);
