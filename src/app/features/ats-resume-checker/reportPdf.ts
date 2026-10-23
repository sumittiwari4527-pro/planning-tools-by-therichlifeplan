import type { ResumeAnalysis } from "./types";

function pdfSafe(value: string): string {
  return value.normalize("NFKD").replace(/[^\x20-\x7E]/g, "").replace(/([\\()])/g, "\\$1");
}

function wrapLine(line: string, maxLength = 88): string[] {
  if (line.length <= maxLength) return [line];
  const words = line.split(/\s+/);
  const wrapped: string[] = [];
  let current = "";
  for (const word of words) {
    if (word.length > maxLength) {
      if (current) wrapped.push(current);
      current = "";
      for (let i = 0; i < word.length; i += maxLength) wrapped.push(word.slice(i, i + maxLength));
      continue;
    }
    if (!current) current = word;
    else if ((current + " " + word).length <= maxLength) current += " " + word;
    else { wrapped.push(current); current = word; }
  }
  if (current) wrapped.push(current);
  return wrapped;
}

export function downloadAnalysisPdf(analysis: ResumeAnalysis): void {
  const lines = [
    "RichLifeTools - ATS Resume Check",
    `Estimated Resume Compatibility Score: ${analysis.overallScore}/100`,
    analysis.jobMatchScore === null ? "Job Match Score: Not calculated" : `Job Match Score: ${analysis.jobMatchScore}/100`,
    `Word count: ${analysis.wordCount}`,
    "",
    "CATEGORY SCORES",
    ...analysis.categories.map((item) => `${item.label}: ${item.score}/100 (weight ${item.weight}%)`),
    "",
    "STRENGTHS",
    ...(analysis.strengths.length ? analysis.strengths.map((item) => `- ${item}`) : ["- Keep building clear, relevant evidence for your target role."]),
    "",
    "IMPROVEMENT AREAS",
    ...analysis.findings.map((item) => `- [${item.severity.toUpperCase()}] ${item.title}: ${item.detail}`),
    "",
    "JOB KEYWORDS FOUND",
    analysis.matchedKeywords.join(", ") || "No comparison keywords identified.",
    "",
    "KEYWORDS TO REVIEW",
    analysis.missingKeywords.join(", ") || "No obvious keyword gaps from this comparison set.",
    "",
    "DISCLAIMER",
    "This is an estimated, rule-based review, not a score from a specific ATS. ATS products vary.",
    "Only add keywords, skills, and achievements that accurately reflect your experience.",
  ].flatMap((line) => wrapLine(line));

  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += 48) pages.push(lines.slice(i, i + 48));
  const objects: string[] = [];
  const fontId = 3;
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[fontId] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  const kids: string[] = [];
  pages.forEach((page, index) => {
    const pageId = 4 + index * 2;
    const contentId = pageId + 1;
    kids.push(`${pageId} 0 R`);
    const commands = ["BT", "/F1 10 Tf", "50 790 Td", "14 TL", ...page.flatMap((line) => [`(${pdfSafe(line)}) Tj`, "T*"]), "ET"].join("\n");
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects[contentId] = `<< /Length ${new TextEncoder().encode(commands).length} >>\nstream\n${commands}\nendstream`;
  });
  objects[2] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${pages.length} >>`;
  const maxId = objects.length - 1;
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let id = 1; id <= maxId; id++) {
    offsets[id] = new TextEncoder().encode(pdf).length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${maxId + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= maxId; id++) pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${maxId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "richlifetools-resume-analysis.pdf";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Safari may begin consuming the object URL asynchronously after the click.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
