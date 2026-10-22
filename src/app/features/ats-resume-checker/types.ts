export type ScoreCategory = {
  id: string;
  label: string;
  score: number;
  weight: number;
  explanation: string;
};

export type ResumeFinding = {
  severity: "high" | "medium" | "good";
  title: string;
  detail: string;
};

export type ResumeAnalysis = {
  overallScore: number;
  categories: ScoreCategory[];
  strengths: string[];
  findings: ResumeFinding[];
  missingKeywords: string[];
  matchedKeywords: string[];
  jobMatchScore: number | null;
  wordCount: number;
  sectionNames: string[];
  recommendations: string[];
  analyzedAt: string;
};
