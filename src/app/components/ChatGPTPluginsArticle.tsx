import React from "react";
import { ArrowRight, CheckCircle2, ExternalLink, Lightbulb, ShieldCheck, Zap } from "lucide-react";

const StepCard = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-[42px_1fr] gap-4 items-start">
    <div className="w-[42px] h-[42px] rounded-2xl bg-[#eef0fd] text-[#4f46e5] flex items-center justify-center font-mono font-bold text-sm border border-indigo-100">{number}</div>
    <div>
      <h3 className="text-[#0f1523] text-lg font-bold mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{title}</h3>
      <div className="text-[#59657d] leading-relaxed text-[15px]">{children}</div>
    </div>
  </div>
);

const WorkflowVisual = () => (
  <div className="my-10 rounded-3xl border border-[#e4e8f0] bg-white p-5 sm:p-7 shadow-sm">
    <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest mb-5">The automation loop</div>
    <svg viewBox="0 0 900 260" role="img" aria-label="Prompt to connected tool to action to result automation flow" className="w-full h-auto">
      <defs><linearGradient id="flowBg" x1="0" x2="1"><stop offset="0%" stopColor="#eef0fd" /><stop offset="100%" stopColor="#ecfeff" /></linearGradient></defs>
      {[40, 265, 490, 715].map((x, i) => (
        <g key={x}>
          <rect x={x} y="55" rx="24" width="145" height="115" fill={i === 0 ? "url(#flowBg)" : "#f8f9fb"} stroke="#dfe4ee" />
          <text x={x + 72.5} y="91" textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f1523">{["1. Prompt", "2. Connect", "3. Act", "4. Result"][i]}</text>
          <text x={x + 72.5} y="118" textAnchor="middle" fontSize="12" fill="#6b7a99">{["Tell it the job", "Choose the tool", "Do the task", "Review output"][i]}</text>
          <circle cx={x + 72.5} cy="144" r="10" fill={i === 3 ? "#10b981" : "#4f46e5"} opacity="0.14" />
          <circle cx={x + 72.5} cy="144" r="4" fill={i === 3 ? "#10b981" : "#4f46e5"} />
        </g>
      ))}
      {[185, 410, 635].map(x => <g key={x}><line x1={x} y1="112" x2={x + 55} y2="112" stroke="#b8c0d0" strokeWidth="2" /><polygon points={`${x + 55},112 ${x + 46},106 ${x + 46},118`} fill="#b8c0d0" /></g>)}
    </svg>
    <p className="text-xs text-[#8b95a9] mt-3">Good automation is a controlled loop: clear instruction → approved connection → useful action → human review.</p>
  </div>
);

const PromptBox = ({ children }: { children: React.ReactNode }) => (
  <div className="my-5 rounded-2xl border border-indigo-100 bg-[#f8f8ff] p-4 sm:p-5">
    <div className="flex items-center gap-2 text-[#4f46e5] text-xs font-mono uppercase tracking-widest mb-3"><Lightbulb size={13} /> Prompt template</div>
    <pre className="whitespace-pre-wrap text-[#273043] text-sm leading-relaxed font-mono">{children}</pre>
  </div>
);

