export type ParkingTheme = "dark" | "light";

export type ParkingPayload = {
  v: 1;
  type: "parking";
  test: boolean;
  createdAt: number;
  expiresAt?: number;
  name: string;
  phone: string;
  email?: string;
  vehicle: string;
  theme: ParkingTheme;
  orderId?: string;
};

const DEFAULT_KEY_MATERIAL = "richlifetools-smart-parking-mvp-v1";
const PARKING_KEY_MATERIAL =
  import.meta.env.VITE_PARKING_QR_KEY?.trim() || DEFAULT_KEY_MATERIAL;

const bytesToBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const base64UrlToBytes = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
};

const getCryptoKey = async () => {
  const material = new TextEncoder().encode(PARKING_KEY_MATERIAL);
  const digest = await crypto.subtle.digest("SHA-256", material);
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
};

export const parkingPath = (encryptedPayload: string) =>
  `/parking?data=${encodeURIComponent(encryptedPayload)}`;

export const encryptParkingPayload = async (payload: ParkingPayload) => {
  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext)
  );

  return `${bytesToBase64Url(iv)}.${bytesToBase64Url(ciphertext)}`;
};

export const decryptParkingPayload = async (encoded: string): Promise<ParkingPayload> => {
  const [ivPart, ciphertextPart] = encoded.split(".");
  if (!ivPart || !ciphertextPart) {
    throw new Error("Invalid parking QR payload.");
  }

  const key = await getCryptoKey();
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64UrlToBytes(ivPart) },
    key,
    base64UrlToBytes(ciphertextPart)
  );

  const payload = JSON.parse(new TextDecoder().decode(plaintext)) as ParkingPayload;

  if (
    payload.v !== 1 ||
    payload.type !== "parking" ||
    typeof payload.name !== "string" ||
    typeof payload.phone !== "string" ||
    typeof payload.vehicle !== "string" ||
    (payload.test && typeof payload.expiresAt !== "number")
  ) {
    throw new Error("Invalid parking QR payload.");
  }

  return payload;
};

export const isPreviewExpired = (payload: ParkingPayload, now = Date.now()) =>
  payload.test && typeof payload.expiresAt === "number" && now >= payload.expiresAt;

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const buildParkingStickerSvg = ({
  payload,
  qrDataUrl,
}: {
  payload: ParkingPayload;
  qrDataUrl: string;
}) => {
  const dark = payload.theme === "dark";
  const bg = dark ? "#06131d" : "#f8faf9";
  const text = dark ? "#ffffff" : "#071421";
  const muted = dark ? "#cbd5e1" : "#52606d";
  const green = "#00d978";
  const panel = dark ? "#102331" : "#ffffff";
  const border = dark ? "#0b7f55" : "#bde9d3";
  const accentSoft = dark ? "#0d5b41" : "#dff8ea";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${dark ? "#06131d" : "#ffffff"}"/>
      <stop offset="55%" stop-color="${dark ? "#0b2633" : "#f4fbf7"}"/>
      <stop offset="100%" stop-color="${dark ? "#082019" : "#e9f8ef"}"/>
    </linearGradient>
    <linearGradient id="green" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#00f08a"/>
      <stop offset="100%" stop-color="#00a85a"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-opacity=".18"/>
    </filter>
  </defs>

  <rect x="24" y="24" width="1488" height="976" rx="42" fill="url(#bg)" stroke="${border}" stroke-width="4"/>
  <path d="M24 700 C330 520 500 880 790 690 C1080 500 1250 620 1512 470 L1512 1000 L24 1000Z" fill="${dark ? "#00d978" : "#7ce9ae"}" opacity=".18"/>
  <path d="M900 24 C1110 150 1270 10 1512 120 L1512 24Z" fill="#00d978" opacity=".55"/>

  <rect x="78" y="70" width="72" height="72" rx="18" fill="${dark ? "#07121d" : "#0b1722"}"/>
  <circle cx="114" cy="106" r="25" fill="none" stroke="#ffffff" stroke-width="2" opacity=".9"/>
  <path d="M104 119 L126 91 L119 108 L136 104 L110 125 L116 111 Z" fill="#00e87f"/>

  <text x="170" y="112" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700" fill="${text}">The<tspan fill="${green}">Rich</tspan>LifePlan</text>
  <text x="172" y="145" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="6" fill="${muted}">SMART PARKING STICKER</text>

  <text x="78" y="265" font-family="Arial, Helvetica, sans-serif" font-size="94" font-weight="900" fill="${text}">SCAN TO</text>
  <text x="78" y="360" font-family="Arial, Helvetica, sans-serif" font-size="94" font-weight="900" fill="${green}">CONTACT</text>
  <text x="78" y="455" font-family="Arial, Helvetica, sans-serif" font-size="94" font-weight="900" fill="${text}">OWNER</text>

  <g transform="translate(82 535)">
    <ellipse cx="270" cy="220" rx="250" ry="28" fill="#000000" opacity=".18"/>
    <path d="M52 177 L72 114 Q95 44 171 28 L349 28 Q425 44 448 114 L468 177 L448 207 L72 207 Z" fill="#ffffff" stroke="#071421" stroke-width="10"/>
    <path d="M126 99 Q142 49 190 42 L330 42 Q378 49 394 99 Z" fill="#102331"/>
    <path d="M95 122 L151 112 L178 143 L88 150 Z" fill="#071421"/>
    <path d="M445 122 L389 112 L362 143 L452 150 Z" fill="#071421"/>
    <rect x="125" y="153" width="290" height="34" rx="12" fill="#0c1520"/>
    <rect x="151" y="163" width="238" height="7" rx="4" fill="#354457"/>
    <path d="M60 154 L27 170 L30 189 L72 187 Z" fill="#102331"/>
    <path d="M460 154 L493 170 L490 189 L448 187 Z" fill="#102331"/>
    <circle cx="112" cy="196" r="21" fill="#111827"/><circle cx="112" cy="196" r="10" fill="#64748b"/>
    <circle cx="428" cy="196" r="21" fill="#111827"/><circle cx="428" cy="196" r="10" fill="#64748b"/>
    <path d="M103 116 L151 108 M437 116 L389 108" stroke="#00d978" stroke-width="8" stroke-linecap="round"/>
  </g>

  <rect x="790" y="72" width="670" height="670" rx="34" fill="#ffffff" filter="url(#shadow)"/>
  <image href="${qrDataUrl}" x="830" y="112" width="590" height="590" preserveAspectRatio="none"/>
  <rect x="800" y="755" width="650" height="78" rx="39" fill="url(#green)"/>
  <text x="1125" y="806" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800" fill="#ffffff">▣  SCAN ME</text>

  <rect x="770" y="856" width="710" height="76" rx="38" fill="${panel}" stroke="${border}" stroke-width="3"/>
  <text x="835" y="907" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" fill="${green}">☎</text>
  <text x="872" y="907" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" fill="${text}">Call Owner</text>
  <line x1="1120" y1="876" x2="1120" y2="914" stroke="${border}" stroke-width="3"/>
  <text x="1170" y="907" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" fill="${green}">⌖</text>
  <text x="1208" y="907" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" fill="${text}">View Car Details</text>

  <text x="770" y="974" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="${muted}">Get yours →</text>
  <text x="945" y="974" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="800" fill="${green}">richlifetools.com</text>

  <text x="78" y="965" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="${muted}">${escapeXml(payload.vehicle)}</text>
</svg>`;

  return svg;
};

export const svgToDataUrl = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
