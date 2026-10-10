const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined)?.trim();

let initialized = false;

type MetaEventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    fbq?: ((...args: any[]) => void) & { queue?: any[]; loaded?: boolean; version?: string; callMethod?: (...args: any[]) => void };
    _fbq?: Window["fbq"];
  }
}

export const initMetaPixel = () => {
  if (!META_PIXEL_ID || initialized || typeof window === "undefined") return;
  initialized = true;

  const existing = window.fbq;
  if (!existing) {
    const fbq = ((...args: any[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue?.push(args);
    }) as Window["fbq"];
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  window.fbq?.("init", META_PIXEL_ID);
  window.fbq?.("track", "PageView");
};

export const trackMetaEvent = (eventName: string, params?: MetaEventParams, eventId?: string) => {
  initMetaPixel();
  if (!window.fbq) return;
  const options = eventId ? { eventID: eventId } : undefined;
  window.fbq("track", eventName, params, options);
};

export const trackMetaPurchase = (orderId: string) => {
  const key = `richlifetools_meta_purchase_${orderId}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {
    // Tracking must never interrupt the purchase flow.
  }
  trackMetaEvent("Purchase", { value: 199, currency: "INR", content_name: "Smart Car Parking Sticker", content_type: "product" }, orderId);
};
