import { articles } from "../../data/articles";

interface ArticleCardProps {
  articleId: number;
  onSelect: (articleId: number) => void;
}

export function ArticleCard({ articleId, onSelect }: ArticleCardProps) {
  const article = articles.find((a) => a.id === articleId);
  if (!article) return null;

  return (
    <button
      onClick={() => onSelect(article.id)}
      className="bg-white border border-[#e4e8f0] rounded-3xl overflow-hidden text-left hover:shadow-xl hover:shadow-indigo-50 transition-all group cursor-pointer flex flex-col shadow-sm"
    >
      <div className="aspect-video overflow-hidden bg-slate-100">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full font-medium" style={{ color: article.tagColor, backgroundColor: article.tagBg }}>
            {article.tag}
          </span>
          <span className="text-[#6b7a99] text-xs">{article.category}</span>
        </div>
        <h3
          className="text-[#0f1523] font-bold leading-snug mb-2 flex-1 group-hover:text-[#4f46e5] transition-colors"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          {article.title}
        </h3>
        <p className="text-[#6b7a99] text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-[#c4cad9] pt-4 border-t border-[#f1f3f8]">
          <span>{article.author}</span>
          <span>{article.readTime} read</span>
        </div>
      </div>
    </button>
  );
}
