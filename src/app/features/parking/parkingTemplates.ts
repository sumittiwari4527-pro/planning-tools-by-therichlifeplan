export type ParkingTemplateTheme = "dark" | "light";

type TemplateOptions = {
  theme: ParkingTemplateTheme;
  qrDataUrl: string;
  vehicle: string;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const brandLogo = (x: number, y: number, dark: boolean) => `
  <g transform="translate(${x} ${y})">
    <rect width="100" height="100" rx="20" fill="${dark ? "#071421" : "#0b1722"}"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="#ffffff" stroke-width="2"/>
    <path d="M40 67 L70 28 L61 52 L80 47 L47 78 L55 57 Z" fill="#00e87f"/>
    <path d="M21 50 H34 M66 50 H79 M50 21 V34 M50 66 V79" stroke="#ffffff" stroke-width="2" opacity=".9"/>
  </g>
`;

const car = (dark: boolean) => `
  <g transform="translate(70 535)">
    <ellipse cx="300" cy="250" rx="270" ry="30" fill="#000" opacity=".22"/>
    <path d="M55 195 L78 119 Q104 43 190 27 L410 27 Q496 43 522 119 L545 195 L522 224 L78 224 Z"
      fill="#f8fbff" stroke="#071421" stroke-width="9"/>
    <path d="M139 105 Q158 51 214 42 L386 42 Q442 51 461 105 Z" fill="#102331"/>
    <path d="M96 133 L166 120 L199 153 L89 162 Z" fill="#071421"/>
    <path d="M504 133 L434 120 L401 153 L511 162 Z" fill="#071421"/>
    <rect x="135" y="157" width="370" height="43" rx="14" fill="#0a1420"/>
    <rect x="170" y="169" width="300" height="8" rx="4" fill="#344457"/>
    <path d="M83 164 L42 181 L45 203 L96 199 Z" fill="#102331"/>
    <path d="M517 164 L558 181 L555 203 L504 199 Z" fill="#102331"/>
    <circle cx="125" cy="214" r="25" fill="#111827"/><circle cx="125" cy="214" r="12" fill="#64748b"/>
    <circle cx="475" cy="214" r="25" fill="#111827"/><circle cx="475" cy="214" r="12" fill="#64748b"/>
    <path d="M102 126 L170 114 M498 126 L430 114" stroke="#00d978" stroke-width="8" stroke-linecap="round"/>
    <path d="M100 126 L145 118 M500 126 L455 118" stroke="#46dfff" stroke-width="5" stroke-linecap="round"/>
  </g>
`;

export const buildParkingTemplateSvg = ({ theme, qrDataUrl, vehicle }: TemplateOptions) => {
  const dark = theme === "dark";
  const text = dark ? "#ffffff" : "#071421";
  const green = "#00d978";
  const border = dark ? "#0b7f55" : "#b8e9cf";
  const bottom = dark ? "#071421" : "#ffffff";
  const muted = dark ? "#d6dee7" : "#52606d";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${dark ? "#071421" : "#ffffff"}"/>
        <stop offset="55%" stop-color="${dark ? "#0a2430" : "#f7fbf8"}"/>
        <stop offset="100%" stop-color="${dark ? "#061a19" : "#e8f8ee"}"/>
      </linearGradient>
      <linearGradient id="green" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#00f08a"/>
        <stop offset="100%" stop-color="#00a85a"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity=".2"/>
      </filter>
    </defs>

    <rect x="22" y="22" width="1492" height="980" rx="44" fill="url(#bg)" stroke="${border}" stroke-width="4"/>
    <path d="M22 690 C310 505 510 875 815 670 C1080 490 1260 635 1514 430 L1514 1002 L22 1002Z"
      fill="${dark ? "#00d978" : "#6ee6a7"}" opacity=".28"/>
    <path d="M22 510 C285 700 500 520 760 710 C1010 895 1280 760 1514 900 L1514 1002 L22 1002Z"
      fill="${dark ? "#00d978" : "#34c978"}" opacity=".14"/>
    <path d="M1160 22 C1280 80 1380 30 1514 100 L1514 22Z" fill="#00d978" opacity=".62"/>

    ${brandLogo(96, 68, dark)}
    <text x="215" y="119" font-family="Arial, Helvetica, sans-serif" font-size="39" font-weight="700" fill="${text}">
      The<tspan fill="${green}">Rich</tspan>LifePlan
    </text>
    <text x="217" y="151" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="6" fill="${muted}">SMART PARKING STICKER</text>

    <text x="76" y="276" font-family="Arial, Helvetica, sans-serif" font-size="94" font-weight="900" fill="${text}">SCAN TO</text>
    <text x="76" y="372" font-family="Arial, Helvetica, sans-serif" font-size="94" font-weight="900" fill="${green}">CONTACT</text>
    <text x="76" y="468" font-family="Arial, Helvetica, sans-serif" font-size="94" font-weight="900" fill="${text}">OWNER</text>
    <path d="M685 414 l35 -18 M680 447 l42 0 M685 478 l35 18" stroke="${green}" stroke-width="9" stroke-linecap="round"/>

    ${car(dark)}

    <rect x="760" y="70" width="676" height="590" rx="36" fill="#ffffff" filter="url(#shadow)"/>
    <rect x="774" y="84" width="648" height="562" rx="28" fill="#ffffff" stroke="${green}" stroke-width="10"/>
    <image href="${qrDataUrl}" x="806" y="100" width="584" height="530" preserveAspectRatio="none"/>

    <rect x="772" y="671" width="650" height="92" rx="46" fill="url(#green)"/>
    <rect x="835" y="692" width="47" height="47" rx="12" fill="#ffffff" opacity=".98"/>
    <path d="M848 706 h21 v21 M869 728 h-21 v-21" stroke="${green}" stroke-width="4" fill="none"/>
    <text x="1110" y="735" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900" fill="#ffffff">SCAN ME</text>

    <rect x="700" y="788" width="760" height="78" rx="39" fill="${bottom}" stroke="${border}" stroke-width="3"/>
    <text x="762" y="838" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800" fill="${green}">☎</text>
    <text x="804" y="838" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" fill="${text}">Call Owner</text>
    <line x1="1070" y1="807" x2="1070" y2="847" stroke="${border}" stroke-width="3"/>
    <text x="1116" y="838" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800" fill="${green}">●</text>
    <text x="1156" y="838" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" fill="${text}">View Car Details</text>

    <text x="438" y="966" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800" fill="${muted}">Get yours →</text>
    <text x="625" y="966" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="900" fill="${green}">richlifetools.com</text>
    <text x="78" y="966" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="${muted}">${escapeXml(vehicle)}</text>
  </svg>`;
};
