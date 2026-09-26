import lightTemplateUrl from "./assets/parking-template-light.svg?url";
import darkTemplateUrl from "./assets/parking-template-dark.svg?url";

export type ParkingTemplateTheme = "dark" | "light";

type TemplateOptions = {
  theme: ParkingTemplateTheme;
  qrDataUrl: string;
};

const templateUrls: Record<ParkingTemplateTheme, string> = {
  light: lightTemplateUrl,
  dark: darkTemplateUrl,
};

const templateCache = new Map<ParkingTemplateTheme, Promise<string>>();

const loadTemplate = (theme: ParkingTemplateTheme) => {
  const cached = templateCache.get(theme);
  if (cached) return cached;

  const request = fetch(templateUrls[theme]).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Unable to load parking ${theme} template.`);
    }
    return response.text();
  });

  templateCache.set(theme, request);
  return request;
};

export const buildParkingTemplateSvg = async ({ theme, qrDataUrl }: TemplateOptions) => {
  const template = await loadTemplate(theme);
  const closingTag = "</svg>";
  const closingIndex = template.lastIndexOf(closingTag);

  if (closingIndex < 0) {
    throw new Error("Invalid parking sticker SVG template.");
  }

  // The committed templates contain the exact approved artwork with the sample QR removed.
  // Only the customer's generated QR is added here.
  const qrMarkup = `
    <image
      href="${qrDataUrl}"
      x="827"
      y="106"
      width="526"
      height="526"
      preserveAspectRatio="xMidYMid meet"
    />
  `;

  return template.slice(0, closingIndex) + qrMarkup + template.slice(closingIndex);
};
