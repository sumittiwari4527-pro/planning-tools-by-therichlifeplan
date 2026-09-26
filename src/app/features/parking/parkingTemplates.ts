export type ParkingTemplateTheme = "dark" | "light";

type TemplateOptions = {
  theme: ParkingTemplateTheme;
  qrDataUrl: string;
};

const brandMark = (x: number, y: number, size: number) => `
  <g transform="translate(${x} ${y}) scale(${size / 100})">
    <rect width="100" height="100" rx="20" fill="#071421"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="#fff" stroke-width="2"/>
    <path d="M40 67 L70 28 L61 52 L80 47 L47 78 L55 57 Z" fill="#00e87f"/>
    <path d="M21 50 H34 M66 50 H79 M50 21 V34 M50 66 V79" stroke="#fff" stroke-width="2"/>
  </g>
`;

const darkCar = `
  <g transform="translate(52 535)">
    <defs>
      <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#d9e2e9"/><stop offset="1" stop-color="#8c9ca8"/></linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16384a"/><stop offset="1" stop-color="#06141e"/></linearGradient>
      <linearGradient id="lamp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4de8ff"/><stop offset="1" stop-color="#fff"/></linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="10"/></filter>
    </defs>
    <ellipse cx="300" cy="338" rx="258" ry="27" fill="#000814" opacity=".5"/>
    <ellipse cx="300" cy="316" rx="245" ry="16" fill="#00e87f" opacity=".3" filter="url(#glow)"/>
    <path d="M44 148 Q18 137 9 153 Q4 166 22 174 L66 168Z" fill="#071421" stroke="#2c4351" stroke-width="3"/>
    <path d="M556 148 Q582 137 591 153 Q596 166 578 174 L534 168Z" fill="#071421" stroke="#2c4351" stroke-width="3"/>
    <path d="M39 244 Q49 190 88 147 L126 105 Q155 65 205 49 Q300 18 395 49 Q445 65 474 105 L512 147 Q551 190 561 244 Q565 271 540 288 L60 288 Q35 271 39 244Z" fill="url(#body)" stroke="#071421" stroke-width="7"/>
    <path d="M125 143 L151 101 Q170 70 212 60 Q300 39 388 60 Q430 70 449 101 L475 143 Q421 126 300 126 Q179 126 125 143Z" fill="url(#glass)" stroke="#071421" stroke-width="7"/>
    <path d="M300 54V126" stroke="#49616e" stroke-width="4" opacity=".55"/>
    <path d="M104 151 Q300 125 496 151 L531 225 Q300 194 69 225Z" fill="#edf3f7"/>
    <path d="M122 164 Q300 142 478 164" stroke="#fff" stroke-width="5" opacity=".8"/>
    <path d="M170 207 Q300 188 430 207 L411 255 Q300 270 189 255Z" fill="#071421" stroke="#172b38" stroke-width="6"/>
    <path d="M193 218 Q300 207 407 218 M190 232 Q300 222 410 232 M187 246 Q300 238 413 246" stroke="#64747e" stroke-width="3" opacity=".65"/>
    <path d="M73 188 Q120 166 171 177 L151 218 Q110 209 75 220 Q62 209 73 188Z" fill="#071421" stroke="#9eefff" stroke-width="3"/>
    <path d="M527 188 Q480 166 429 177 L449 218 Q490 209 525 220 Q538 209 527 188Z" fill="#071421" stroke="#9eefff" stroke-width="3"/>
    <path d="M82 193 Q121 179 153 185 L138 207 Q110 201 84 210Z" fill="url(#lamp)"/>
    <path d="M518 193 Q479 179 447 185 L462 207 Q490 201 516 210Z" fill="url(#lamp)"/>
    <path d="M69 226 Q105 218 146 226 L166 272 Q116 269 72 278 Q48 263 69 226Z M531 226 Q495 218 454 226 L434 272 Q484 269 528 278 Q552 263 531 226Z" fill="#0a1822"/>
    <path d="M166 269 Q300 285 434 269 L419 289 Q300 305 181 289Z" fill="#071421"/>
    <path d="M86 260 Q117 251 148 258 M514 260 Q483 251 452 258" stroke="#00e87f" stroke-width="5" stroke-linecap="round"/>
    <circle cx="116" cy="279" r="37" fill="#061019"/><circle cx="116" cy="279" r="20" fill="#71828d"/>
    <circle cx="484" cy="279" r="37" fill="#061019"/><circle cx="484" cy="279" r="20" fill="#71828d"/>
  </g>
`;

