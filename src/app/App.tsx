import React, { useState, useCallback } from "react";
import { Menu, X, Flame, Target, TrendingUp, Hash, ChevronRight } from "lucide-react";

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

  const seoData = seConfig[page];
  if (seoData) {
    useSEO(seoData);
  }

  const navLinks: [Page, string][] = [
    ["home", "Home"],
    ["tools", "Tools"],
    ["blog", "Blog"],
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* ─── NAV ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur border-b border-[#e4e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate("home")}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
            >
              <div className="text-2xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {SITE_NAME}
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(([p, label]) => (
                <button
                  key={p}
                  onClick={() => navigate(p)}
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    page === p ? "text-[#0f1523]" : "text-[#6b7a99] hover:text-[#0f1523]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#6b7a99] hover:text-[#0f1523] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navLinks.map(([p, label]) => (
                <button
                  key={p}
                  onClick={() => navigate(p)}
                  className={`block w-full text-left px-4 py-2 rounded-lg font-medium cursor-pointer ${
                    page === p
                      ? "bg-[#f1f3f8] text-[#0f1523]"
                      : "text-[#6b7a99] hover:bg-[#f8f9fb]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ─── CONTENT ──────────────────────────────────────────────── */}
      <main className="flex-1 pt-16">
        {/* HOME PAGE */}
        {page === "home" && (
          <div className="min-h-[calc(100vh-64px)] flex flex-col">
            {/* Hero */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
              <h1
                className="text-5xl sm:text-7xl font-bold text-[#0f1523] leading-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Precision Tools for Every Decision
              </h1>
              <p className="text-lg text-[#6b7a99] max-w-2xl mx-auto leading-relaxed">
                Free calculators and converters for financial planning, health metrics, and unit conversions. No sign-up required, no ads, just results.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => navigate("tools", "fire")}
                  className="bg-[#ef4444] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#dc2626] transition-colors cursor-pointer shadow-lg shadow-red-100"
                >
                  Explore Tools
                </button>
                <button
                  onClick={() => navigate("blog")}
                  className="border border-[#e4e8f0] text-[#0f1523] px-6 py-3 rounded-xl font-semibold hover:bg-[#f8f9fb] transition-colors cursor-pointer"
                >
                  Read Articles
                </button>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <div className="text-[#0f1523] text-xs font-mono uppercase tracking-widest mb-2">Tools</div>
                <h2
                  className="text-3xl font-bold text-[#0f1523]"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  Choose Your Tool
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => navigate("tools", t.id)}
                      className="bg-white border border-[#e4e8f0] rounded-2xl p-6 text-left hover:shadow-lg hover:shadow-indigo-50 transition-all group cursor-pointer"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: t.bg }}
                      >
                        <Icon size={24} style={{ color: t.color }} />
                      </div>
                      <h3 className="text-lg font-bold text-[#0f1523] mb-2">{t.name}</h3>
                      <p className="text-[#6b7a99] text-sm mb-3">{t.desc}</p>
                      <span className="flex items-center gap-1 text-sm font-medium" style={{ color: t.color }}>
                        Use Now <ChevronRight size={16} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TOOLS PAGE */}
        {page === "tools" && (
          <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fb]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              {/* Tool Selector */}
              <div className="mb-12">
                <div className="flex flex-wrap gap-2 mb-8">
                  {tools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTool(t.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        activeTool === t.id
                          ? "bg-[#0f1523] text-white shadow-lg"
                          : "bg-white text-[#6b7a99] border border-[#e4e8f0] hover:border-[#0f1523]"
                      }`}
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
