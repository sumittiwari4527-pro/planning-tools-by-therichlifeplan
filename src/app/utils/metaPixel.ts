const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined)?.trim();

let initialized = false;
let missingIdWarningShown = false;

type MetaEventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    fbq?: ((...args: any[]) => void) & {
      queue?: any[];
      loaded?: boolean;
      version?: string;
      callMethod?: (...args: any[]) => void;
      push?: (...args: any[]) => void;
    };
    _fbq?: Window["fbq"];
  }
}

/**
 * Initializes the browser Pixel once. The Pixel ID is public and must be
 * supplied as VITE_META_PIXEL_ID at Vite build time.
 */
export const initMetaPixel = () => {
  if (typeof window === "undefined") return;

  if (!META_PIXEL_ID) {
    if (!missingIdWarningShown) {
      console.warn(
        "[Meta Pixel] VITE_META_PIXEL_ID is missing from this build. Check the Vercel project's Production environment variables and redeploy."
      );
      missingIdWarningShown = true;
    }
    return;
  }

  if (initialized) return;
  initialized = true;

  if (!window.fbq) {
    const fbq = function (...args: any[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq.queue?.push(args);
      }
    } as NonNullable<Window["fbq"]>;

    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq;
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.onerror = () => {
      console.error(
        "[Meta Pixel] Failed to load fbevents.js. A content blocker, network policy, or browser privacy setting may be blocking connect.facebook.net."
      );
    };
    document.head.appendChild(script);
  }

  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
};

export const trackMetaEvent = (
  eventName: string,
  params?: MetaEventParams,
  eventId?: string
) => {
  if (typeof window === "undefined") return;
  initMetaPixel();

  if (!META_PIXEL_ID || !window.fbq) return;

  if (eventId) {
    window.fbq("track", eventName, params, { eventID: eventId });
  } else if (params) {
    window.fbq("track", eventName, params);
  } else {
    window.fbq("track", eventName);
  }
};

export const trackMetaPurchase = (orderId: string) => {
  if (typeof window === "undefined" || !orderId.trim()) return;

  const key = `richlifetools_meta_purchase_${orderId}`;
  try {
    if (localStorage.getItem(key)) return;
  } catch {
    // Continue tracking if browser storage is unavailable.
  }

  trackMetaEvent(
    "Purchase",
    {
      value: 199,
      currency: "INR",
      content_name: "Smart Car Parking Sticker",
      content_type: "product",
    },
    orderId
  );

  // Mark after attempting to queue the event, so an unavailable Pixel can
  // be retried on a later visit rather than being permanently suppressed.
  try {
    localStorage.setItem(key, "1");
  } catch {
    // Tracking must never interrupt the purchase flow.
  }
};
