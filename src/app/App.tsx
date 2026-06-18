import { useState, useEffect, useCallback, useRef } from "react";
import {
  Menu, X, Flame, Percent, TrendingUp, Hash,
  ChevronRight, Clock, User, ArrowRight, Info
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

// ─── SEO ────────────────────────────────────────────────────────────[...]

const SITE_NAME = "RichLifeTools";
const SITE_URL = "https://richlifetools.com";
const SITE_DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

interface SEOMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  jsonLd?: object;
}

function useSEO({ title, description, image, url, type = "website", jsonLd }: SEOMeta) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const canonical = url ? `${SITE_URL}${url}` : SITE_URL;
    const ogImage = image || SITE_DEFAULT_IMAGE;

    setMeta("description", description);
    setMeta("robots", "index, follow");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:type", type, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    let linkEl = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.rel = "canonical";
      document.head.appendChild(linkEl);
    }
    linkEl.href = canonical;

    let ldEl = document.getElementById("json-ld") as HTMLScriptElement | null;
    if (!ldEl) {
      ldEl = document.createElement("script");
      ldEl.id = "json-ld";
      ldEl.type = "application/ld+json";
      document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify(
      jsonLd || { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, description }
    );
  }, [title, description, image, url, type, jsonLd]);
}

// ─── DATA ───────────────────────────────────────────────────────────[...]

const articles = [
  {
    id: 1,
    title: "The Hidden Cost of Compound Interest: What Banks Won't Tell You",
    excerpt: "Understanding how compound interest works against you in debt — and for you in investments — is the single most valuable financial concept most people never learn properly.",
    body: [
      "The implications run deeper than most people initially appreciate. Whether you're making decisions about personal finance, health, or scientific understanding, having a solid grasp of the u[...]",
      "A savings account earning 5% annually doesn't just add 5% to your balance — it adds 5% to a balance that already includes last year's interest. Over 30 years, a $10,000 deposit becomes $4[...]",
      "The same mathematics that works in your favor with investments works against you with debt. A credit card at 20% APR compounded monthly effectively charges 21.94% annually. Most cardholders[...]",
      "The antidote is converting percentages to absolute values. How many hours of post-tax work does this cost? That anchor tends to produce clearer, less manipulable judgments.",
    ],
    category: "Finance", author: "Elena Marchetti", date: "June 12, 2026", readTime: "8 min", tag: "FEATURED",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&h=500&fit=crop&auto=format",
    tagColor: "#4f46e5", tagBg: "#eef0fd",
  },
  {
    id: 2,
    title: "Metric vs Imperial: Why the US Never Switched and the Real Cost",
    excerpt: "The United States is one of three countries that haven't adopted the metric system. We examine the historical decisions, the ongoing cost, and whether a switch is still possible.",
    body: [
      "In 1975, the United States passed the Metric Conversion Act, declaring a national policy of voluntary metric conversion. The key word was voluntary — and Americans largely chose not to vo[...]",
      "The economic cost of maintaining dual systems is staggering. The US Department of Commerce estimated in a 2009 study that dual-system operations cost American businesses $17 billion annuall[...]",
      "The most dramatic example remains the 1999 Mars Climate Orbiter disaster. A $327.6 million spacecraft was lost when one engineering team used imperial units while another used metric.",
      "Several industries have quietly gone fully metric: pharmaceuticals, military, science, and global trade all operate in SI units regardless of what appears on consumer packaging.",
    ],
    category: "Science", author: "David Okafor", date: "June 8, 2026", readTime: "6 min", tag: "ANALYSIS",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&h=500&fit=crop&auto=format",
    tagColor: "#06b6d4", tagBg: "#ecfeff",
  },
  {
    id: 3,
    title: "BMI is Broken: A Better Framework for Measuring Health",
    excerpt: "Body Mass Index was invented in the 1830s for statistical population studies — not individual health assessment. Here's what modern medicine uses instead.",
    body: [
      "Adolphe Quetelet was a Belgian mathematician, not a physician. He developed the Quetelet Index in 1832 as a tool for characterizing the average man in population statistics.",
      "The formula divides weight in kilograms by the square of height in meters. It has no way to distinguish between muscle and fat, and doesn't account for bone density.",
      "Modern sports medicine favors waist-to-hip ratio, DEXA body composition scans, and metabolic markers like fasting insulin and triglycerides.",
      "Despite its limitations, BMI remains widely used because it's free, requires no equipment, and produces a single number easy to track across large populations.",
    ],
    category: "Health", author: "Dr. Sadia Rahman", date: "June 3, 2026", readTime: "7 min", tag: "HEALTH",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&h=500&fit=crop&auto=format",
    tagColor: "#10b981", tagBg: "#d1fae5",
  },
  {
    id: 4,
    title: "How Logarithms Changed Navigation Forever",
    excerpt: "Before calculators, sailors used logarithm tables to multiply enormous numbers through addition. This elegant trick made ocean navigation tractable and saved countless lives.",
    body: [
      "John Napier published his discovery of logarithms in 1614. Within a decade, navigators worldwide had adopted logarithm tables as essential shipboard equipment.",
      "The core insight: multiplication becomes addition in log space. log(A x B) = log(A) + log(B). For a navigator working with 6-digit celestial position numbers, this transformed hours into m[...]",
      "Henry Briggs refined Napier's work into base-10 logarithms and spent years computing tables by hand to 14 decimal places — the primary computational tool until electronic calculators arr[...]",
      "Logarithms still underpin modern technology: the decibel scale, the Richter scale, the pH scale, and your smartphone's dynamic range compression all rely on logarithmic mathematics.",
    ],
    category: "Mathematics", author: "Prof. James Weatherington", date: "May 28, 2026", readTime: "10 min", tag: "HISTORY",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=900&h=500&fit=crop&auto=format",
    tagColor: "#f59e0b", tagBg: "#fef3c7",
  },
  {
    id: 5,
    title: "The Psychology of Percentage Thinking",
    excerpt: "Our brains are notoriously bad at understanding percentages in context. Why 20% off a $400 item feels bigger than 20% off a $40 item — even though proportionally they're identical[...]",
    body: [
      "Amos Tversky and Daniel Kahneman documented a striking finding in 1981: people would drive 20 minutes to save $5 on a $15 calculator but wouldn't drive the same distance to save $5 on a $1[...]",
      "This is proportional thinking failure. We evaluate gains and losses relative to a reference point, not in absolute terms. The $5 saving feels large against $15 (33%) but trivial against $1[...]",
      "Retailers exploit this systematically. A $500 item marked down from $800 feels like a bargain even if the original price was artificially inflated.",
      "The antidote is converting percentages to absolute values before making decisions — how many hours of your post-tax work time does this cost?",
    ],
    category: "Psychology", author: "Mia Kowalski", date: "May 20, 2026", readTime: "5 min", tag: "PSYCHOLOGY",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=500&fit=crop&auto=format",
    tagColor: "#ec4899", tagBg: "#fce7f3",
  },
  {
    id: 6,
    title: "Unit Conversion Errors That Changed History",
    excerpt: "The Mars Climate Orbiter was lost because one team used imperial units while another used metric. A tour of history's most expensive conversion mistakes.",
    body: [
      "The Mars Climate Orbiter failure in 1999 is the most famous unit conversion disaster, but the Gimli Glider incident of 1983 saw an Air Canada Boeing 767 run out of fuel mid-flight due to a[...]",
      "Columbus's 1492 voyage was built on a unit conversion error — he confused the Arabic mile with the Roman mile when estimating Earth's circumference, concluding Asia was reachable by sail[...]",
      "The lesson is not that unit systems are dangerous — it's that they're invisible until they break. The most reliable safeguard is dimensional analysis: tracking units through every calcul[...]",
      "Several industries have quietly standardized on SI units regardless of regional convention, specifically to eliminate this class of error from safety-critical systems.",
    ],
    category: "Engineering", author: "Carlos Ybarra", date: "May 15, 2026", readTime: "9 min", tag: "ENGINEERING",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&h=500&fit=crop&auto=format",
    tagColor: "#4f46e5", tagBg: "#eef0fd",
  },
];

