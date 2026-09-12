import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import App from "./App";
import { articles } from "./data/articles";
import { SITE_NAME, SITE_URL } from "./utils/constants";

const toolRoutes: Record<string, string> = {
  fire: "/tools/fire-calculator",
  goal: "/tools/goal-planner",
  bmi: "/tools/bmi-calculator",
  unit: "/tools/unit-converter",
};

const toolNames: Record<string, string> = {
  fire: "FIRE Calculator",
  goal: "Goal Planner",
  bmi: "BMI Calculator",
  unit: "Unit Converter",
};

const articleSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const articleRoutes = new Map(
  articles.map((article) => [article.id, `/blog/${articleSlug(article.title)}`])
);

const validRoutes = new Set([
  "/",
  "/tools",
  ...Object.values(toolRoutes),
  "/blog",
  ...articleRoutes.values(),
]);

const routeForButton = (button: HTMLButtonElement): string | null => {
  const text = button.textContent?.replace(/\s+/g, " ").trim() || "";

  if (text === "Home") return "/";
  if (text === "Tools" || text === "All tools" || text === "Open Tools") return "/tools";
  if (text === "Blog" || text === "All articles" || text === "Read Articles") return "/blog";

  for (const [id, name] of Object.entries(toolNames)) {
    if (text.includes(name)) return toolRoutes[id];
  }

  for (const article of articles) {
    if (text.includes(article.title)) return articleRoutes.get(article.id) || null;
  }

  return null;
};

const buttons = () => Array.from(document.querySelectorAll<HTMLButtonElement>("button"));
const clickText = (text: string) =>
  buttons().find((button) => button.textContent?.replace(/\s+/g, " ").trim() === text)?.click();
const clickContains = (text: string) =>
  buttons().find((button) => button.textContent?.includes(text))?.click();

const syncAppState = (route: string) => {
  if (route === "/") return clickText("Home");
  if (route === "/tools") return clickText("Tools");
  if (route === "/blog") return clickText("Blog");

  const tool = Object.entries(toolRoutes).find(([, value]) => value === route)?.[0];
  if (tool) return clickContains(toolNames[tool]);

  const article = articles.find((item) => articleRoutes.get(item.id) === route);
  if (article) {
    clickText("Blog");
    window.setTimeout(() => clickContains(article.title), 0);
  }
};

function RouteBridge() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    syncAppState(path);

    const article = articles.find((item) => articleRoutes.get(item.id) === path);
    const canonical = `${SITE_URL}${path}`;
    const title = article ? `${article.title} — ${SITE_NAME}` : path === "/" ? SITE_NAME : path === "/blog" ? `Articles — ${SITE_NAME}` : path.includes("/tools") ? `Tools — ${SITE_NAME}` : SITE_NAME;
    const description = article?.excerpt ||
      (path === "/blog" ? "In-depth pieces on mathematics, science, finance, and beyond." :
        path.includes("/tools") ? "Precision calculators for financial planning, goal tracking, health metrics, and unit conversions." :
          "Free planning tools, calculators, and practical guides for money, goals, productivity, and everyday decisions. No sign-up required.");

    document.title = title;
    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}=\"${name}\"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", description);
    setMeta("robots", "index, follow");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:type", article ? "article" : "website", "property");

    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    let ldEl = document.getElementById("json-ld") as HTMLScriptElement | null;
    if (!ldEl) {
      ldEl = document.createElement("script");
      ldEl.id = "json-ld";
      ldEl.type = "application/ld+json";
      document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify(
      article
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            url: canonical,
            author: { "@type": "Person", name: article.author },
            datePublished: article.date,
            image: article.image,
          }
        : {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            description,
          }
    );

    return () => window.clearTimeout(0);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest("button") as HTMLButtonElement | null;
      const route = button ? routeForButton(button) : null;
      if (route && location.pathname !== route) navigate(route);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/tools" element={<App />} />
      <Route path="/tools/fire-calculator" element={<App />} />
      <Route path="/tools/goal-planner" element={<App />} />
      <Route path="/tools/bmi-calculator" element={<App />} />
      <Route path="/tools/unit-converter" element={<App />} />
      <Route path="/blog" element={<App />} />
      {articles.map((article) => (
        <Route key={article.id} path={articleRoutes.get(article.id)} element={<App />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function RoutingShell() {
  return (
    <BrowserRouter>
      <RouteBridge />
    </BrowserRouter>
  );
}
