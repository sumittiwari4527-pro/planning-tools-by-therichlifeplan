export type ParkingTemplateTheme = "dark" | "light";

type TemplateOptions = {
  theme: ParkingTemplateTheme;
  qrDataUrl: string;
};

const brandMark = (x: number, y: number, size: number) => `
  <g transform="translate(${x} ${y}) scale(${size / 100})">
    <rect width="100" height="100" rx="20" fill="#071421"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="#ffffff" stroke-width="2"/>
    <path d="M40 67 L70 28 L61 52 L80 47 L47 78 L55 57 Z" fill="#00e87f"/>
    <path d="M21 50 H34 M66 50 H79 M50 21 V34 M50 66 V79" stroke="#ffffff" stroke-width="2" opacity=".95"/>
  </g>
`;

const carIllustration = `
  <g transform="translate(52 535)">
    <ellipse cx="300" cy="285" rx="255" ry="24" fill="#03121d" opacity=".22"/>
    <path
      d="M44 221 L68 132 Q91 53 179 31 Q299 3 421 31 Q509 53 532 132 L556 221
         Q563 246 541 258 L59 258 Q37 246 44 221Z"
      fill="#f8fbff"
      stroke="#071421"
      stroke-width="8"
    />
    <path
      d="M125 124 Q146 58 205 47 Q300 29 395 47 Q454 58 475 124
         L438 145 L162 145 Z"
      fill="#0b2635"
      stroke="#071421"
      stroke-width="7"
    />
    <path d="M162 145 H438" stroke="#203a4a" stroke-width="6"/>
    <path d="M76 142 L156 126 L191 159 L70 172 Z" fill="#071421"/>
    <path d="M524 142 L444 126 L409 159 L530 172 Z" fill="#071421"/>
    <path d="M72 174 L32 194 L35 221 L89 215 Z" fill="#0c1c28"/>
    <path d="M528 174 L568 194 L565 221 L511 215 Z" fill="#0c1c28"/>
    <path d="M132 187 Q300 170 468 187 L480 224 H120 Z" fill="#0b1621"/>
    <path d="M164 196 H436" stroke="#34495a" stroke-width="8" stroke-linecap="round"/>
    <path d="M98 142 L145 132 M502 142 L455 132" stroke="#46dfff" stroke-width="7" stroke-linecap="round"/>
    <path d="M94 148 L151 138 M506 148 L449 138" stroke="#00d978" stroke-width="7" stroke-linecap="round"/>
    <path d="M111 225 H489" stroke="#0a1420" stroke-width="5" stroke-linecap="round"/>
    <circle cx="112" cy="242" r="25" fill="#101820"/><circle cx="112" cy="242" r="11" fill="#8a9aa8"/>
    <circle cx="488" cy="242" r="25" fill="#101820"/><circle cx="488" cy="242" r="11" fill="#8a9aa8"/>
  </g>
`;

export const buildParkingTemplateSvg = ({ theme, qrDataUrl }: TemplateOptions) => {
  const dark = theme === "dark";
  const text = dark ? "#ffffff" : "#071421";
  const green = "#00d978";
  const muted = dark ? "#d9e1e8" : "#243447";
  const actionBg = dark ? "#071421" : "#ffffff";
  const actionBorder = dark ? "#00a968" : "#d6eadf";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${dark ? "#03121d" : "#ffffff"}"/>
        <stop offset="58%" stop-color="${dark ? "#082332" : "#fbfffd"}"/>
        <stop offset="100%" stop-color="${dark ? "#031a18" : "#eaf9ef"}"/>
      </linearGradient>
      <linearGradient id="green" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#00f28b"/>
        <stop offset="100%" stop-color="#00a95d"/>
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".18"/>
      </filter>
    </defs>

    <rect x="28" y="28" width="1480" height="968" rx="38" fill="url(#bg)" stroke="${dark ? "#0c2632" : "#e7ece9"}" stroke-width="3"/>

    <path
      d="M28 510 C260 665 465 510 690 676 C915 842 1195 740 1508 905 L1508 996 L28 996Z"
      fill="${dark ? "#00d978" : "#6fe4a6"}" opacity="${dark ? ".22" : ".28"}"
    />
    <path
      d="M28 685 C245 500 430 845 690 675 C945 510 1185 645 1508 420 L1508 996 L28 996Z"
      fill="${dark ? "#00f28b" : "#31c878"}" opacity="${dark ? ".16" : ".13"}"
    />
    <path
      d="M1160 28 C1280 75 1390 35 1508 112 L1508 28Z"
      fill="#00d978" opacity=".72"
    />
    <path
      d="M1335 28 C1410 90 1460 92 1508 135 L1508 28Z"
      fill="#7dffb6" opacity=".5"
    />

    ${brandMark(96, 68, 92)}
    <text x="215" y="117" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700" fill="${text}">
      The<tspan fill="${green}">Rich</tspan>LifePlan
    </text>
    <text x="217" y="151" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="6" fill="${muted}">
      SMART PARKING STICKER
    </text>

    <text x="76" y="274" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="900" fill="${text}" letter-spacing="-2">SCAN TO</text>
    <text x="76" y="370" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="900" fill="${green}" letter-spacing="-2">CONTACT</text>
    <text x="76" y="466" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="900" fill="${text}" letter-spacing="-2">OWNER</text>
    <path d="M676 414 l38 -20 M675 447 h45 M676 480 l38 20" stroke="${green}" stroke-width="10" stroke-linecap="round"/>

    ${carIllustration}

    <rect x="765" y="82" width="650" height="574" rx="35" fill="#ffffff" stroke="${green}" stroke-width="12" filter="url(#softShadow)"/>
    <rect x="790" y="106" width="600" height="526" rx="4" fill="#ffffff"/>
    <image href="${qrDataUrl}" x="827" y="106" width="526" height="526" preserveAspectRatio="xMidYMid meet"/>

    <g transform="translate(996 284) scale(1.74)">
      <rect width="100" height="100" rx="20" fill="#071421"/>
      <circle cx="50" cy="50" r="35" fill="none" stroke="#ffffff" stroke-width="2"/>
      <path d="M40 67 L70 28 L61 52 L80 47 L47 78 L55 57 Z" fill="#00e87f"/>
      <path d="M21 50 H34 M66 50 H79 M50 21 V34 M50 66 V79" stroke="#ffffff" stroke-width="2"/>
    </g>

    <rect x="765" y="668" width="650" height="92" rx="46" fill="url(#green)"/>
    <rect x="838" y="691" width="48" height="48" rx="12" fill="#ffffff"/>
    <path d="M850 706 h24 v20 M874 726 h-24 v-20" stroke="${green}" stroke-width="4" fill="none"/>
    <text x="1110" y="734" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="43" font-weight="900" fill="#ffffff">
      SCAN ME
    </text>

    <rect x="700" y="790" width="760" height="78" rx="39" fill="${actionBg}" stroke="${actionBorder}" stroke-width="3"/>
    <text x="760" y="840" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="900" fill="${green}">☎</text>
    <text x="808" y="838" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="${text}">Call Owner</text>
    <line x1="1072" y1="808" x2="1072" y2="850" stroke="${actionBorder}" stroke-width="3"/>
    <text x="1114" y="840" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="900" fill="${green}">●</text>
    <text x="1156" y="838" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="${text}">View Car Details</text>

    <text x="425" y="965" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800" fill="${muted}">Get yours →</text>
    <text x="620" y="965" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="900" fill="${green}">richlifetools.com</text>
  </svg>`;
};
