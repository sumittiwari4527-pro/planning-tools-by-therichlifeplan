export const careerCountries = [
  "Germany", "Netherlands", "UK", "Canada", "Sweden", "Australia", "USA", "Ireland",
] as const;

export const careerJobTypes = [
  "Software / IT", "Business", "Design", "Marketing",
] as const;

export type CareerCountry = (typeof careerCountries)[number];
export type CareerJobType = (typeof careerJobTypes)[number];

export type CareerPackage = {
  id: string;
  country: CareerCountry;
  jobType: CareerJobType;
  status: "ready" | "coming-soon";
  contents: string[];
};

const sharedContents = [
  "CV Templates",
  "Cover Letter Templates",
  "Job Application Checklist",
  "Application Tracker",
  "Job Description Worksheet",
  "AI Prompts",
];

const countryGuidance: Record<CareerCountry, string> = {
  Germany: "Germany CV Guidance",
  Netherlands: "Netherlands CV Guidance",
  UK: "UK CV Guidance",
  Canada: "Canada CV Guidance",
  Sweden: "Sweden CV Guidance",
  Australia: "Australia CV Guidance",
  USA: "USA CV Guidance",
  Ireland: "Ireland CV Guidance",
};

export const careerPackages: CareerPackage[] = careerCountries.flatMap((country) =>
  careerJobTypes.map((jobType) => ({
    id: country.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + jobType.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    country,
    jobType,
    status: country === "Germany" && jobType === "Software / IT" ? "ready" : "coming-soon",
    contents: ["CV Templates", "Cover Letter Templates", countryGuidance[country], ...sharedContents.slice(2)],
  }))
);

export const getCareerPackage = (country: CareerCountry, jobType: CareerJobType) =>
  careerPackages.find((item) => item.country === country && item.jobType === jobType);

export const getCareerPackageLabel = (country: CareerCountry, jobType: CareerJobType) =>
  country + " — " + jobType;

/**
 * Payment is mapped by package, not by product page.
 * Lemon Squeezy variant IDs/URLs and Razorpay order creation are added per
 * package when commerce configuration is connected. Both gateways must
 * resolve to the same package ID so the selected deliverable never changes.
 */
export const CAREER_PAYMENT_METHODS = ["Lemon Squeezy", "Razorpay"] as const;
