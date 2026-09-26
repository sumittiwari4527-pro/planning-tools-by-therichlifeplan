export type ParkingTemplateTheme = "dark" | "light";

type TemplateOptions = {
  theme: ParkingTemplateTheme;
  qrDataUrl: string;
};

const brandMark = (x: number, y: number, size: number) => `
  <g transform="translate(${x} ${y}) scale(${size / 100})">
    <rect width="100" height="100" rx="20" fill="#071421"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="#ffffff" stroke-width="2.2"/>
    <path d="M40 67 L70 28 L61 52 L80 47 L47 78 L55 57 Z" fill="#00e87f"/>
    <path d="M21 50 H34 M66 50 H79 M50 21 V34 M50 66 V79" stroke="#ffffff" stroke-width="2" opacity=".95"/>
  </g>
`;

const realisticCar = `
  <g transform="translate(52 535)">
    <defs>
      <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="52%" stop-color="#d9e2e9"/>
        <stop offset="100%" stop-color="#8c9ca8"/>
      </linearGradient>
      <linearGradient id="hood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fdfefe"/>
        <stop offset="100%" stop-color="#b9c7d0"/>
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#16384a"/>
        <stop offset="100%" stop-color="#06141e"/>
      </linearGradient>
      <linearGradient id="headlight" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#4de8ff"/>
        <stop offset="100%" stop-color="#ffffff"/>
      </linearGradient>
      <filter id="carGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="10"/>
      </filter>
    </defs>

    <ellipse cx="300" cy="338" rx="258" ry="27" fill="#000814" opacity=".5"/>
    <ellipse cx="300" cy="316" rx="245" ry="16" fill="#00e87f" opacity=".3" filter="url(#carGlow)"/>

    <!-- mirrors -->
    <path d="M44 148 Q18 137 9 153 Q4 166 22 174 L66 168 Z" fill="#071421" stroke="#2c4351" stroke-width="3"/>
    <path d="M556 148 Q582 137 591 153 Q596 166 578 174 L534 168 Z" fill="#071421" stroke="#2c4351" stroke-width="3"/>

    <!-- main body -->
    <path d="M39 244 Q49 190 88 147 L126 105 Q155 65 205 49 Q300 18 395 49 Q445 65 474 105 L512 147 Q551 190 561 244
      Q565 271 540 288 L60 288 Q35 271 39 244Z"
      fill="url(#carBody)" stroke="#071421" stroke-width="7"/>

    <!-- roof and windshield -->
    <path d="M125 143 L151 101 Q170 70 212 60 Q300 39 388 60 Q430 70 449 101 L475 143
      Q421 126 300 126 Q179 126 125 143Z"
      fill="url(#glass)" stroke="#071421" stroke-width="7"/>
    <path d="M300 54 L300 126" stroke="#49616e" stroke-width="4" opacity=".55"/>
    <path d="M160 105 Q212 76 276 69" stroke="#8ea8b5" stroke-width="3" opacity=".35"/>

    <!-- hood -->
    <path d="M104 151 Q300 125 496 151 L531 225 Q300 194 69 225 Z" fill="url(#hood)" opacity=".95"/>
    <path d="M122 164 Q300 142 478 164" stroke="#ffffff" stroke-width="5" opacity=".8"/>
    <path d="M164 151 L134 222 M436 151 L466 222" stroke="#8fa0aa" stroke-width="3" opacity=".55"/>

    <!-- grille -->
    <path d="M170 207 Q300 188 430 207 L411 255 Q300 270 189 255 Z" fill="#071421" stroke="#172b38" stroke-width="6"/>
    <path d="M193 218 Q300 207 407 218 M190 232 Q300 222 410 232 M187 246 Q300 238 413 246"
      stroke="#64747e" stroke-width="3" opacity=".65"/>
    <path d="M286 209 H314 V258 H286Z" fill="#0b1720"/>

    <!-- headlights -->
    <path d="M73 188 Q120 166 171 177 L151 218 Q110 209 75 220 Q62 209 73 188Z"
      fill="#071421" stroke="#9eefff" stroke-width="3"/>
    <path d="M527 188 Q480 166 429 177 L449 218 Q490 209 525 220 Q538 209 527 188Z"
      fill="#071421" stroke="#9eefff" stroke-width="3"/>
    <path d="M82 193 Q121 179 153 185 L138 207 Q110 201 84 210Z" fill="url(#headlight)"/>
    <path d="M518 193 Q479 179 447 185 L462 207 Q490 201 516 210Z" fill="url(#headlight)"/>
    <path d="M93 194 L125 188 M505 194 L475 188" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>

    <!-- lower bumper -->
    <path d="M69 226 Q105 218 146 226 L166 272 Q116 269 72 278 Q48 263 69 226Z" fill="#0a1822"/>
    <path d="M531 226 Q495 218 454 226 L434 272 Q484 269 528 278 Q552 263 531 226Z" fill="#0a1822"/>
    <path d="M166 269 Q300 285 434 269 L419 289 Q300 305 181 289Z" fill="#071421"/>
    <path d="M86 260 Q117 251 148 258" stroke="#00e87f" stroke-width="5" stroke-linecap="round"/>
    <path d="M514 260 Q483 251 452 258" stroke="#00e87f" stroke-width="5" stroke-linecap="round"/>

    <!-- wheels -->
    <g>
      <circle cx="116" cy="279" r="37" fill="#061019"/>
      <circle cx="116" cy="279" r="20" fill="#71828d"/>
      <circle cx="116" cy="279" r="9" fill="#172833"/>
      <circle cx="484" cy="279" r="37" fill="#061019"/>
      <circle cx="484" cy="279" r="20" fill="#71828d"/>
      <circle cx="484" cy="279" r="9" fill="#172833"/>
    </g>
  </g>
`;

