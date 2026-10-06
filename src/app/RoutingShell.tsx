import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import App from "./App";
import { ARTICLE_ROUTES, TOOL_ROUTES, PARKING_ACTIVATION_ROUTE, PARKING_ORDER_SUCCESS_ROUTE } from "./utils/routes";

export default function RoutingShell() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tools" element={<App />} />
        {Object.values(TOOL_ROUTES).map((path) => (
          <Route key={path} path={path} element={<App />} />
        ))}
        <Route path="/products" element={<App />} />
        <Route path="/products/:slug" element={<App />} />
        <Route path="/parking" element={<App />} />
        <Route path={PARKING_ACTIVATION_ROUTE} element={<App />} />
        <Route path={PARKING_ORDER_SUCCESS_ROUTE} element={<App />} />
        <Route path="/blog" element={<App />} />
        <Route path="/contact" element={<App />} />
        <Route path="/privacy" element={<App />} />
        <Route path="/terms" element={<App />} />
        {ARTICLE_ROUTES.map((article) => (
          <Route key={article.id} path={article.path} element={<App />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
