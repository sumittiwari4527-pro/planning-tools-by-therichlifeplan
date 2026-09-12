import { useEffect } from "react";
import App from "./App";
import { articles } from "./data/articles";

const toolRoutes: Record<string, string> = { fire: "/tools/fire-calculator", goal: "/tools/goal-planner", bmi: "/tools/bmi-calculator", unit: "/tools/unit-converter" };
const articleSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const articleRoutes = new Map(articles.map((article) => [article.id, `/blog/${articleSlug(article.title)}`]));

const routeForButton = (button: HTMLButtonElement): string | null => {
  const text = button.textContent?.replace(/\s+/g, " ").trim() || "";
  if (text === "Home") return "/";
  if (text === "Tools" || text === "All tools" || text === "Open Tools") return "/tools";
  if (text === "Blog" || text === "All articles" || text === "Read Articles") return "/blog";
  const names: Record<string, string> = { fire: "FIRE Calculator", goal: "Goal Planner", bmi: "BMI Calculator", unit: "Unit Converter" };
  for (const [id, name] of Object.entries(names)) if (text.includes(name)) return toolRoutes[id];
  for (const article of articles) if (text.includes(article.title)) return articleRoutes.get(article.id) || null;
  return null;
};

const routeFromLocation = () => {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/tools" || path === "/blog") return path;
  if (Object.values(toolRoutes).includes(path) || path.startsWith("/blog/")) return path;
  return "/";
};

const buttons = () => Array.from(document.querySelectorAll<HTMLButtonElement>("button"));
const clickText = (text: string) => buttons().find((b) => b.textContent?.replace(/\s+/g, " ").trim() === text)?.click();

const clickForRoute = (route: string) => {
  if (route === "/") return clickText("Home");
  const tool = Object.entries(toolRoutes).find(([, value]) => value === route)?.[0];
  const names: Record<string, string> = { fire: "FIRE Calculator", goal: "Goal Planner", bmi: "BMI Calculator", unit: "Unit Converter" };
  if (tool) return clickText(names[tool]);
  const article = articles.find((item) => articleRoutes.get(item.id) === route);
  if (article) {
    clickText("Blog");
    window.setTimeout(() => buttons().find((b) => b.textContent?.includes(article.title))?.click(), 0);
    return;
  }
  clickText("Blog");
};

export default function RoutingShell() {
  useEffect(() => {
    const syncFromLocation = () => clickForRoute(routeFromLocation());
    const handleClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest("button") as HTMLButtonElement | null;
      const route = button ? routeForButton(button) : null;
      if (route) window.setTimeout(() => { if (window.location.pathname !== route) window.history.pushState({}, "", route); }, 0);
    };
    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", syncFromLocation);
    window.setTimeout(syncFromLocation, 0);
    return () => { document.removeEventListener("click", handleClick); window.removeEventListener("popstate", syncFromLocation); };
  }, []);
  return <App />;
}