const lightCar = `
  <g transform="translate(52 425)">
    <ellipse cx="210" cy="205" rx="195" ry="18" fill="#06202a" opacity=".22"/>
    <path d="M32 151 L51 94 Q65 49 111 35 Q205 7 299 35 Q345 49 359 94 L378 151 Q383 170 367 181 L43 181 Q27 170 32 151Z" fill="#f8fbff" stroke="#071421" stroke-width="6"/>
    <path d="M82 88 Q94 49 132 42 Q205 27 278 42 Q316 49 328 88 L302 105 H108Z" fill="#0b2635" stroke="#071421" stroke-width="5"/>
    <path d="M104 111 H316" stroke="#324b5a" stroke-width="5" stroke-linecap="round"/>
    <path d="M52 112 L104 101 L129 123 L47 132Z M368 112 L316 101 L291 123 L373 132Z" fill="#071421"/>
    <path d="M48 136 L19 150 L22 170 L60 166Z M372 136 L401 150 L398 170 L360 166Z" fill="#0c1c28"/>
    <path d="M92 143 Q205 130 318 143 L326 170 H84Z" fill="#0b1621"/>
    <path d="M112 151 H298" stroke="#34495a" stroke-width="6" stroke-linecap="round"/>
    <path d="M66 112 L103 104 M344 112 L307 104" stroke="#00d978" stroke-width="6" stroke-linecap="round"/>
    <circle cx="78" cy="174" r="19" fill="#101820"/><circle cx="78" cy="174" r="8" fill="#8a9aa8"/>
    <circle cx="332" cy="174" r="19" fill="#101820"/><circle cx="332" cy="174" r="8" fill="#8a9aa8"/>
  </g>
`;

const phoneIcon = (x: number, y: number, color: string) => `
  <g transform="translate(${x} ${y})" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 5 C5 5 3 8 4 12 C8 31 22 45 41 49 C45 50 48 47 48 44 L48 36 C48 34 47 33 44 32 L35 29 C33 28 31 29 30 31 L27 35 C20 31 15 26 12 19 L16 16 C18 15 19 13 18 11 L15 3 C14 1 11 0 8 1Z"/>
  </g>
`;

const pinIcon = (x: number, y: number, color: string) => `
  <g transform="translate(${x} ${y})" fill="${color}"><path d="M24 2C11 2 2 12 2 24c0 17 22 34 22 34s22-17 22-34C46 12 37 2 24 2Z"/><circle cx="24" cy="24" r="8" fill="#071421"/></g>
`;

const cartIcon = (x: number, y: number, color: string) => `
  <g transform="translate(${x} ${y})" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 7H12L18 38H47L54 17H17"/><circle cx="23" cy="51" r="3.5" fill="${color}"/><circle cx="45" cy="51" r="3.5" fill="${color}"/>
  </g>
`;

