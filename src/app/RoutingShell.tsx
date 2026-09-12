import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import App from "./App";
import { articles } from "./data/articles";

const articleSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const articleRoutes = articles.map((article) => ({
  id: article.id,
  path: `/blog/${articleSlug(article.title)}`,
}));

export default function RoutingShell() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tools" element={<App />} />
        <Route path="/tools/fire-calculator" element={<App />} />
        <Route path="/tools/goal-planner" element={<App />} />
        <Route path="/tools/bmi-calculator" element={<App />} />
        <Route path="/tools/unit-converter" element={<App />} />
        <Route path="/blog" element={<App />} />
        {articleRoutes.map((article) => (
          <Route key={article.id} path={article.path} element={<App />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