const phoneIcon = (x: number, y: number, color: string) => `
  <g transform="translate(${x} ${y})" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 5 C5 5 3 8 4 12 C8 31 22 45 41 49 C45 50 48 47 48 44 L48 36 C48 34 47 33 44 32 L35 29 C33 28 31 29 30 31 L27 35 C20 31 15 26 12 19 L16 16 C18 15 19 13 18 11 L15 3 C14 1 11 0 8 1 Z"/>
  </g>
`;

const pinIcon = (x: number, y: number, color: string) => `
  <g transform="translate(${x} ${y})" fill="${color}">
    <path d="M24 2 C11 2 2 12 2 24 C2 41 24 58 24 58 C24 58 46 41 46 24 C46 12 37 2 24 2Z"/>
    <circle cx="24" cy="24" r="8" fill="#071421"/>
  </g>
`;

const cartIcon = (x: number, y: number, color: string) => `
  <g transform="translate(${x} ${y})" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 7 H12 L18 38 H47 L54 17 H17"/>
    <circle cx="23" cy="51" r="3.5" fill="${color}"/>
    <circle cx="45" cy="51" r="3.5" fill="${color}"/>
  </g>
`;

export const buildParkingTemplateSvg = ({ theme, qrDataUrl }: TemplateOptions) => {
  const dark = theme === "dark";
  const text = dark ? "#ffffff" : "#071421";
  const green = "#00e87f";
  const muted = dark ? "#d9e1e8" : "#314456";
  const panel = dark ? "#071421" : "#ffffff";
  const panelBorder = dark ? "#00c978" : "#00b968";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${dark ? "#03131e" : "#f7fffa"}"/>
        <stop offset="52%" stop-color="${dark ? "#061f2b" : "#ffffff"}"/>
        <stop offset="100%" stop-color="${dark ? "#031916" : "#e8f8ef"}"/>
      </linearGradient>
      <linearGradient id="green" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#00f28b"/>
        <stop offset="100%" stop-color="#00a95d"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="10" stdDeviation="12" flood-opacity=".28"/>
      </filter>
      <filter id="qrGlow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#00f28b" flood-opacity=".8"/>
      </filter>
    </defs>

    <!-- premium rounded sticker -->
    <rect x="28" y="28" width="1480" height="968" rx="58" fill="url(#bg)" stroke="${dark ? "#27404a" : "#d7e5dc"}" stroke-width="3" filter="url(#shadow)"/>

    <!-- layered green background ribbons -->
    <path d="M28 500 C250 650 430 515 700 690 C945 850 1190 730 1508 910 L1508 996 L28 996Z"
      fill="${dark ? "#00d978" : "#55d58f"}" opacity="${dark ? ".22" : ".25"}"/>
    <path d="M28 690 C250 500 430 840 700 675 C940 520 1190 650 1508 430 L1508 996 L28 996Z"
      fill="${dark ? "#00f28b" : "#21bf70"}" opacity="${dark ? ".18" : ".11"}"/>
    <path d="M1160 28 C1280 78 1390 35 1508 112 L1508 28Z" fill="#00d978" opacity=".78"/>
    <path d="M1300 28 C1390 90 1460 92 1508 140 L1508 28Z" fill="#76ffb7" opacity=".48"/>
    <path d="M28 770 C250 690 370 845 560 820" stroke="#00e87f" stroke-width="12" opacity=".42" fill="none"/>

    <!-- branding -->
    ${brandMark(96, 67, 100)}
    <text x="220" y="117" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800" fill="${text}">
      The<tspan fill="${green}">Rich</tspan>LifePlan
    </text>
    <text x="220" y="151" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="6" fill="${muted}">
      SMART PARKING STICKER
    </text>

    <!-- large reference-style headline -->
    <text x="76" y="286" font-family="Arial, Helvetica, sans-serif" font-size="126" font-weight="900" fill="${text}" letter-spacing="-4">SCAN TO</text>
    <text x="76" y="388" font-family="Arial, Helvetica, sans-serif" font-size="126" font-weight="900" fill="${green}" letter-spacing="-4">CONTACT</text>
    <text x="76" y="490" font-family="Arial, Helvetica, sans-serif" font-size="126" font-weight="900" fill="${text}" letter-spacing="-4">OWNER</text>

    <!-- attention marks -->
    <path d="M678 415 l48 -28 M680 450 h55 M678 485 l48 28" stroke="${green}" stroke-width="12" stroke-linecap="round"/>

    ${realisticCar}

    <!-- large QR panel -->
    <rect x="765" y="72" width="650" height="590" rx="38" fill="#ffffff" stroke="${green}" stroke-width="13" filter="url(#qrGlow)"/>
    <rect x="793" y="100" width="594" height="534" rx="5" fill="#ffffff"/>
    <image href="${qrDataUrl}" x="825" y="105" width="530" height="530" preserveAspectRatio="xMidYMid meet"/>

    <!-- branded QR centre -->
    <g transform="translate(1008 288) scale(1.52)">
      <rect width="100" height="100" rx="22" fill="#071421"/>
      <circle cx="50" cy="50" r="35" fill="none" stroke="#ffffff" stroke-width="2"/>
      <path d="M40 67 L70 28 L61 52 L80 47 L47 78 L55 57 Z" fill="#00e87f"/>
      <path d="M21 50 H34 M66 50 H79 M50 21 V34 M50 66 V79" stroke="#ffffff" stroke-width="2"/>
    </g>

    <!-- scan me -->
    <rect x="748" y="676" width="680" height="102" rx="51" fill="url(#green)" filter="url(#shadow)"/>
    <g transform="translate(833 700)" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round">
      <rect x="0" y="0" width="46" height="54" rx="8"/>
      <path d="M10 17 h10 M26 17 h10 M10 38 h10 M26 38 h10"/>
      <path d="M8 9 v8 M38 9 v8 M8 37 v8 M38 37 v8"/>
    </g>
    <text x="1115" y="747" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="900" fill="#ffffff">
      SCAN ME
    </text>

    <!-- contact actions -->
    <rect x="696" y="800" width="770" height="94" rx="47" fill="${panel}" stroke="${panelBorder}" stroke-width="3"/>
    ${phoneIcon(742, 818, green)}
    <text x="810" y="858" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="800" fill="${text}">Call Owner</text>
    <line x1="1055" y1="822" x2="1055" y2="872" stroke="${panelBorder}" stroke-width="3"/>
    ${pinIcon(1090, 816, green)}
    <text x="1150" y="858" font-family="Arial, Helvetica, sans-serif" font-size="29" font-weight="800" fill="${text}">View Car Details</text>

    <!-- prominent purchase CTA -->
    ${cartIcon(408, 919, green)}
    <text x="502" y="960" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" fill="${text}">Get yours →</text>
    <text x="758" y="960" font-family="Arial, Helvetica, sans-serif" font-size="35" font-weight="900" fill="${green}">richlifetools.com</text>
  </svg>`;
};
