import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Download, FileText, FileUp, LoaderCircle, RotateCcw, ShieldCheck, Sparkles, Target } from "lucide-react";
import { analyzeResume } from "./scoringEngine";
import { extractResumeText } from "./resumeParser";
import { downloadAnalysisPdf } from "./reportPdf";
import type { ResumeAnalysis } from "./types";

export function ATSResumeChecker({ onBack }: { onBack: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError("");
    setAnalysis(null);
    setBusy(true);
    try {
      const text = await extractResumeText(file);
      setResumeText(text);
      setFileName(file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to read this file. Try pasting your resume text.");
      setFileName("");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const runAnalysis = () => {
    setError("");
    try {
      setAnalysis(analyzeResume(resumeText, jobDescription));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to analyze this resume.");
    }
  };

  const reset = () => {
    setResumeText("");
    setJobDescription("");
    setFileName("");
    setAnalysis(null);
    setError("");
    setReportEmail("");
    setEmailSubmitting(false);
    setEmailSubmitted(false);
    setEmailError("");
  };

  const submitReportEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError("");
    if (!reportEmail.trim()) {
      setEmailError("Enter your email address to unlock the PDF report.");
      return;
    }

    setEmailSubmitting(true);
    try {
      const response = await fetch("https://formsubmit.co/ajax/richlifetools.support@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: reportEmail.trim(),
          _replyto: reportEmail.trim(),
          _subject: "New ATS Resume Checker report request",
          _template: "table",
          source: "RichLifeTools ATS Resume Score Checker",
          note: "The visitor submitted their email to unlock the locally generated resume report. Resume text and report contents were not sent.",
        }),
      });

      if (!response.ok) throw new Error("Email submission failed. Please try again.");
      const result = await response.json();
      if (result.success === "false" || result.success === false) {
        throw new Error(result.message || "Email submission failed. Please try again.");
      }
      setEmailSubmitted(true);
    } catch (e) {
      setEmailError(e instanceof Error ? e.message : "Unable to submit your email. Please try again.");
    } finally {
      setEmailSubmitting(false);
    }
  };

  const scoreLabel = (score: number) => score >= 80 ? "Strong signals" : score >= 60 ? "Room to improve" : "Needs attention";
  const scoreColor = (score: number) => score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="min-h-screen bg-[#f8f9fb] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="mb-7 inline-flex items-center gap-2 text-sm text-[#6b7a99] hover:text-[#0f1523]">
          <ArrowLeft size={16} /> Back to tools
        </button>
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-4">
            <Sparkles size={14} /> FREE CAREER TOOL · NO SIGN-UP
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0f1523] mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Free ATS Resume Score Checker
          </h1>
          <p className="text-lg text-[#6b7a99] leading-relaxed">
            Check resume structure, skills, and impact. Add a job description for a keyword comparison and a prioritized improvement plan.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#6b7a99]">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> Resume stays in your browser</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} /> Free · No account</span>
          </div>
        </div>

        <section aria-label="How the resume checker works" className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-5 sm:p-7 mb-7">
          <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-indigo-200/30 blur-2xl pointer-events-none" />
          <div className="relative grid md:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-3"><Sparkles size={13} /> A clearer path to a stronger resume</div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f1523] mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Turn your resume into an actionable plan.</h2>
              <p className="text-sm leading-relaxed text-[#6b7a99] max-w-xl">See what is working, spot keywords to review, and get practical next steps before you apply.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700"><CheckCircle2 size={13} /> Structure check</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-indigo-100 px-3 py-1.5 text-xs font-medium text-indigo-700"><Target size={13} /> Keyword match</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700"><FileText size={13} /> PDF report</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xs" aria-hidden="true">
              <div className="absolute -right-2 top-5 h-40 w-40 rounded-full bg-cyan-200/40 blur-xl" />
              <div className="relative rotate-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-indigo-900/10">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white"><FileText size={21} /></div>
                  <div className="flex-1"><div className="h-2.5 w-28 rounded-full bg-slate-800" /><div className="mt-2 h-2 w-20 rounded-full bg-slate-200" /></div>
                  <div className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">PDF</div>
                </div>
                <div className="flex items-center gap-3 py-4">
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-[5px] border-emerald-500 bg-emerald-50"><span className="text-xl font-bold text-slate-900">82</span><span className="text-[9px] font-semibold text-slate-500">SCORE</span></div>
                  <div className="flex-1 space-y-2.5">
                    <div><div className="mb-1 flex justify-between text-[9px] font-semibold text-slate-500"><span>Structure</span><span>Strong</span></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 w-[92%] rounded-full bg-emerald-500" /></div></div>
                    <div><div className="mb-1 flex justify-between text-[9px] font-semibold text-slate-500"><span>Keywords</span><span>Review</span></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 w-[54%] rounded-full bg-amber-500" /></div></div>
                    <div><div className="mb-1 flex justify-between text-[9px] font-semibold text-slate-500"><span>Impact</span><span>Good</span></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 w-[76%] rounded-full bg-indigo-500" /></div></div>
                  </div>
                </div>
                <div className="rounded-xl bg-indigo-50 p-3"><div className="mb-2 flex items-center gap-2 text-[10px] font-bold text-indigo-700"><Sparkles size={12} /> NEXT BEST STEPS</div><div className="mb-1.5 h-2 w-full rounded-full bg-indigo-200" /><div className="h-2 w-3/4 rounded-full bg-indigo-100" /></div>
              </div>
              <div className="absolute -left-3 bottom-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3 py-2 shadow-lg"><ShieldCheck size={17} className="text-emerald-600" /><span className="text-xs font-semibold text-slate-700">Resume stays in browser</span></div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 items-start">
          <section className="bg-white border border-[#e4e8f0] rounded-3xl p-5 sm:p-7 shadow-sm">
            <h2 className="text-xl font-bold text-[#0f1523] mb-2">1. Add your resume</h2>
            <p className="text-sm text-[#6b7a99] mb-5">PDF, DOCX, or TXT · Maximum 8 MB. Your resume file is processed in this browser and is not sent to our server. PDF reading loads the PDF.js library from a third-party CDN.</p>
            <input ref={inputRef} type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" className="hidden" onChange={(event) => void handleFile(event.target.files?.[0])} />
            <button onClick={() => inputRef.current?.click()} disabled={busy} className="w-full rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-6 text-left hover:border-indigo-400 disabled:opacity-50">
              <span className="flex items-center gap-3">
                <span className="rounded-xl bg-white p-3 text-indigo-600"><FileUp size={23} /></span>
                <span>
                  <span className="block font-semibold text-[#0f1523]">{busy ? "Reading your file…" : fileName || "Choose a resume file"}</span>
                  <span className="block text-sm text-[#6b7a99] mt-1">{busy ? "Extracting text in this browser" : "Select PDF, DOCX, or TXT"}</span>
                </span>
                {busy && <LoaderCircle className="ml-auto animate-spin text-indigo-600" size={20} />}
              </span>
            </button>
            <div className="my-5 flex items-center gap-3 text-xs text-[#9aa5ba]"><span className="h-px bg-[#e4e8f0] flex-1" /> OR PASTE TEXT <span className="h-px bg-[#e4e8f0] flex-1" /></div>
            <label htmlFor="ats-resume-text" className="block text-sm font-semibold text-[#0f1523] mb-2">Resume text</label>
            <textarea id="ats-resume-text" value={resumeText} onChange={(event) => { setResumeText(event.target.value); setFileName(""); setAnalysis(null); }} rows={12} placeholder={"Paste your resume text here…\n\nInclude headings, skills, work experience, and education."} className="w-full rounded-2xl border border-[#dce2ed] p-4 text-sm leading-relaxed text-[#0f1523] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-y" />
            <div className="mt-2 text-right text-xs text-[#9aa5ba]">{resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0} words</div>
            <label htmlFor="ats-job-description" className="block text-sm font-semibold text-[#0f1523] mt-5 mb-2">Job description <span className="font-normal text-[#9aa5ba]">(optional)</span></label>
            <textarea id="ats-job-description" value={jobDescription} onChange={(event) => { setJobDescription(event.target.value); setAnalysis(null); }} rows={5} placeholder="Paste the job description to check keyword alignment…" className="w-full rounded-2xl border border-[#dce2ed] p-4 text-sm leading-relaxed text-[#0f1523] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-y" />
            {error && <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 flex gap-2"><AlertCircle size={18} className="shrink-0" />{error}</div>}
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={runAnalysis} disabled={busy || resumeText.trim().length < 80} className="flex-1 inline-flex justify-center items-center gap-2 rounded-2xl bg-[#4f46e5] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#4338ca] disabled:opacity-40">
                <Target size={17} /> Check my resume
              </button>
              <button onClick={reset} className="inline-flex items-center gap-2 rounded-2xl border border-[#e4e8f0] px-4 py-3.5 text-sm font-semibold text-[#6b7a99] hover:bg-[#f8f9fb]"><RotateCcw size={16} /> Reset</button>
            </div>
            <p className="mt-4 text-xs text-[#9aa5ba]">This tool estimates compatibility signals. It does not reproduce any specific ATS or guarantee an interview.</p>
          </section>

          <section className="bg-white border border-[#e4e8f0] rounded-3xl p-5 sm:p-7 shadow-sm">
            {!analysis ? (
              <div className="min-h-[380px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5"><FileText size={30} /></div>
                <h2 className="text-xl font-bold text-[#0f1523] mb-2">Your resume report</h2>
                <p className="max-w-sm text-sm text-[#6b7a99] leading-relaxed">Your score, strengths, keyword coverage, and specific improvement areas will appear here after analysis.</p>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div><div className="text-xs uppercase tracking-widest font-semibold text-[#6b7a99] mb-2">Estimated score</div><h2 className={`text-5xl font-bold ${scoreColor(analysis.overallScore)}`}>{analysis.overallScore}<span className="text-2xl text-[#9aa5ba]">/100</span></h2><p className="text-sm text-[#6b7a99] mt-2">{scoreLabel(analysis.overallScore)}</p></div>
                  {analysis.jobMatchScore !== null && <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-center"><div className="text-xs font-semibold text-indigo-700">Job match</div><div className="text-2xl font-bold text-indigo-700 mt-1">{analysis.jobMatchScore}/100</div></div>}
                </div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3"><h3 className="font-bold text-[#0f1523]">Category breakdown</h3><span className="text-xs text-[#9aa5ba]">{analysis.wordCount} words</span></div>
                  <div className="space-y-4">
                    {analysis.categories.map((category) => <div key={category.id}>
                      <div className="flex justify-between gap-3 text-sm mb-1.5"><span className="font-medium text-[#0f1523]">{category.label}</span><span className={`font-semibold ${scoreColor(category.score)}`}>{category.score}%</span></div>
                      <div className="h-2 rounded-full bg-[#edf0f6] overflow-hidden"><div className={`h-full rounded-full ${category.score >= 80 ? "bg-emerald-500" : category.score >= 60 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${category.score}%` }} /></div>
                      <p className="text-xs text-[#9aa5ba] mt-1.5">{category.explanation}</p>
                    </div>)}
                  </div>
                </div>
                <div className="mb-6"><h3 className="font-bold text-[#0f1523] mb-3">Priority improvement areas</h3><div className="space-y-3">
                  {analysis.findings.filter((item) => item.severity !== "good").length ? analysis.findings.filter((item) => item.severity !== "good").map((item, index) => <div key={item.title} className="flex gap-3 rounded-2xl bg-[#f8f9fb] p-3"><span className={`mt-0.5 rounded-lg p-1.5 ${item.severity === "high" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700"}`}><AlertCircle size={16} /></span><div><div className="text-sm font-semibold text-[#0f1523]">{index + 1}. {item.title}</div><p className="text-sm text-[#6b7a99] mt-1 leading-relaxed">{item.detail}</p></div></div>) : <p className="text-sm text-emerald-700">No major rule-based issues were detected. Review the category details and tailor your resume to each role.</p>}
                </div></div>
                <div className="mb-6"><h3 className="font-bold text-[#0f1523] mb-3">Keyword comparison</h3>
                  {analysis.jobMatchScore === null && <p className="text-xs text-[#9aa5ba] mb-3">Add a job description for a more relevant comparison. Without one, a general skills list is used.</p>}
                  <div className="mb-3"><div className="text-xs font-semibold text-emerald-700 mb-2">Found in resume</div><div className="flex flex-wrap gap-2">{analysis.matchedKeywords.length ? analysis.matchedKeywords.slice(0, 14).map((word) => <span key={word} className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs text-emerald-800">{word}</span>) : <span className="text-xs text-[#9aa5ba]">No matching terms detected</span>}</div></div>
                  <div><div className="text-xs font-semibold text-amber-700 mb-2">Review if relevant</div><div className="flex flex-wrap gap-2">{analysis.missingKeywords.length ? analysis.missingKeywords.slice(0, 14).map((word) => <span key={word} className="rounded-full bg-amber-50 border border-amber-100 px-2.5 py-1 text-xs text-amber-800">{word}</span>) : <span className="text-xs text-[#9aa5ba]">No obvious gaps in the selected comparison set</span>}</div></div>
                </div>
                <div className="mb-6"><h3 className="font-bold text-[#0f1523] mb-3">What is already working</h3>{analysis.strengths.length ? <ul className="space-y-2">{analysis.strengths.map((item) => <li key={item} className="flex gap-2 text-sm text-[#426b57]"><CheckCircle2 size={16} className="shrink-0 mt-0.5" />{item}</li>)}</ul> : <p className="text-sm text-[#6b7a99]">Add standard section headings and concrete achievements to give the checker more evidence.</p>}</div>
                {!emailSubmitted ? (
                  <form onSubmit={(event) => void submitReportEmail(event)} className="rounded-2xl border border-[#e4e8f0] bg-[#f8f9fb] p-4">
                    <label htmlFor="ats-report-email" className="block text-sm font-semibold text-[#0f1523] mb-2">Enter your email to get your free PDF report</label>
                    <input
                      id="ats-report-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={reportEmail}
                      onChange={(event) => { setReportEmail(event.target.value); setEmailError(""); }}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-[#dce2ed] bg-white px-4 py-3 text-sm text-[#0f1523] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                    <button type="submit" disabled={emailSubmitting || !reportEmail.trim()} className="mt-3 w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-[#0f1523] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#27334b] disabled:opacity-50">
                      {emailSubmitting ? <LoaderCircle size={17} className="animate-spin" /> : <CheckCircle2 size={17} />}
                      {emailSubmitting ? "Submitting email…" : "Get my free report"}
                    </button>
                    {emailError && <p role="alert" className="mt-3 text-sm text-rose-700">{emailError}</p>}
                    <p className="mt-3 text-xs text-[#6b7a99]">Your email will be used by RichLifeTools for follow-up. Your resume and report contents stay on your device.</p>
                  </form>
                ) : (
                  <div>
                    <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 size={16} className="inline mr-2" />Your report is unlocked.</div>
                    <button onClick={() => downloadAnalysisPdf(analysis)} className="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-[#0f1523] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#27334b]"><Download size={17} /> Download PDF report</button>
                  </div>
                )}
                <p className="mt-3 text-xs text-[#9aa5ba]">Your report is generated on this device. Your resume text is not included in analytics or sent to our servers.</p>
              </div>
            )}
          </section>
        </div>
        <section className="mt-12 rounded-3xl border border-[#e4e8f0] bg-white p-6 sm:p-8 shadow-sm" aria-labelledby="ats-guide-title">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-3">Resume guide</p>
            <h2 id="ats-guide-title" className="text-2xl sm:text-3xl font-bold text-[#0f1523] mb-4">How to improve your ATS resume score</h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#6b7a99] mb-6">Applicant tracking systems (ATS) help employers organize job applications and search resume information. This free ATS resume checker gives you a practical first-pass review of your resume structure, relevant terminology, readability, experience evidence, and measurable achievements. Add the target job description to compare important terms with the content already in your resume.</p>
            <h3 className="text-lg font-bold text-[#0f1523] mb-3">What does the resume checker review?</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-[#6b7a99] mb-6">
              <li><strong className="text-[#0f1523]">Resume format and sections:</strong> checks for recognizable headings and contact details.</li>
              <li><strong className="text-[#0f1523]">Job-description keywords:</strong> highlights relevant terms found in your resume and terms to review.</li>
              <li><strong className="text-[#0f1523]">Experience and impact:</strong> looks for action-led bullets and evidence of outcomes.</li>
              <li><strong className="text-[#0f1523]">Readability and credentials:</strong> reviews text length, basic readability signals, education, and certifications.</li>
            </ul>
            <h3 className="text-lg font-bold text-[#0f1523] mb-3">How to use this free ATS checker</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed text-[#6b7a99] mb-6">
              <li>Upload a PDF, DOCX, or TXT resume, or paste your resume text.</li>
              <li>Optionally paste the job description for a more relevant keyword comparison.</li>
              <li>Select <strong className="text-[#0f1523]">Check my resume</strong> to see the estimated score, strengths, and improvement priorities.</li>
              <li>Enter your email to unlock and download the PDF report.</li>
            </ol>
            <h3 className="text-lg font-bold text-[#0f1523] mb-3">Frequently asked questions</h3>
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-[#0f1523] mb-1">Is this ATS resume checker free?</h4>
                <p className="text-sm leading-relaxed text-[#6b7a99]">Yes. You can analyze your resume for free. An email address is required to unlock the downloadable PDF report.</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#0f1523] mb-1">Is my resume uploaded to a server?</h4>
                <p className="text-sm leading-relaxed text-[#6b7a99]">Your resume text is processed in your browser and is not sent to RichLifeTools. PDF reading loads the PDF.js library from a third-party CDN.</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#0f1523] mb-1">Will a high score guarantee an interview?</h4>
                <p className="text-sm leading-relaxed text-[#6b7a99]">No. This is a general, rule-based estimate, not a score from a specific ATS. Employers use different systems and hiring criteria, so tailor your resume honestly to each role.</p>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#e4e8f0] bg-white p-5"><ShieldCheck className="text-emerald-600 mb-3" size={22} /><h3 className="font-semibold text-[#0f1523] mb-1">Private by design</h3><p className="text-sm text-[#6b7a99]">Files are read locally. No account, upload service, or resume database.</p></div>
          <div className="rounded-2xl border border-[#e4e8f0] bg-white p-5"><Target className="text-indigo-600 mb-3" size={22} /><h3 className="font-semibold text-[#0f1523] mb-1">Actionable feedback</h3><p className="text-sm text-[#6b7a99]">See practical improvements instead of a score with no explanation.</p></div>
          <div className="rounded-2xl border border-[#e4e8f0] bg-white p-5"><FileText className="text-amber-600 mb-3" size={22} /><h3 className="font-semibold text-[#0f1523] mb-1">Portable report</h3><p className="text-sm text-[#6b7a99]">Download a PDF report to review your next steps offline.</p></div>
        </div>
      </div>
    </div>
  );
}
