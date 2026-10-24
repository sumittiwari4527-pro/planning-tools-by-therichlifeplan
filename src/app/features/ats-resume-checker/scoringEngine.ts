import type { ResumeAnalysis, ScoreCategory, ResumeFinding } from "./types";

const SECTION_PATTERNS: Record<string, RegExp> = {
  experience: /\b(experience|employment history|work history|professional experience)\b/i,
  skills: /\b(skills|technical skills|core competencies|areas of expertise)\b/i,
  education: /\b(education|academic background|qualifications)\b/i,
  summary: /\b(summary|professional profile|career profile|objective)\b/i,
  projects: /\b(projects|selected projects|portfolio)\b/i,
  certifications: /\b(certifications|certificates|licenses)\b/i,
};
const KEYWORDS = [
  "communication", "leadership", "project management", "problem solving", "analysis",
  "strategy", "collaboration", "stakeholder management", "customer experience", "delivery",
  "planning", "software development", "testing", "automation", "data analysis", "reporting",
  "cloud computing", "security", "javascript", "typescript", "python", "java", "sql", "react",
  "agile", "scrum", "budget", "revenue", "performance", "process improvement", "mentoring",
  "solution architecture", "continuous integration", "continuous delivery",
];
const STOP_WORDS = new Set(("a an the and or but if then else when while for to of in on at by from with without within into over under about across after before during is are was were be been being do does did have has had having can could may might must shall should will would this that these those it its we they them their you your our as not no than very more most less many much such any each both all per via using use used able required preferred including include responsibilities responsibility role work team teams candidate candidates ideal strong excellent good proven experience years year plus degree equivalent related relevant position opportunity join company business support ensure help build building maintain maintaining develop developing").split(/\s+/));
const ACTION_VERBS = /\b(led|built|created|improved|reduced|increased|delivered|launched|designed|automated|managed|developed|implemented|optimized|saved|grew|achieved|resolved|streamlined|owned|mentored|migrated|architected|scaled|deployed|secured|modernized)\b/i;
const METRIC_PATTERN = /(?:\b\d+(?:\.\d+)?\s*%|\b(?:usd|eur|gbp|inr)?\s?[$€£₹]\s?\d|\b\d+(?:\.\d+)?\s*(?:k|m|million|billion|users|clients|customers|projects|people|hours|days|weeks|months|years|x)\b)/i;

function sectionNames(text: string): string[] {
  return Object.entries(SECTION_PATTERNS).filter(([, pattern]) => pattern.test(text)).map(([name]) => name);
}
function words(text: string): string[] {
  return text.toLowerCase().match(/[a-z][a-z+#.-]{1,}/g) || [];
}
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ").replace(/\s+/g, " ").trim();
}
function extractKeywords(jobDescription: string): string[] {
  const source = normalize(jobDescription);
  // Prefer known technical/professional phrases so important skills are not
  // split into misleading individual tokens (e.g. "project management").
  const phrases = [...KEYWORDS, ...[
    "aws", "azure", "gcp", "kubernetes", "docker", "terraform", "devops",
    "machine learning", "artificial intelligence", "generative ai", "large language models",
    "product management", "program management", "people management", "risk management",
    "financial modelling", "financial modeling", "customer success", "user research",
    "user experience", "ui design", "ux design", "rest api", "graphql", "node.js",
    "react native", "next.js", "ci/cd", "microservices", "system design", "data engineering",
    "data science", "business analysis", "change management", "salesforce", "sap",
    "power bi", "tableau", "excel", "communication skills", "cross-functional",
  ]];
  const foundPhrases = phrases.filter((phrase) => source.includes(normalize(phrase)));
  const tokens = [...new Set(words(jobDescription).filter((word) => word.length >= 3 && !STOP_WORDS.has(word)))];
  // Only keep standalone terms that look like useful skills or domain nouns.
  const usefulTokens = tokens.filter((word) => !foundPhrases.some((phrase) => normalize(phrase).split(" ").includes(word)));
  return [...new Set([...foundPhrases, ...usefulTokens])].slice(0, 80);
}
function hasTerm(text: string, term: string): boolean {
  const haystack = ` ${normalize(text)} `;
  const needle = ` ${normalize(term)} `;
  return haystack.includes(needle);
}
function scoreCategories(text: string, sections: string[], jobDescription: string): ScoreCategory[] {
  const wordCount = words(text).length;
  const lines = text.split(/\n|•|\u2022/).map((line) => line.trim()).filter((line) => line.length > 25);
  const actionBullets = lines.filter((line) => ACTION_VERBS.test(line)).length;
  const metricBullets = lines.filter((line) => METRIC_PATTERN.test(line)).length;
  const keywordSet = jobDescription.trim() ? extractKeywords(jobDescription) : KEYWORDS;
  const matched = keywordSet.filter((word) => hasTerm(text, word));
  const keywordScore = keywordSet.length ? Math.round(matched.length / keywordSet.length * 100) : 0;
  const email = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text);
  const phone = /(?:\+?\d[\d\s().-]{7,}\d)/.test(text);
  const structure = Math.min(100, (sections.length / 5) * 85 + (email || phone ? 15 : 0));
  const experience = Math.min(100, (sections.includes("experience") ? 35 : 0) + Math.min(40, actionBullets * 10) + Math.min(25, metricBullets * 8));
  const readability = Math.max(20, Math.min(100, (wordCount >= 250 && wordCount <= 1000 ? 80 : wordCount >= 150 && wordCount <= 1200 ? 65 : 40) + (text.split("\n").length > 8 ? 15 : 0)));
  const education = Math.min(100, (sections.includes("education") ? 70 : 0) + (sections.includes("certifications") ? 20 : 0) + (sections.includes("projects") ? 10 : 0));
  const clarity = Math.min(100, (actionBullets ? 35 : 0) + Math.min(35, actionBullets * 7) + Math.min(30, metricBullets * 10));
  const formatRisk = Math.max(0, Math.min(100, 100 - (text.length < 500 ? 20 : 0) - (text.split("\n").length < 8 ? 20 : 0) - (/[|]{2,}|_{5,}|\*{4,}/.test(text) ? 20 : 0)));
  return [
    { id: "structure", label: "Structure & sections", score: Math.round(structure), weight: 20, explanation: "Recognizable resume sections and contact details." },
    { id: "keywords", label: jobDescription.trim() ? "Job keyword coverage" : "Skills & keywords", score: keywordScore, weight: 25, explanation: jobDescription.trim() ? "Coverage of relevant skills and terms from the job description; common filler words are excluded." : "Presence of broadly relevant professional skills." },
    { id: "experience", label: "Experience & achievements", score: Math.round(experience), weight: 20, explanation: "Experience evidence, action-led bullets, and outcomes." },
    { id: "formatting", label: "Text readability", score: Math.round((readability + formatRisk) / 2), weight: 15, explanation: "Extracted text length and basic parsing/readability signals." },
    { id: "education", label: "Education & credentials", score: Math.round(education), weight: 10, explanation: "Education, certifications, and projects sections." },
    { id: "clarity", label: "Clarity & impact", score: Math.round(clarity), weight: 10, explanation: "Action verbs and measurable impact in resume bullets." },
  ];
}

