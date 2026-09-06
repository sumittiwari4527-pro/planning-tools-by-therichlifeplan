import React, { useState, useCallback } from "react";
import { Menu, X, Flame, Target, TrendingUp, Hash, ChevronRight, ArrowRight } from "lucide-react";

// ─── Constants & Types ───────────────────────────────────────────
import { SITE_NAME, CurrencyCode, CURRENCY_OPTIONS } from "./utils/constants";
import { useSEO } from "./hooks/useSEO";

// ─── Features ────────────────────────────────────────────────────
import { FIRECalculator } from "./features/fire-calculator/FIRECalculator";
import { GoalPlanner } from "./features/goal-planner/GoalPlanner";
import { BMICalculator } from "./features/bmi-calculator/BMICalculator";
import { UnitConverter } from "./features/unit-converter/UnitConverter";
import { Blog } from "./features/blog/Blog";
import { ArticleView } from "./features/blog/ArticleView";

// ─── Data ───────────────────────────────────────────────────────
import { articles } from "./data/articles";

// ─── Types ──────────────────────────────────────────────────────
type Page = "home" | "tools" | "blog" | "article";

// ─── Tool Definitions ───────────────────────────────────────────
const tools = [
  { id: "fire", icon: Flame, name: "FIRE Calculator", desc: "Precise financial independence calculator with visualizations", color: "#ef4444", bg: "#fee2e2" },
  { id: "goal", icon: Target, name: "Goal Planner", desc: "Multi-goal financial planning with actionable steps", color: "#8b5cf6", bg: "#f3f0ff" },
  { id: "bmi", icon: TrendingUp, name: "BMI Calculator", desc: "Body mass index with health context", color: "#10b981", bg: "#d1fae5" },
  { id: "unit", icon: Hash, name: "Unit Converter", desc: "Convert between length, weight, and temperature", color: "#f59e0b", bg: "#fef3c7" },
];