export default function ChatGPTPluginsArticle() {
  return (
    <article className="max-w-3xl mx-auto">
      <div className="rounded-3xl bg-[#0f1523] text-white p-6 sm:p-9 mb-10 overflow-hidden relative">
        <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -left-24 -bottom-20 w-56 h-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 text-indigo-200 text-xs font-mono uppercase tracking-widest mb-4"><Zap size={13} /> Practical AI Guide</div>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Stop ChatGPT at the chat box. Start using it as a work engine.</h2>
          <p className="text-slate-300 leading-relaxed max-w-2xl">The real power of connected ChatGPT workflows is not asking more questions. It is giving ChatGPT a job, a trusted connection, and a clear definition of “done”.</p>
        </div>
      </div>

      <div className="mb-10 rounded-3xl border border-[#e4e8f0] bg-white p-5 sm:p-6 shadow-sm">
        <div className="text-[#6b7a99] text-xs font-mono uppercase tracking-widest mb-3">In this guide</div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm text-[#374151]">
          {["Understand what a plugin/connection actually does","Build your first automation step by step","Write prompts that produce repeatable results","Choose simple tasks before complex workflows","Keep humans in control of sensitive actions","Turn one successful task into a reusable system"].map(item => <div key={item} className="flex gap-2 items-start"><CheckCircle2 size={15} className="text-[#10b981] mt-0.5 shrink-0" />{item}</div>)}
        </div>
      </div>

      <p className="text-xl text-[#0f1523] leading-relaxed font-medium mb-6">Think of a connected ChatGPT tool as a bridge. ChatGPT handles the reasoning and language; the connected service provides access to the place where work actually happens.</p>
      <p className="text-[#59657d] leading-relaxed mb-5">That could mean reading information from a service, transforming information into a structured output, creating a draft, or helping you move information between steps. The exact capabilities depend on the connection and the permissions you grant it.</p>

      <WorkflowVisual />

      <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1523] mt-12 mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Why connected ChatGPT workflows are useful</h2>
      <div className="grid sm:grid-cols-3 gap-4 my-7">
        {[{ icon: Zap, title: "Less repetition", text: "Turn recurring copy, sorting, summarising, and formatting into a repeatable workflow." },{ icon: ArrowRight, title: "Fewer hand-offs", text: "Keep the context in one place instead of jumping between apps for every small step." },{ icon: ShieldCheck, title: "More control", text: "You can define what the tool is allowed to do and keep approval points for sensitive actions." }].map(card => <div key={card.title} className="bg-white border border-[#e4e8f0] rounded-2xl p-5 shadow-sm"><card.icon size={18} className="text-[#4f46e5] mb-4" /><div className="font-semibold text-[#0f1523] mb-1">{card.title}</div><p className="text-sm text-[#6b7a99] leading-relaxed">{card.text}</p></div>)}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1523] mt-14 mb-7" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-step: build your first useful automation</h2>
      <div className="space-y-9">
        <StepCard number="01" title="Pick one boring, repeatable task">Start with something narrow. “Automate my whole business” is too broad. “Every Friday, turn these notes into a clean weekly update” is specific enough to design.<div className="mt-3 p-4 rounded-2xl bg-[#f8f9fb] border border-[#eef0f5] text-sm"><strong className="text-[#0f1523]">Good first tasks:</strong> summaries, formatting, extracting fields, drafting routine replies, categorising information, creating checklists, and preparing recurring reports.</div></StepCard>
        <StepCard number="02" title="Write the outcome before the prompt">Decide what a successful result looks like. A good definition includes the input, the job, the format, and the quality bar. This prevents ChatGPT from doing something impressive but unhelpful.<PromptBox>{`Goal: Create a weekly project update.\nInput: My raw notes and task list.\nOutput: 5 bullets with progress, blockers, risks,\nand next actions.\nRule: Do not invent missing facts.`}</PromptBox></StepCard>
        <StepCard number="03" title="Connect only the service you need">Open ChatGPT’s available connections, apps, connectors, actions, or equivalent integration area in your account. Choose the service that contains the information or action required for the job. Keep the scope narrow.<div className="mt-3 flex items-start gap-2 p-4 rounded-2xl bg-[#fffbeb] border border-amber-100 text-sm text-[#6b5a24]"><ShieldCheck size={16} className="mt-0.5 shrink-0" /> Prefer the minimum permissions needed for the workflow. A simple task rarely needs broad access.</div></StepCard>
        <StepCard number="04" title="Give ChatGPT a clear sequence">Instead of “handle this”, describe the workflow in order. Tell it what to read, what to change, what to ignore, and what to return for approval.<PromptBox>{`1. Read the latest project notes.\n2. Group updates by project.\n3. Highlight blockers and missing owners.\n4. Draft the weekly summary.\n5. Do not send or publish anything yet.\n6. Show me the draft for approval.`}</PromptBox></StepCard>
        <StepCard number="05" title="Run a small test first">Use a small, representative input. Check whether the connection accessed the right information, whether the output is complete, and whether the format is actually useful. Fix the instructions before adding more steps.</StepCard>
        <StepCard number="06" title="Add an approval gate for important actions">Reading and drafting are usually lower-risk than sending, deleting, publishing, buying, or changing records. For anything consequential, keep a human approval step.<div className="mt-3 flex items-center gap-2 p-4 rounded-2xl bg-[#ecfdf5] border border-emerald-100 text-sm text-[#17603b]"><CheckCircle2 size={16} className="shrink-0" /> A strong pattern is: prepare → show me → approve → execute.</div></StepCard>
        <StepCard number="07" title="Turn the winning prompt into a reusable template">Once the workflow works, save the instruction pattern. Keep placeholders for changing inputs so you can reuse the same process without rebuilding it every time.<PromptBox>{`ROLE: You are my weekly operations assistant.\nINPUTS: [notes] [tasks] [metrics]\nDO: summarise → flag blockers → draft update\nFORMAT: headings + bullets\nCHECK: mark anything uncertain as “Needs review”\nACTION: wait for approval before sending`}</PromptBox></StepCard>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1523] mt-14 mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Three simple automations you can build</h2>
      <div className="space-y-4">{[["Email → summary","Pull together the important messages, group them by topic, and create a short action list. Keep sending replies as a separate approval step."],["Notes → content draft","Give ChatGPT meeting notes or research notes, then ask for a structured article outline, draft, and a checklist of claims that still need checking."],["Data → weekly report","Bring recurring numbers into a standard format, explain the biggest changes, and create a management-ready summary."]].map(([title,text]) => <div key={title} className="bg-white border border-[#e4e8f0] rounded-2xl p-5 sm:p-6 shadow-sm"><div className="flex gap-3 items-start"><div className="w-9 h-9 rounded-xl bg-[#eef0fd] flex items-center justify-center text-[#4f46e5] font-mono font-bold text-xs">✓</div><div><h3 className="font-semibold text-[#0f1523] mb-1">{title}</h3><p className="text-sm text-[#6b7a99] leading-relaxed">{text}</p></div></div></div>)}</div>

      <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1523] mt-14 mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The prompt formula that works surprisingly well</h2>
      <p className="text-[#59657d] leading-relaxed mb-5">For repeatable work, think in six parts:</p>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">{[["Role","Who should ChatGPT behave like?"],["Context","What information matters?"],["Task","What exactly should happen?"],["Constraints","What must not happen?"],["Output","What should the result look like?"],["Approval","Where should a human review?"]].map(([label,text]) => <div key={label} className="rounded-2xl bg-white border border-[#e4e8f0] p-4"><div className="text-[#4f46e5] font-mono text-xs mb-1">{label}</div><div className="text-sm text-[#59657d]">{text}</div></div>)}</div>

      <div className="my-10 rounded-3xl border border-[#e4e8f0] bg-[#f8f9fb] p-5 sm:p-6"><div className="flex gap-3 items-start"><ExternalLink size={18} className="text-[#4f46e5] mt-0.5 shrink-0" /><div><div className="font-semibold text-[#0f1523] mb-1">One rule worth remembering</div><p className="text-sm text-[#59657d] leading-relaxed">A connection does not automatically make a workflow trustworthy. Your instructions, permissions, data quality, and review steps still determine the quality of the outcome.</p></div></div></div>

      <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1523] mt-14 mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Common mistakes to avoid</h2>
      <div className="space-y-3 text-[#59657d] text-[15px] leading-relaxed"><p><strong className="text-[#0f1523]">Too broad:</strong> giving one prompt ten unrelated jobs makes testing and debugging difficult.</p><p><strong className="text-[#0f1523]">Too vague:</strong> “make it better” leaves the quality bar undefined.</p><p><strong className="text-[#0f1523]">Too much access:</strong> broad permissions increase the impact of mistakes.</p><p><strong className="text-[#0f1523]">No validation:</strong> connected data can be missing, stale, duplicated, or misunderstood.</p><p><strong className="text-[#0f1523]">No approval gate:</strong> irreversible actions deserve a human checkpoint.</p></div>

      <div className="mt-12 rounded-3xl bg-[#4f46e5] text-white p-7 sm:p-9 shadow-xl shadow-indigo-100"><div className="text-indigo-200 text-xs font-mono uppercase tracking-widest mb-3">Your next 15 minutes</div><h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Automate one annoying task today.</h2><p className="text-indigo-100 leading-relaxed mb-6">Pick a task you repeat every week. Define the input, output, constraints, and approval step. Connect only what you need, run one small test, and improve from there.</p><div className="flex flex-wrap gap-2 text-sm">{['One task','One connection','One clear prompt','One approval step'].map(item => <span key={item} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10">{item}</span>)}</div></div>
    </article>
  );
}