export function analyzeResume(text: string, jobDescription = ""): ResumeAnalysis {
  const cleaned = text.replace(/\r/g, "").replace(/[ \t]+/g, " ").trim();
  if (cleaned.length < 80) throw new Error("Please provide more resume text (at least 80 characters) for a useful analysis.");
  const sections = sectionNames(cleaned);
  const categories = scoreCategories(cleaned, sections, jobDescription);
  const overallScore = Math.round(categories.reduce((sum, item) => sum + item.score * item.weight, 0) / 100);
  const keywordPool = jobDescription.trim() ? extractKeywords(jobDescription) : KEYWORDS;
  const missingKeywords = keywordPool.filter((term) => !hasTerm(cleaned, term)).slice(0, 12);
  const matchedKeywords = keywordPool.filter((term) => hasTerm(cleaned, term)).slice(0, 20);
  const findings: ResumeFinding[] = [];
  if (!/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(cleaned)) findings.push({ severity: "high", title: "Add an email address", detail: "Make sure recruiters can contact you using a professional email address." });
  if (!sections.includes("experience")) findings.push({ severity: "high", title: "Add a clear experience section", detail: "Use a conventional heading such as Work Experience or Professional Experience." });
  if (!sections.includes("skills")) findings.push({ severity: "medium", title: "Add a skills section", detail: "Group relevant skills using clear, standard headings and only include skills you can substantiate." });
  if (!sections.includes("education")) findings.push({ severity: "medium", title: "Add education details", detail: "Include relevant education or qualifications if applicable to your target role." });
  const bulletLines = cleaned.split("\n").map((line) => line.trim()).filter((line) => line.length > 30);
  const actionLines = bulletLines.filter((line) => ACTION_VERBS.test(line)).length;
  const metricLines = bulletLines.filter((line) => METRIC_PATTERN.test(line)).length;
  if (actionLines < 2) findings.push({ severity: "medium", title: "Use stronger action-led bullets", detail: "Start relevant achievement bullets with clear verbs such as built, improved, led, delivered, or automated." });
  if (metricLines < 2) findings.push({ severity: "medium", title: "Show measurable outcomes", detail: "Where accurate, quantify impact with percentages, time saved, scale, quality, or business results." });
  if (jobDescription.trim() && missingKeywords.length) findings.push({ severity: "medium", title: "Review job-description keywords", detail: "Some relevant terms from the job description are not present. Add them only where they accurately reflect your experience." });
  if (sections.length >= 4) findings.push({ severity: "good", title: "Good section coverage", detail: "Several conventional resume sections were detected." });
  if (matchedKeywords.length) findings.push({ severity: "good", title: "Relevant terminology detected", detail: `Found ${matchedKeywords.length} relevant terms from the comparison set.` });
  const strengths = [
    sections.length >= 4 ? "Multiple standard resume sections were detected." : "",
    /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(cleaned) ? "Contact email is present." : "",
    actionLines >= 2 ? "Several bullet points use action-led wording." : "",
    metricLines >= 2 ? "Some achievements include measurable evidence." : "",
  ].filter(Boolean);
  const recommendations = findings.filter((item) => item.severity !== "good").map((item) => item.title);
  const jobMatchScore = jobDescription.trim()
    ? Math.round((categories.find((item) => item.id === "keywords")?.score || 0) * 0.7 + (categories.find((item) => item.id === "experience")?.score || 0) * 0.3)
    : null;
  return { overallScore, categories, strengths, findings, missingKeywords, matchedKeywords, jobMatchScore, wordCount: words(cleaned).length, sectionNames: sections, recommendations, analyzedAt: new Date().toISOString() };
}