const tools = [
  { id: "fire", icon: Flame, name: "FIRE Calculator", desc: "Retirement date, savings rate & portfolio projection", color: "#4f46e5", bg: "#eef0fd" },
  { id: "percentage", icon: Percent, name: "Percentage Tool", desc: "Discounts, tips, and markups instantly", color: "#06b6d4", bg: "#ecfeff" },
  { id: "bmi", icon: TrendingUp, name: "BMI Calculator", desc: "Body mass index with health context", color: "#10b981", bg: "#d1fae5" },
  { id: "unit", icon: Hash, name: "Unit Converter", desc: "Length, weight, temperature, and speed", color: "#f59e0b", bg: "#fef3c7" },
];

// ─── TOOLS ──────────────────────────────────────────────────────────[...]

const fmt = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(1)}K`
    : `$${n.toFixed(0)}`;

  const Field = ({ label, value, onChange, prefix = "$", tooltip }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; prefix?: string; tooltip?: string }) => (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-[#6b7a99] text-xs font-medium">{label}</label>
        {tooltip && (
          <div className="group relative">
            <Info size={11} className="text-[#c4cad9] cursor-help" />
            <div className="absolute left-0 bottom-5 w-48 bg-[#0f1523] text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4cad9] font-mono text-sm">{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={onChange}
          className={`${inputCls} ${prefix ? "pl-7" : ""}`}
        />
      </div>
    </div>
  );

function FIRECalculator() {
  const [income, setIncome] = useState("120000");
  const [expenses, setExpenses] = useState("48000");
  const [currentSavings, setCurrentSavings] = useState("50000");
  const [returnRate, setReturnRate] = useState("7");
  const [inflationRate, setInflationRate] = useState("3");
  const [withdrawalRate, setWithdrawalRate] = useState("4");

  // Use refs to track focused inputs and prevent blur on mobile
  // const focusedInputRef = useRef<string | null>(null);

  const inc = parseFloat(income) || 0;
  const exp = parseFloat(expenses) || 0;
  const cur = parseFloat(currentSavings) || 0;
  const rr = (parseFloat(returnRate) || 7) / 100;
  const ir = (parseFloat(inflationRate) || 3) / 100;
  const wr = (parseFloat(withdrawalRate) || 4) / 100;

  const annualSavings = inc - exp;
  const savingsRate = inc > 0 ? (annualSavings / inc) * 100 : 0;
  const fireNumber = exp / wr;
  const realReturn = (1 + rr) / (1 + ir) - 1;

  // Years to FIRE via simulation
  const yearsToFire = (() => {
    if (annualSavings <= 0 || cur >= fireNumber) return cur >= fireNumber ? 0 : null;
    let portfolio = cur;
    for (let y = 1; y <= 100; y++) {
      portfolio = portfolio * (1 + realReturn) + annualSavings;
      if (portfolio >= fireNumber) return y;
    }
    return null;
  })();

  const retirementYear = yearsToFire != null ? new Date().getFullYear() + yearsToFire : null;

  // Chart data — 5-year intervals up to max(yearsToFire+10, 40)
  const chartYears = Math.min(Math.max((yearsToFire ?? 30) + 10, 30), 60);
  const chartData = Array.from({ length: chartYears + 1 }, (_, y) => {
    let portfolio = cur;
    for (let i = 0; i < y; i++) portfolio = portfolio * (1 + realReturn) + annualSavings;
    return {
      year: new Date().getFullYear() + y,
      portfolio: Math.round(portfolio),
      fireTarget: Math.round(fireNumber),
    };
  });

  const inputCls = "w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-4 py-2.5 text-[#0f1523] font-mono text-sm focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]";

  // Memoized handlers to prevent re-renders that cause blur
  const handleIncomeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(e.target.value);
  }, []);

  const handleExpensesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenses(e.target.value);
  }, []);

  const handleCurrentSavingsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSavings(e.target.value);
  }, []);

  const handleReturnRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReturnRate(e.target.value);
  }, []);

  const handleInflationRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInflationRate(e.target.value);
  }, []);

  const handleWithdrawalRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawalRate(e.target.value);
  }, []);

  // const Field = ({ label, value, onChange, prefix = "$", tooltip }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; prefix?: string; tooltip?: string }) => (
  //   <div>
  //     <div className="flex items-center gap-1.5 mb-1.5">
  //       <label className="text-[#6b7a99] text-xs font-medium">{label}</label>
  //       {tooltip && (
  //         <div className="group relative">
  //           <Info size={11} className="text-[#c4cad9] cursor-help" />
  //           <div className="absolute left-0 bottom-5 w-48 bg-[#0f1523] text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed">
  //             {tooltip}
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //     <div className="relative">
  //       {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4cad9] font-mono text-sm">{prefix}</span>}
  //       <input
  //         type="number"
  //         value={value}
  //         onChange={onChange}
  //         onFocus={() => { focusedInputRef.current = label; }}
  //         onBlur={() => { focusedInputRef.current = null; }}
  //         className={`${inputCls} ${prefix ? "pl-7" : ""}`}
  //       />
  //     </div>
  //   </div>
  // );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-[#e4e8f0] rounded-xl p-3 shadow-lg text-xs">
        <div className="text-[#6b7a99] mb-1 font-mono">{label}</div>
        <div className="text-[#4f46e5] font-semibold font-mono">{fmt(payload[0]?.value ?? 0)}</div>
        <div className="text-[#c4cad9] font-mono">Target: {fmt(fireNumber)}</div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-3xl p-6 border border-[#e4e8f0] shadow-sm lg:col-span-1">
          <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest mb-5">Your Numbers</div>
          <div className="space-y-4">
            <Field label="Annual Income" value={income} onChange={handleIncomeChange} tooltip="Your total gross annual income." />
            <Field label="Annual Expenses" value={expenses} onChange={handleExpensesChange} tooltip="Your total yearly spending — this sets your FIRE target." />
            <Field label="Current Savings / Portfolio" value={currentSavings} onChange={handleCurrentSavingsChange} tooltip="Total invested assets today (brokerage, 401k, IRA, etc.)" />
            <div className="pt-2 border-t border-[#f1f3f8]">
              <div className="text-[#c4cad9] text-xs font-mono uppercase tracking-widest mb-3">Assumptions</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Return %", value: returnRate, onChange: handleReturnRateChange, tooltip: "Expected annual nominal return. S&P 500 historical avg ~10%." },
                  { label: "Inflation %", value: inflationRate, onChange: handleInflationRateChange, tooltip: "Expected annual inflation. US historical avg ~3%." },
                  { label: "Withdrawal %", value: withdrawalRate, onChange: handleWithdrawalRateChange, tooltip: "Safe withdrawal rate. The Trinity Study suggests 4%." },
                ].map(f => (
                  <div key={f.label}>
                    <div className="flex items-center gap-1 mb-1.5">
                      <label className="text-[#6b7a99] text-xs">{f.label}</label>
                      <div className="group relative">
                        <Info size={10} className="text-[#c4cad9] cursor-help" />
                        <div className="absolute left-0 bottom-5 w-44 bg-[#0f1523] text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {f.tooltip}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <input type="number" value={f.value} onChange={f.onChange}
                        onFocus={() => { focusedInputRef.current = f.label; }}
                        onBlur={() => { focusedInputRef.current = null; }}
                        className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-lg px-2 py-2 text-[#0f1523] font-mono text-sm focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5] transition-all pr-5"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#c4cad9] text-xs">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Key numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "FIRE Number", value: fmt(fireNumber), sub: `at ${withdrawalRate}% SWR`, accent: "#4f46e5", bg: "#eef0fd" },
              { label: "Savings Rate", value: `${savingsRate.toFixed(1)}%`, sub: `${fmt(annualSavings)}/yr saved`, accent: "#10b981", bg: "#d1fae5" },
              { label: "Years to FIRE", value: yearsToFire != null ? `${yearsToFire}` : "100+", sub: yearsToFire != null ? `Retire in ${retirementYear}` : "Increase savings", accent: "#f59e0b", bg: "#fef3c7" },
              { label: "Real Return", value: `${(realReturn * 100).toFixed(2)}%`, sub: "inflation-adjusted", accent: "#06b6d4", bg: "#ecfeff" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#e4e8f0] shadow-sm">
                <div className="text-xs text-[#6b7a99] mb-1">{s.label}</div>
                <div className="text-2xl font-bold font-mono" style={{ color: s.accent }}>{s.value}</div>
                <div className="text-xs text-[#c4cad9] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-3xl p-5 border border-[#e4e8f0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest">Portfolio Growth</div>
              {yearsToFire != null && (
                <div className="text-xs text-[#6b7a99] font-mono">
                  FIRE target: <span className="text-[#4f46e5] font-semibold">{fmt(fireNumber)}</span>
                </div>
              )}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f8" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#c4cad9" }} tickLine={false} axisLine={false}
                  tickFormatter={v => `'${String(v).slice(2)}`} interval={Math.floor(chartData.length / 6)} />
                <YAxis tick={{ fontSize: 11, fill: "#c4cad9" }} tickLine={false} axisLine={false}
                  tickFormatter={v => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={fireNumber} stroke="#4f46e5" strokeDasharray="5 3" strokeOpacity={0.5}
                  label={{ value: "FIRE", position: "insideTopRight", fontSize: 10, fill: "#4f46e5" }} />
                {yearsToFire != null && (
                  <ReferenceLine x={retirementYear!} stroke="#10b981" strokeDasharray="5 3" strokeOpacity={0.6}
                    label={{ value: `${retirementYear}`, position: "insideTopLeft", fontSize: 10, fill: "#10b981" }} />
                )}
                <Area type="monotone" dataKey="portfolio" stroke="#4f46e5" strokeWidth={2}
                  fill="url(#portfolioGrad)" dot={false} activeDot={{ r: 4, fill: "#4f46e5", stroke: "white", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Milestones */}
          {yearsToFire != null && (
            <div className="bg-white rounded-2xl p-5 border border-[#e4e8f0] shadow-sm">
              <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest mb-4">Milestones</div>
              <div className="space-y-2">
                {[0.25, 0.5, 0.75, 1].map(pct => {
                  const target = fireNumber * pct;
                  let yr = 0;
                  let p = cur;
                  while (p < target && yr < 100) { p = p * (1 + realReturn) + annualSavings; yr++; }
                  const reached = cur >= target;
                  return (
                    <div key={pct} className="flex items-center gap-3">
                      <div className="w-24 text-xs font-mono text-[#6b7a99]">{pct * 100}% FIRE</div>
                      <div className="flex-1 bg-[#f1f3f8] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-[#4f46e5]" style={{ width: `${Math.min(cur / target * 100, 100)}%` }} />
                      </div>
                      <div className="text-xs font-mono text-[#6b7a99] w-28 text-right">
                        {reached ? <span className="text-[#10b981]">Reached!</span> : `${new Date().getFullYear() + yr} · +${yr}yr`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explainer */}
      <div className="bg-[#eef0fd] border border-indigo-100 rounded-2xl px-5 py-4 text-xs text-[#6b7a99] leading-relaxed">
        <span className="text-[#4f46e5] font-semibold">How it works: </span>
        Your FIRE number is annual expenses ÷ safe withdrawal rate ({withdrawalRate}%). Based on the Trinity Study, a portfolio of this size historically survives 30+ years of withdrawals.
        The projection uses a real (inflation-adjusted) return of <span className="font-mono text-[#4f46e5]">{(realReturn * 100).toFixed(2)}%</span> and assumes you invest annually.
      </div>
    </div>
  );
}

function PercentageTool() {
  const [val, setVal] = useState("");
  const [p, setP] = useState("");
  const base = parseFloat(val), pct = parseFloat(p);
  const results = val && p && !isNaN(base) && !isNaN(pct) ? [
    { label: `${p}% of ${val}`, value: ((base * pct) / 100).toFixed(2) },
    { label: `After ${p}% discount`, value: (base - (base * pct) / 100).toFixed(2) },
    { label: `After ${p}% markup`, value: (base + (base * pct) / 100).toFixed(2) },
    { label: "Reverse: original before discount", value: (base / (1 - pct / 100)).toFixed(2) },
  ] : null;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-cyan-50 border border-[#e4e8f0]">
        <div className="text-[#06b6d4] text-xs font-mono uppercase tracking-widest mb-6">Percentage Calculator</div>
        <div className="space-y-4">
          {[
            { label: "Base value", value: val, set: setVal, ph: "e.g. 250" },
            { label: "Percentage (%)", value: p, set: setP, ph: "e.g. 15" },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[#6b7a99] text-sm block mb-1.5">{f.label}</label>
              <input type="number" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-4 py-3 text-[#0f1523] font-mono focus:outline-none focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/10"
              />
            </div>
          ))}
        </div>
        {results && (
          <div className="mt-6 divide-y divide-[#f1f3f8]">
            {results.map(r => (
              <div key={r.label} className="flex justify-between items-center py-3">
                <span className="text-[#6b7a99] text-sm">{r.label}</span>
                <span className="text-[#0f1523] font-mono font-semibold">{r.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BMITool() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const h = parseFloat(height), w = parseFloat(weight);
  const bmi = h && w ? w / Math.pow(h / 100, 2) : null;
  const getCategory = (b: number) => {
    if (b < 18.5) return { label: "Underweight", color: "#06b6d4", tip: "Consult a nutritionist to reach a healthy weight." };
    if (b < 25) return { label: "Normal weight", color: "#10b981", tip: "You're in the healthy BMI range. Keep it up." };
    if (b < 30) return { label: "Overweight", color: "#f59e0b", tip: "Light exercise and diet adjustments may help." };
    return { label: "Obese", color: "#ef4444", tip: "Consulting a healthcare professional is recommended." };
  };
  const cat = bmi ? getCategory(bmi) : null;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-emerald-50 border border-[#e4e8f0]">
        <div className="text-[#10b981] text-xs font-mono uppercase tracking-widest mb-6">BMI Calculator</div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { label: "Height (cm)", value: height, set: setHeight, ph: "175" },
            { label: "Weight (kg)", value: weight, set: setWeight, ph: "72" },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[#6b7a99] text-sm block mb-1.5">{f.label}</label>
              <input type="number" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-4 py-3 text-[#0f1523] font-mono focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/10"
              />
            </div>
          ))}
        </div>
        {bmi && cat && (
          <div className="p-5 rounded-2xl text-center" style={{ backgroundColor: cat.color + "10" }}>
            <div className="text-5xl font-mono font-light" style={{ color: cat.color }}>{bmi.toFixed(1)}</div>
            <div className="text-sm mt-1 font-semibold" style={{ color: cat.color }}>{cat.label}</div>
            <p className="text-[#6b7a99] text-xs mt-3 leading-relaxed">{cat.tip}</p>
          </div>
        )}
        <div className="mt-4 flex justify-between text-xs font-mono">
          {[["<18.5", "#06b6d4"], ["18.5–25", "#10b981"], ["25–30", "#f59e0b"], [">30", "#ef4444"]].map(([r, c]) => (
            <span key={r} style={{ color: c }}>{r}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

type Category = "length" | "weight" | "temperature";
const unitData: Record<Category, { units: string[]; toBase: number[] }> = {
  length: { units: ["Meters", "Kilometers", "Miles", "Feet", "Inches", "Centimeters"], toBase: [1, 1000, 1609.34, 0.3048, 0.0254, 0.01] },
  weight: { units: ["Kilograms", "Grams", "Pounds", "Ounces", "Tonnes"], toBase: [1, 0.001, 0.453592, 0.0283495, 1000] },
  temperature: { units: ["Celsius", "Fahrenheit", "Kelvin"], toBase: [1, 1, 1] },
};

function UnitConverter() {
  const [cat, setCat] = useState<Category>("length");
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);
  const [value, setValue] = useState("");
  const data = unitData[cat];

  const convert = (): string | null => {
    if (!value) return null;
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    if (cat === "temperature") {
      const c = from === 0 ? v : from === 1 ? (v - 32) * (5 / 9) : v - 273.15;
      const res = to === 0 ? c : to === 1 ? c * (9 / 5) + 32 : c + 273.15;
      return res.toFixed(4);
    }
    return ((v * data.toBase[from]) / data.toBase[to]).toFixed(6);
  };

  const result = convert();

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-amber-50 border border-[#e4e8f0]">
        <div className="text-[#f59e0b] text-xs font-mono uppercase tracking-widest mb-6">Unit Converter</div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["length", "weight", "temperature"] as Category[]).map(c => (
            <button key={c} onClick={() => { setCat(c); setFrom(0); setTo(1); setValue(""); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${
                cat === c ? "bg-[#f59e0b] text-white shadow-md shadow-amber-200" : "bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a]"
              }`}>{c}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[{ label: "From", val: from, set: setFrom }, { label: "To", val: to, set: setTo }].map(f => (
            <div key={f.label}>
              <label className="text-[#6b7a99] text-xs block mb-1.5">{f.label}</label>
              <select value={f.val} onChange={e => f.set(Number(e.target.value))}
                className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-3 py-2.5 text-[#0f1523] text-sm focus:outline-none focus:border-[#f59e0b] cursor-pointer">
                {data.units.map((u, i) => <option key={u} value={i}>{u}</option>)}
              </select>
            </div>
          ))}
        </div>
        <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value"
          className="w-full bg-[#f8f9fb] border border-[#e4e8f0] rounded-xl px-4 py-3 text-[#0f1523] font-mono focus:outline-none focus:border-[#f59e0b] focus:ring-2 focus:ring-amber-100 transition-all"
        />
        {result && (
          <div className="p-5 bg-[#fef3c7] rounded-2xl text-center">
            <div className="text-3xl font-mono font-light text-[#92400e]">{result}</div>
            <div className="text-xs text-[#a16207] mt-1">{data.units[to]}</div>
            <div className="text-xs text-[#b45309] mt-2 font-mono opacity-70">{value} {data.units[from]} = {result} {data.units[to]}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP ───────────────────────────────────────────────────────────[...]

type Page = "home" | "tools" | "blog" | "article";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [activeTool, setActiveTool] = useState("fire");
  const [activeArticleId, setActiveArticleId] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (p: Page) => { setPage(p); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openArticle = (id: number) => { setActiveArticleId(id); nav("article"); };
  const openTool = (id: string) => { setActiveTool(id); nav("tools"); };

  const activeArticle = articles.find(a => a.id === activeArticleId);

  // ── SEO — called once at App top level, switches per page ──
  const seoMap: Record<Page, SEOMeta> = {
    home: {
      title: SITE_NAME,
      description: "RichLifeTools — free precision calculators, unit converters, BMI tools, and in-depth articles on finance, science, health, and mathematics.",
      url: "/",
      jsonLd: {
        "@context": "https://schema.org", "@type": "WebSite",
        name: SITE_NAME, url: SITE_URL,
        description: "Free precision calculators, unit converters, BMI tools, and in-depth articles.",
        potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/blog`, "query-input": "required name=search_term_string" },
      },
    },
    tools: {
      title: "Free Online Tools",
      description: "Free FIRE calculator, percentage tool, BMI calculator, and unit converter. Plan your early retirement and financial independence — no sign-up required.",
      url: "/tools",
      jsonLd: {
        "@context": "https://schema.org", "@type": "ItemList",
        name: "RichLifeTools — Free Online Tools",
        itemListElement: tools.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, description: t.desc, url: `${SITE_URL}/tools` })),
      },
    },
    blog: {
      title: "Articles on Finance, Science & Mathematics",
      description: "In-depth articles on compound interest, unit conversions, BMI, logarithms, percentage psychology, and more.",
      url: "/blog",
      jsonLd: {
        "@context": "https://schema.org", "@type": "Blog",
        name: "RichLifeTools Articles", url: `${SITE_URL}/blog`,
        blogPost: articles.map(a => ({
          "@type": "BlogPosting", headline: a.title, description: a.excerpt,
          author: { "@type": "Person", name: a.author }, datePublished: a.date, image: a.image, articleSection: a.category,
        })),
      },
    },
    article: {
      title: activeArticle?.title ?? "Article",
      description: activeArticle?.excerpt ?? "",
      image: activeArticle?.image,
      url: `/blog/${activeArticle?.id}`,
      type: "article",
      jsonLd: activeArticle ? {
        "@context": "https://schema.org", "@type": "Article",
        headline: activeArticle.title, description: activeArticle.excerpt, image: activeArticle.image,
        author: { "@type": "Person", name: activeArticle.author },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        datePublished: activeArticle.date, articleSection: activeArticle.category,
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${activeArticle.id}` },
        keywords: `${activeArticle.category}, ${activeArticle.tag.toLowerCase()}, richlifetools`,
      } : {},
    },
  };

  useSEO(seoMap[page]);

  const navLinks: [Page, string][] = [["home", "Home"], ["tools", "Tools"], ["blog", "Blog"]];

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#0f1523] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e4e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => nav("home")} className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-8 h-8 bg-[#4f46e5] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-indigo-200">
                <span className="text-white font-mono font-bold text-xs">RL</span>
              </div>
              <span className="text-[#0f1523] font-bold tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                RichLifeTools
              </span>
            </button>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(([p, label]) => (
                <button key={p} onClick={() => nav(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    page === p ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-200" : "text-[#6b7a99] hover:text-[#0f1523] hover:bg-[#f1f3f8]"
                  }`}>{label}</button>
              ))}
            </div>
            <button className="md:hidden text-[#0f1523] p-1" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-[#e4e8f0] px-4 py-3 space-y-1">
            {navLinks.map(([p, label]) => (
              <button key={p} onClick={() => nav(p)}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                  page === p ? "bg-[#4f46e5] text-white font-medium" : "text-[#6b7a99] hover:text-[#0f1523] hover:bg-[#f1f3f8]"
                }`}>{label}</button>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1">
        {/* HOME */}
        {page === "home" && (
          <div className="pt-16">
            <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-[#f8f9fb]">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/60 rounded-full blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
                <div className="max-w-4xl">
                  <div className="inline-flex items-center gap-2 bg-[#eef0fd] border border-indigo-100 rounded-full px-4 py-1.5 mb-10">
                    <div className="w-1.5 h-1.5 bg-[#4f46e5] rounded-full animate-pulse" />
                    <span className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest">Tools + Knowledge</span>
                  </div>
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-[#0f1523] leading-[1.02] tracking-tight mb-6"
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    Every tool.<br /><span className="text-[#4f46e5]">Every answer.</span>
                  </h1>
                  <p className="text-[#6b7a99] text-lg sm:text-xl leading-relaxed mb-12 max-w-2xl">
                    Precision calculators, converters, and in-depth editorial — built for people who need the right answer, fast.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => nav("tools")}
                      className="bg-[#4f46e5] text-white px-7 py-3.5 rounded-2xl font-semibold text-sm hover:bg-[#4338ca] transition-colors flex items-center gap-2 cursor-pointer shadow-xl shadow-indigo-200">
                      Open Tools <ArrowRight size={15} />
                    </button>
                    <button onClick={() => nav("blog")}
                      className="bg-white text-[#0f1523] border border-[#e4e8f0] px-7 py-3.5 rounded-2xl font-semibold text-sm hover:border-indigo-200 hover:bg-[#f8f9fb] transition-colors cursor-pointer">
                      Read Articles
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-10 right-10 hidden lg:flex flex-col gap-3">
                {tools.slice(0, 2).map(t => (
                  <div key={t.id} className="bg-white border border-[#e4e8f0] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.bg }}>
                      <t.icon size={15} style={{ color: t.color }} />
                    </div>
                    <span className="text-[#0f1523] text-sm font-medium">{t.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest mb-2">Toolkit</div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Built for precision</h2>
                </div>
                <button onClick={() => nav("tools")} className="text-[#6b7a99] text-sm hover:text-[#0f1523] flex items-center gap-1 transition-colors cursor-pointer">
                  All tools <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tools.map(t => (
                  <button key={t.id} onClick={() => openTool(t.id)}
                    className="bg-white border border-[#e4e8f0] rounded-3xl p-6 text-left hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all group cursor-pointer shadow-sm">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: t.bg }}>
                      <t.icon size={22} style={{ color: t.color }} />
                    </div>
                    <div className="text-[#0f1523] font-semibold mb-1.5">{t.name}</div>
                    <div className="text-[#6b7a99] text-sm leading-snug">{t.desc}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-[#4f46e5] mx-4 sm:mx-8 lg:mx-16 rounded-3xl mb-24 px-8 py-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[{ num: "4", label: "Precision tools" }, { num: "6", label: "In-depth articles" }, { num: "100%", label: "Free to use" }, { num: "0", label: "Ads or tracking" }].map(s => (
                  <div key={s.label}>
                    <div className="text-4xl font-bold text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.num}</div>
                    <div className="text-indigo-300 text-sm mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <div className="text-[#06b6d4] text-xs font-mono uppercase tracking-widest mb-2">Editorial</div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Latest articles</h2>
                </div>
                <button onClick={() => nav("blog")} className="text-[#6b7a99] text-sm hover:text-[#0f1523] flex items-center gap-1 transition-colors cursor-pointer">
                  All articles <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <button onClick={() => openArticle(articles[0].id)}
                  className="lg:col-span-3 bg-white border border-[#e4e8f0] rounded-3xl overflow-hidden text-left hover:shadow-xl hover:shadow-indigo-50 transition-all group cursor-pointer shadow-sm">
                  <div className="aspect-video overflow-hidden bg-slate-100">
                    <img src={articles[0].image} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full font-medium" style={{ color: articles[0].tagColor, backgroundColor: articles[0].tagBg }}>{articles[0].tag}</span>
                      <span className="text-[#6b7a99] text-xs">{articles[0].category}</span>
                    </div>
                    <h3 className="text-[#0f1523] font-bold text-xl leading-snug mb-2 group-hover:text-[#4f46e5] transition-colors" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                      {articles[0].title}
                    </h3>
                    <p className="text-[#6b7a99] text-sm leading-relaxed line-clamp-2">{articles[0].excerpt}</p>
                    <div className="flex items-center gap-4 mt-5 text-xs text-[#c4cad9]">
                      <span>{articles[0].author}</span><span>{articles[0].date}</span><span>{articles[0].readTime} read</span>
                    </div>
                  </div>
                </button>
                <div className="lg:col-span-2 space-y-4">
                  {articles.slice(1, 4).map(a => (
                    <button key={a.id} onClick={() => openArticle(a.id)}
                      className="w-full bg-white border border-[#e4e8f0] rounded-2xl p-4 text-left hover:shadow-md hover:border-indigo-100 transition-all group cursor-pointer flex gap-4 items-start shadow-sm">
                      <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                        <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[#6b7a99] text-xs mb-1">{a.category} · {a.readTime}</div>
                        <div className="text-[#0f1523] text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#4f46e5] transition-colors">{a.title}</div>
                        <div className="text-[#c4cad9] text-xs mt-1.5">{a.author}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TOOLS */}
        {page === "tools" && (
          <div className="pt-16 min-h-screen bg-[#f8f9fb]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="mb-4">
                <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest mb-2">Toolkit</div>
                <h1 className="text-4xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tools</h1>
                <p className="text-[#6b7a99] mt-2 text-sm">Precision instruments for everyday calculations.</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-8 mb-12">
                {tools.map(t => (
                  <button key={t.id} onClick={() => setActiveTool(t.id)}
                    className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                      activeTool === t.id ? "text-white shadow-lg" : "bg-white text-[#6b7a99] border border-[#e4e8f0] hover:border-indigo-200 hover:text-[#0f1523] shadow-sm"
                    }`}
                    style={activeTool === t.id ? { backgroundColor: tools.find(x => x.id === t.id)?.color, boxShadow: `0 8px 20px ${tools.find(x => x.id === t.id)?.color}30` } : {}}>
                    {t.name}
                  </button>
                ))}
              </div>
              {activeTool === "fire" && <FIRECalculator />}
              {activeTool === "percentage" && <PercentageTool />}
              {activeTool === "bmi" && <BMITool />}
              {activeTool === "unit" && <UnitConverter />}
            </div>
          </div>
        )}

        {/* BLOG */}
        {page === "blog" && (
          <div className="pt-16 min-h-screen bg-[#f8f9fb]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="mb-14">
                <div className="text-[#06b6d4] text-xs font-mono uppercase tracking-widest mb-2">Editorial</div>
                <h1 className="text-4xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Articles</h1>
                <p className="text-[#6b7a99] mt-2 text-sm">In-depth pieces on mathematics, science, finance, and beyond.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.map(a => (
                  <button key={a.id} onClick={() => openArticle(a.id)}
                    className="bg-white border border-[#e4e8f0] rounded-3xl overflow-hidden text-left hover:shadow-xl hover:shadow-indigo-50 transition-all group cursor-pointer flex flex-col shadow-sm">
                    <div className="aspect-video overflow-hidden bg-slate-100">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full font-medium" style={{ color: a.tagColor, backgroundColor: a.tagBg }}>{a.tag}</span>
                        <span className="text-[#6b7a99] text-xs">{a.category}</span>
                      </div>
                      <h3 className="text-[#0f1523] font-bold leading-snug mb-2 flex-1 group-hover:text-[#4f46e5] transition-colors" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{a.title}</h3>
                      <p className="text-[#6b7a99] text-sm leading-relaxed line-clamp-2 mb-4">{a.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-[#c4cad9] pt-4 border-t border-[#f1f3f8]">
                        <span>{a.author}</span><span>{a.readTime} read</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ARTICLE */}
        {page === "article" && activeArticle && (
          <div className="pt-16 min-h-screen bg-[#f8f9fb]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
              <button onClick={() => nav("blog")} className="text-[#6b7a99] text-sm hover:text-[#0f1523] flex items-center gap-1.5 mb-10 transition-colors cursor-pointer">
                ← Back to articles
              </button>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full font-semibold" style={{ color: activeArticle.tagColor, backgroundColor: activeArticle.tagBg }}>{activeArticle.tag}</span>
                <span className="text-[#6b7a99] text-xs">{activeArticle.category}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#0f1523] leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {activeArticle.title}
              </h1>
              <div className="flex flex-wrap items-center gap-5 text-sm text-[#6b7a99] mb-10 pb-10 border-b border-[#e4e8f0]">
                <span className="flex items-center gap-1.5"><User size={13} />{activeArticle.author}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} />{activeArticle.readTime} read</span>
                <span>{activeArticle.date}</span>
              </div>
              <div className="aspect-video rounded-3xl overflow-hidden mb-12 bg-slate-100 shadow-lg shadow-slate-100">
                <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-[#374151] leading-relaxed space-y-5">
                <p className="text-xl text-[#0f1523] leading-relaxed font-medium">{activeArticle.excerpt}</p>
                {activeArticle.body.map((para, i) => (
                  <div key={i}>
                    {i > 0 && (
                      <h2 className="text-[#0f1523] text-xl font-bold mt-10 mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                        {["The Core Principle", "Real-World Evidence", "Practical Takeaway"][i - 1]}
                      </h2>
                    )}
                    <p className="leading-relaxed">{para}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12 p-6 bg-[#eef0fd] border border-indigo-100 rounded-3xl">
                <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest mb-2">Try a Tool</div>
                <p className="text-[#6b7a99] text-sm mb-4">Put the concepts from this article into practice with our precision calculators.</p>
                <button onClick={() => nav("tools")}
                  className="bg-[#4f46e5] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4338ca] transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-200">
                  Open Tools <ArrowRight size={14} />
                </button>
              </div>
              <div className="mt-12 pt-8 border-t border-[#e4e8f0]">
                <div className="text-[#6b7a99] text-xs font-mono uppercase tracking-widest mb-5">More articles</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {articles.filter(a => a.id !== activeArticleId).slice(0, 2).map(a => (
                    <button key={a.id} onClick={() => openArticle(a.id)}
                      className="bg-white border border-[#e4e8f0] rounded-2xl p-4 text-left hover:shadow-md hover:border-indigo-100 transition-all group cursor-pointer shadow-sm">
                      <div className="text-[#6b7a99] text-xs mb-1.5">{a.category} · {a.readTime}</div>
                      <div className="text-[#0f1523] text-sm font-semibold leading-snug group-hover:text-[#4f46e5] transition-colors">{a.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#e4e8f0] bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#4f46e5] rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
                  <span className="text-white font-mono font-bold text-xs">RL</span>
                </div>
                <span className="text-[#0f1523] font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>RichLifeTools</span>
              </div>
              <p className="text-[#6b7a99] text-sm leading-relaxed">Precision tools and thoughtful editorial for the curious and the practical.</p>
            </div>
            <div>
              <div className="text-[#c4cad9] text-xs font-mono uppercase tracking-widest mb-4">Tools</div>
              <div className="space-y-2.5">
                {tools.map(t => (
                  <button key={t.id} onClick={() => openTool(t.id)} className="block text-[#6b7a99] text-sm hover:text-[#4f46e5] transition-colors cursor-pointer">{t.name}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[#c4cad9] text-xs font-mono uppercase tracking-widest mb-4">Articles</div>
              <div className="space-y-2.5">
                {articles.slice(0, 4).map(a => (
                  <button key={a.id} onClick={() => openArticle(a.id)} className="block text-[#6b7a99] text-sm hover:text-[#4f46e5] transition-colors cursor-pointer text-left line-clamp-1">{a.title}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-[#f1f3f8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#c4cad9] text-xs font-mono">
            <span>© 2026 RichLifeTools — Built for precision living</span>
            <span>4 tools · 6 articles</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
