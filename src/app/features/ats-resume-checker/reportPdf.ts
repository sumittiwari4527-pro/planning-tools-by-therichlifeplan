import type { ResumeAnalysis } from "./types";

type RGB = [number, number, number];
const COLORS = {
  navy: [0.07, 0.09, 0.19] as RGB,
  indigo: [0.29, 0.25, 0.91] as RGB,
  purple: [0.42, 0.36, 0.96] as RGB,
  pale: [0.95, 0.95, 1] as RGB,
  ink: [0.10, 0.13, 0.21] as RGB,
  muted: [0.40, 0.45, 0.55] as RGB,
  border: [0.87, 0.89, 0.93] as RGB,
  white: [1, 1, 1] as RGB,
  green: [0.08, 0.55, 0.37] as RGB,
  paleGreen: [0.90, 0.97, 0.93] as RGB,
  amber: [0.72, 0.42, 0.05] as RGB,
  paleAmber: [1, 0.96, 0.87] as RGB,
  red: [0.75, 0.16, 0.23] as RGB,
  paleRed: [1, 0.92, 0.93] as RGB,
};

function pdfSafe(value: string): string {
  return value.normalize("NFKD").replace(/[^\x20-\x7E]/g, "").replace(/([\\()])/g, "\\$1");
}
function wrapText(value: string, maxChars: number): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (word.length > maxChars) {
      if (line) lines.push(line);
      line = "";
      for (let i = 0; i < word.length; i += maxChars) lines.push(word.slice(i, i + maxChars));
    } else if (!line) line = word;
    else if ((line + " " + word).length <= maxChars) line += " " + word;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}