// ─── App Component ──────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [activeTool, setActiveTool] = useState<string>("fire");
  const [activeArticleId, setActiveArticleId] = useState<number | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (newPage: Page, tool?: string) => {
    setPage(newPage);
    if (tool) setActiveTool(tool);
    setMobileMenuOpen(false);
  };

  const openArticle = useCallback((id: number) => {
    setActiveArticleId(id);
    setPage("article");
  }, []);

  // ─── SEO Setup ──────────────────────────────────────────────────
  const seConfig = {
    home: {
      title: SITE_NAME,
      description: "Free FIRE calculator, goal planning calculator, BMI calculator, and unit converter. Set financial goals and build an actionable savings plan — no sign-up required.",
      url: "/",
    },
    tools: {
      title: "Tools",
      description: "Precision calculators for financial planning, goal tracking, health metrics, and unit conversions.",
      url: "/tools",
    },
    blog: {
      title: "Articles",
      description: "In-depth pieces on mathematics, science, finance, and beyond.",
      url: "/blog",
    },
    article: activeArticleId
      ? {
          title: articles.find((a) => a.id === activeArticleId)?.title || "Article",
          description: articles.find((a) => a.id === activeArticleId)?.excerpt || "",
          url: `/blog/${activeArticleId}`,
          type: "article" as const,
        }
      : null,
  };

  const seoData = seConfig[page as keyof typeof seConfig];
  if (seoData) {
    useSEO(seoData as any);
  }

  const navLinks: [Page, string][] = [
    ["home", "Home"],
    ["tools", "Tools"],
    ["blog", "Blog"],
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#0f1523] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── NAV ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e4e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate("home")} className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-8 h-8 bg-[#4f46e5] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-indigo-200">
                <span className="text-white font-mono font-bold text-xs">RL</span>
              </div>
              <span className="text-[#0f1523] font-bold tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {SITE_NAME}
              </span>
            </button>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(([p, label]) => (
                <button key={p} onClick={() => navigate(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    page === p ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-200" : "text-[#6b7a99] hover:text-[#0f1523] hover:bg-[#f1f3f8]"
                  }`}>{label}</button>
              ))}
            </div>
            <button className="md:hidden text-[#0f1523] p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#e4e8f0] px-4 py-3 space-y-1">
            {navLinks.map(([p, label]) => (
              <button key={p} onClick={() => navigate(p)}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                  page === p ? "bg-[#4f46e5] text-white font-medium" : "text-[#6b7a99] hover:text-[#0f1523] hover:bg-[#f1f3f8]"
                }`}>{label}</button>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1">
        {/* HOME PAGE */}
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
                    <button onClick={() => navigate("tools")}
                      className="bg-[#4f46e5] text-white px-7 py-3.5 rounded-2xl font-semibold text-sm hover:bg-[#4338ca] transition-colors flex items-center gap-2 cursor-pointer shadow-xl shadow-indigo-200">
                      Open Tools <ArrowRight size={15} />
                    </button>
                    <button onClick={() => navigate("blog")}
                      className="bg-white text-[#0f1523] border border-[#e4e8f0] px-7 py-3.5 rounded-2xl font-semibold text-sm hover:border-indigo-200 hover:bg-[#f8f9fb] transition-colors cursor-pointer">
                      Read Articles
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-10 right-10 hidden lg:flex flex-col gap-3">
                {tools.slice(0, 2).map(t => {
                  const Icon = t.icon;
                  return (
                    <div key={t.id} className="bg-white border border-[#e4e8f0] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.bg }}>
                        <Icon size={15} style={{ color: t.color }} />
                      </div>
                      <span className="text-[#0f1523] text-sm font-medium">{t.name}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest mb-2">Toolkit</div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Built for precision</h2>
                </div>
                <button onClick={() => navigate("tools")} className="text-[#6b7a99] text-sm hover:text-[#0f1523] flex items-center gap-1 transition-colors cursor-pointer">
                  All tools <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tools.map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} onClick={() => navigate("tools", t.id)}
                      className="bg-white border border-[#e4e8f0] rounded-3xl p-6 text-left hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all group cursor-pointer shadow-sm">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: t.bg }}>
                        <Icon size={22} style={{ color: t.color }} />
                      </div>
                      <div className="text-[#0f1523] font-semibold mb-1.5">{t.name}</div>
                      <div className="text-[#6b7a99] text-sm leading-snug">{t.desc}</div>
                    </button>
                  );
                })}
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
                <button onClick={() => navigate("blog")} className="text-[#6b7a99] text-sm hover:text-[#0f1523] flex items-center gap-1 transition-colors cursor-pointer">
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

        {/* TOOLS PAGE */}
        {page === "tools" && (
          <div className="pt-16 min-h-screen bg-[#f8f9fb]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              {/* Tool Selector */}
              <div className="mb-12">
                <div className="text-[#0f1523] text-xs font-mono uppercase tracking-widest mb-4">Calculators</div>
                <h2 className="text-3xl font-bold text-[#0f1523] mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Precision instruments</h2>
                <p className="text-[#6b7a99] mb-8 text-sm">Precision instruments for everyday calculations.</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {tools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTool(t.id)}
                      className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                        activeTool === t.id ? "text-white shadow-lg" : "bg-white text-[#6b7a99] border border-[#e4e8f0] hover:border-indigo-200 hover:text-[#0f1523] shadow-sm"
                      }`}
                      style={activeTool === t.id ? { backgroundColor: t.color, boxShadow: `0 8px 20px ${t.color}30` } : {}}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tool Display */}
              <div className="bg-white rounded-3xl p-8 border border-[#e4e8f0] shadow-sm">
                {activeTool === "fire" && <FIRECalculator currency={currency} setCurrency={setCurrency} />}
                {activeTool === "goal" && <GoalPlanner currency={currency} setCurrency={setCurrency} />}
                {activeTool === "bmi" && <BMICalculator />}
                {activeTool === "unit" && <UnitConverter />}
              </div>
            </div>
          </div>
        )}

        {/* BLOG PAGE */}
        {page === "blog" && <Blog onSelectArticle={openArticle} />}

        {/* ARTICLE PAGE */}
        {page === "article" && activeArticleId && (
          <ArticleView
            articleId={activeArticleId}
            onNavigateToBlog={() => navigate("blog")}
            onNavigateToTools={() => navigate("tools", "fire")}
          />
        )}
      </main>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer className="bg-[#0f1523] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-2xl font-bold mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {SITE_NAME}
          </div>
          <p className="text-[#c4cad9] text-sm mb-8">Free precision calculators for everyone.</p>
          <div className="flex justify-center gap-6 flex-wrap mb-8 text-sm">
            {navLinks.map(([p, label]) => (
              <button
                key={p}
                onClick={() => navigate(p)}
                className="text-[#c4cad9] hover:text-white transition-colors cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[#6b7a99] text-xs">© 2024 {SITE_NAME}. No ads. No sign-up. No tracking.</p>
        </div>
      </footer>
    </div>
  );
}
