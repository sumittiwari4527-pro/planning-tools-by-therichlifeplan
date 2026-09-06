import { articles } from "../../data/articles";
import { ArticleCard } from "./ArticleCard";

interface BlogProps {
  onSelectArticle: (articleId: number) => void;
}

export function Blog({ onSelectArticle }: BlogProps) {
  return (
    <div className="pt-16 min-h-screen bg-[#f8f9fb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-14">
          <div className="text-[#06b6d4] text-xs font-mono uppercase tracking-widest mb-2">Editorial</div>
          <h1 className="text-4xl font-bold text-[#0f1523]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Articles
          </h1>
          <p className="text-[#6b7a99] mt-2 text-sm">In-depth pieces on mathematics, science, finance, and beyond.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <ArticleCard key={article.id} articleId={article.id} onSelect={onSelectArticle} />
          ))}
        </div>
      </div>
    </div>
  );
}