const buildDark = (qrDataUrl: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#03131e"/><stop offset=".52" stop-color="#061f2b"/><stop offset="1" stop-color="#031916"/></linearGradient>
    <linearGradient id="green" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#00f28b"/><stop offset="1" stop-color="#00a95d"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity=".22"/></filter>
    <filter id="qrGlow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#00f28b" flood-opacity=".8"/></filter>
  </defs>
  <rect x="31" y="28" width="1473" height="968" rx="58" fill="url(#bg)" stroke="#27404a" stroke-width="3" filter="url(#shadow)"/>
  <path d="M31 500C250 650 430 515 700 690C945 850 1190 730 1504 910V996H31Z" fill="#00d978" opacity=".22"/>
  <path d="M31 690C250 500 430 840 700 675C940 520 1190 650 1504 430V996H31Z" fill="#00f28b" opacity=".18"/>
  <path d="M1160 28C1280 78 1390 35 1504 112V28Z" fill="#00d978" opacity=".78"/>
  <path d="M1300 28C1390 90 1460 92 1504 140V28Z" fill="#76ffb7" opacity=".48"/>
  ${brandMark(96,67,100)}
  <text x="220" y="117" font-family="Arial,Helvetica,sans-serif" font-size="38" font-weight="800" fill="#fff">The<tspan fill="#00e87f">Rich</tspan>LifePlan</text>
  <text x="220" y="151" font-family="Arial,Helvetica,sans-serif" font-size="18" letter-spacing="6" fill="#d9e1e8">SMART PARKING STICKER</text>
  <text x="88" y="294" font-family="Arial,Helvetica,sans-serif" font-size="126" font-weight="900" fill="#fff" letter-spacing="-5">SCAN TO</text>
  <text x="88" y="396" font-family="Arial,Helvetica,sans-serif" font-size="126" font-weight="900" fill="#00e87f" letter-spacing="-5">CONTACT</text>
  <text x="88" y="498" font-family="Arial,Helvetica,sans-serif" font-size="126" font-weight="900" fill="#fff" letter-spacing="-5">OWNER</text>
  <path d="M678 420l48-28M680 455h55M678 490l48 28" stroke="#00e87f" stroke-width="12" stroke-linecap="round"/>
  ${darkCar}
  <rect x="770" y="68" width="632" height="594" rx="38" fill="#fff" stroke="#00e87f" stroke-width="13" filter="url(#qrGlow)"/>
  <rect x="795" y="94" width="582" height="542" rx="5" fill="#fff"/>
  <image href="${qrDataUrl}" x="814" y="106" width="546" height="546" preserveAspectRatio="xMidYMid meet"/>
  ${brandMark(1003,279,164)}
  <rect x="746" y="671" width="680" height="108" rx="54" fill="url(#green)" filter="url(#shadow)"/>
  <g transform="translate(842 691)" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"><rect width="48" height="58" rx="9"/><path d="M9 18h12M27 18h12M9 41h12M27 41h12"/><path d="M8 9v10M40 9v10M8 39v10M40 39v10"/></g>
  <text x="1112" y="746" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="58" font-weight="900" fill="#fff">SCAN ME</text>
  <rect x="696" y="795" width="770" height="96" rx="48" fill="#071421" stroke="#00c978" stroke-width="3"/>
  ${phoneIcon(740,816,"#00e87f")}
  <text x="810" y="857" font-family="Arial,Helvetica,sans-serif" font-size="29" font-weight="800" fill="#fff">Call Owner</text>
  <line x1="1055" y1="817" x2="1055" y2="872" stroke="#00c978" stroke-width="3"/>
  ${pinIcon(1090,815,"#00e87f")}
  <text x="1150" y="857" font-family="Arial,Helvetica,sans-serif" font-size="29" font-weight="800" fill="#fff">View Car Details</text>
  ${cartIcon(410,912,"#00e87f")}
  <text x="502" y="962" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="800" fill="#fff">Get yours →</text>
  <text x="758" y="962" font-family="Arial,Helvetica,sans-serif" font-size="35" font-weight="900" fill="#00e87f">richlifetools.com</text>
</svg>`;

const buildLight = (qrDataUrl: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1215" height="784" viewBox="0 0 1215 784">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#061824"/><stop offset=".58" stop-color="#082733"/><stop offset="1" stop-color="#075d49"/></linearGradient>
    <linearGradient id="green" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#00f28b"/><stop offset="1" stop-color="#00a95d"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-opacity=".22"/></filter>
    <filter id="qrGlow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="0" stdDeviation="9" flood-color="#00f28b" flood-opacity=".8"/></filter>
  </defs>
  <rect x="9" y="18" width="1177" height="766" rx="27" fill="url(#bg)"/>
  <path d="M9 403C180 520 365 408 548 536C735 667 954 585 1186 710V784H9Z" fill="#00d978" opacity=".27"/>
  <path d="M9 543C205 430 350 650 550 536C760 415 972 522 1186 338V784H9Z" fill="#00f28b" opacity=".14"/>
  <path d="M908 18C1004 58 1090 28 1186 87V18Z" fill="#00d978" opacity=".78"/>
  <path d="M1040 18C1099 67 1148 65 1186 103V18Z" fill="#76ffb7" opacity=".5"/>
  ${brandMark(73,59,54)}
  <text x="158" y="91" font-family="Arial,Helvetica,sans-serif" font-size="29" font-weight="800" fill="#fff">The<tspan fill="#00e87f">Rich</tspan>LifePlan</text>
  <text x="160" y="116" font-family="Arial,Helvetica,sans-serif" font-size="13" letter-spacing="5" fill="#d9e1e8">SMART PARKING STICKER</text>
  <text x="49" y="211" font-family="Arial,Helvetica,sans-serif" font-size="70" font-weight="900" fill="#fff">SCAN TO</text>
  <text x="49" y="288" font-family="Arial,Helvetica,sans-serif" font-size="70" font-weight="900" fill="#00e87f">CONTACT</text>
  <text x="49" y="365" font-family="Arial,Helvetica,sans-serif" font-size="70" font-weight="900" fill="#fff">OWNER</text>
  <path d="M521 311l35-20M521 350h41M521 388l35 20" stroke="#00e87f" stroke-width="9" stroke-linecap="round"/>
  ${lightCar}
  <rect x="589" y="55" width="529" height="466" rx="27" fill="#fff" stroke="#00e87f" stroke-width="11" filter="url(#qrGlow)"/>
  <rect x="610" y="76" width="487" height="423" rx="4" fill="#fff"/>
  <image href="${qrDataUrl}" x="649" y="88" width="405" height="405" preserveAspectRatio="xMidYMid meet"/>
  ${brandMark(772,221,145)}
  <rect x="596" y="527" width="516" height="74" rx="37" fill="url(#green)" filter="url(#shadow)"/>
  <g transform="translate(654 546)" fill="none" stroke="#fff" stroke-width="4"><rect width="32" height="34" rx="5"/><path d="M7 11h7M18 11h7M7 24h7M18 24h7"/></g>
  <text x="853" y="580" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="36" font-weight="900" fill="#fff">SCAN ME</text>
  <rect x="544" y="624" width="604" height="64" rx="32" fill="#071421" stroke="#00c978" stroke-width="2.5"/>
  <text x="590" y="665" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="900" fill="#e53935">☎</text>
  <text x="628" y="665" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700" fill="#fff">Call Owner</text>
  <line x1="840" y1="641" x2="840" y2="675" stroke="#00c978" stroke-width="2.5"/>
  <text x="867" y="665" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="900" fill="#00e87f">●</text>
  <text x="902" y="665" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700" fill="#fff">View Car Details</text>
  <text x="326" y="765" font-family="Arial,Helvetica,sans-serif" font-size="18" font-weight="800" fill="#d9e1e8">Get yours →</text>
  <text x="479" y="765" font-family="Arial,Helvetica,sans-serif" font-size="18" font-weight="900" fill="#00e87f">richlifetools.com</text>
</svg>`;

export const buildParkingTemplateSvg = ({ theme, qrDataUrl }: TemplateOptions) =>
  theme === "dark" ? buildDark(qrDataUrl) : buildLight(qrDataUrl);
