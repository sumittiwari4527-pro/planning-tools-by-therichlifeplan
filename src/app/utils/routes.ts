import { articles } from "../data/articles";

export const TOOL_ROUTES = {
  fire: "/tools/fire-calculator",
  goal: "/tools/goal-planner",
  bmi: "/tools/bmi-calculator",
  unit: "/tools/unit-converter",
} as const;

export type ToolId = keyof typeof TOOL_ROUTES;

export const ARTICLE_ROUTES = articles.map((article) => ({
  id: article.id,
  path: `/blog/${article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
}));

export const articlePathById = new Map(ARTICLE_ROUTES.map(({ id, path }) => [id, path]));

export const articleIdByPath = new Map(ARTICLE_ROUTES.map(({ id, path }) => [path, id]));

export const toolIdByPath = new Map(
  Object.entries(TOOL_ROUTES).map(([id, path]) => [path, id as ToolId])
);

export const pathForTool = (tool: string) =>
  TOOL_ROUTES[tool as ToolId] || "/tools";