function color(rgb: RGB, stroke = false): string {
  return `${rgb.map((value) => value.toFixed(3)).join(" ")} ${stroke ? "RG" : "rg"}`;
}
function scoreColor(score: number): RGB {
  return score >= 80 ? COLORS.green : score >= 60 ? COLORS.amber : COLORS.red;
}
function buildPageCommands(analysis: ResumeAnalysis): string[][] {
  const pages: string[][] = [];
  let commands: string[] = [];
  let y = 0;
  let pageNumber = 0;

  const startPage = (first: boolean) => {
    commands = [];
    pageNumber++;
    // White page canvas and consistent top accent.
    commands.push(color(COLORS.white), "0 0 612 792 re f");
    commands.push(color(COLORS.indigo), "0 786 612 6 re f");
    if (first) {
      commands.push(color(COLORS.navy), "0 590 612 196 re f");
      commands.push(color(COLORS.purple), "0 590 9 196 re f");
      addText("RichLifeTools", 42, 744, 12, COLORS.white, true);
      addText("CAREER TOOL  /  RESUME REVIEW", 42, 715, 8, [0.82, 0.82, 1], true);
      addText("ATS Resume Score Report", 42, 678, 25, COLORS.white, true);
      addText("A practical, rule-based review of your resume", 42, 653, 10, [0.86, 0.87, 0.96]);
      y = 565;
    } else {
      addText("RichLifeTools", 42, 754, 10, COLORS.indigo, true);
      addText("ATS RESUME SCORE REPORT", 420, 754, 7, COLORS.muted, true);
      commands.push(color(COLORS.border), "42 740 m 570 740 l S");
      y = 716;
    }
  };
  const addText = (value: string, x: number, baseline: number, size: number, rgb: RGB, bold = false) => {
    commands.push(color(rgb), "BT", `/${bold ? "F2" : "F1"} ${size} Tf`, `1 0 0 1 ${x.toFixed(1)} ${baseline.toFixed(1)} Tm`, `(${pdfSafe(value)}) Tj`, "ET");
  };
  const addRect = (x: number, bottom: number, width: number, height: number, fill: RGB, stroke?: RGB) => {
    commands.push(color(fill), `${x} ${bottom} ${width} ${height} re f`);
    if (stroke) commands.push(color(stroke, true), `${x} ${bottom} ${width} ${height} re S`);
  };
  const addSection = (title: string, followingSpace = 0) => {
    // Keep a section heading with the first content block that follows it.
    ensureSpace(35 + followingSpace);
    addText(title.toUpperCase(), 42, y, 9, COLORS.indigo, true);
    y -= 12;
    commands.push(color(COLORS.border), `42 ${y} m 570 ${y} l S`);
    y -= 18;
  };
  const ensureSpace = (height: number) => {
    if (y - height < 48) {
      pages.push(commands);
      startPage(false);
    }
  };
  const addParagraph = (value: string, options: { color?: RGB; size?: number; maxChars?: number; indent?: number; lineHeight?: number } = {}) => {
    const { color: rgb = COLORS.ink, size = 9, maxChars = 92, indent = 0, lineHeight = 13 } = options;
    const lines = wrapText(value, maxChars);
    ensureSpace(lines.length * lineHeight + 3);
    for (const line of lines) {
      addText(line, 48 + indent, y, size, rgb);
      y -= lineHeight;
    }
    y -= 3;
  };

  startPage(true);
  // Main score card.
  addRect(42, 470, 528, 76, COLORS.pale, COLORS.border);
  addText("OVERALL RESUME SCORE", 58, 523, 8, COLORS.muted, true);
  addText(`${analysis.overallScore}/100`, 58, 489, 27, scoreColor(analysis.overallScore), true);
  addText(analysis.overallScore >= 80 ? "Strong signals" : analysis.overallScore >= 60 ? "Room to improve" : "Needs attention", 200, 510, 11, COLORS.ink, true);
  addText("Estimated compatibility indicators", 200, 491, 8, COLORS.muted);
  addText(`WORD COUNT  ${analysis.wordCount}`, 430, 511, 8, COLORS.muted, true);
  if (analysis.jobMatchScore !== null) {
    addText(`JOB MATCH  ${analysis.jobMatchScore}/100`, 430, 492, 8, scoreColor(analysis.jobMatchScore), true);
  } else {
    addText("JOB MATCH  Not calculated", 430, 492, 8, COLORS.muted, true);
  }
  y = 445;

  addSection("Category breakdown");
  for (const item of analysis.categories) {
    ensureSpace(34);
    addText(item.label, 48, y, 9, COLORS.ink, true);
    addText(`${item.score}/100`, 520, y, 9, scoreColor(item.score), true);
    y -= 8;
    addRect(48, y - 4, 510, 5, [0.91, 0.92, 0.96]);
    addRect(48, y - 4, 510 * Math.max(0, Math.min(100, item.score)) / 100, 5, scoreColor(item.score));
    y -= 17;
    addParagraph(item.explanation, { color: COLORS.muted, size: 8, maxChars: 100, lineHeight: 10 });
  }

  addSection("Strengths");
  if (analysis.strengths.length) {
    for (const item of analysis.strengths) {
      ensureSpace(25);
      addRect(48, y - 2, 14, 14, COLORS.paleGreen);
      addText("+", 52, y + 1, 10, COLORS.green, true);
      addParagraph(item, { indent: 20, maxChars: 84 });
    }
  } else addParagraph("Keep building clear, relevant evidence for your target role.");

  const firstFindingLines = analysis.findings.length ? wrapText(analysis.findings[0].detail, 90).length : 0;
  addSection("Improvement plan", analysis.findings.length ? 30 + firstFindingLines * 12 : 0);
  if (analysis.findings.length) {
    for (const finding of analysis.findings) {
      const severityColor = finding.severity === "high" ? COLORS.red : finding.severity === "medium" ? COLORS.amber : COLORS.green;
      const severityFill = finding.severity === "high" ? COLORS.paleRed : finding.severity === "medium" ? COLORS.paleAmber : COLORS.paleGreen;
      const detailLines = wrapText(finding.detail, 90);
      ensureSpace(30 + detailLines.length * 12);
      const findingTopY = y;
      addText(finding.severity.toUpperCase(), 63, findingTopY + 4, 7, severityColor, true);
      addRect(58, findingTopY - 1, 56, 15, severityFill);
      addText(finding.title, 123, findingTopY + 3, 9, COLORS.ink, true);
      y -= 14;
      for (const line of detailLines) {
        addText(line, 123, y, 8, COLORS.muted);
        y -= 12;
      }
      // Calculate the bar from the finding's original top coordinate, not the mutated text cursor.
      // This keeps every bar beside its own title/details and clear of the following finding/section.
      const findingBarHeight = 14 + detailLines.length * 12;
      const findingBarBottom = findingTopY - findingBarHeight + 4;
      addRect(48, findingBarBottom, 4, findingBarHeight, severityColor);
      y -= 10;
    }
  } else addParagraph("No major improvement areas were flagged by these basic checks.");

  if (analysis.jobMatchScore !== null) {
    addSection("Job description keyword comparison");
    addText("FOUND IN YOUR RESUME", 48, y, 8, COLORS.green, true);
    y -= 15;
    addParagraph(analysis.matchedKeywords.join(", ") || "No matching terms detected.", { maxChars: 94 });
    y -= 3;
    addText("TERMS TO REVIEW", 48, y, 8, COLORS.amber, true);
    y -= 15;
    addParagraph(analysis.missingKeywords.join(", ") || "No obvious gaps in the selected comparison set.", { maxChars: 94 });
  }

  ensureSpace(54);
  y -= 6;
  addRect(42, y - 37, 528, 43, [0.96, 0.97, 0.99], COLORS.border);
  addText("PLEASE NOTE", 54, y - 10, 8, COLORS.navy, true);
  addText("This is an estimated, rule-based review, not a score from a specific ATS.", 54, y - 24, 8, COLORS.muted);
  addText("ATS products vary. Only include skills and achievements that are accurate.", 54, y - 35, 8, COLORS.muted);

  pages.push(commands);
  return pages.map((page, index) => {
    const footer = [
      color(COLORS.border),
      "42 34 m 570 34 l S",
      color(COLORS.muted),
      "BT", "/F1 7 Tf", "1 0 0 1 42 21 Tm", "(RichLifeTools  -  Free career tools) Tj", "ET",
      "BT", "/F1 7 Tf", `1 0 0 1 520 21 Tm`, `(Page ${index + 1}) Tj`, "ET",
    ];
    return [...page, ...footer];
  });
}

export function downloadAnalysisPdf(analysis: ResumeAnalysis): void {
  const pageCommands = buildPageCommands(analysis);
  const objects: string[] = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
  const kids: string[] = [];
  let nextObjectId = 5;
  const encoder = new TextEncoder();
  for (const commands of pageCommands) {
    const pageId = nextObjectId++;
    const contentId = nextObjectId++;
    kids.push(`${pageId} 0 R`);
    const stream = commands.join("\n");
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects[contentId] = `<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}\nendstream`;
  }
  objects[2] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${pageCommands.length} >>`;
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (let id = 1; id < objects.length; id++) {
    offsets[id] = encoder.encode(pdf).length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "richlifetools-resume-analysis.pdf";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
