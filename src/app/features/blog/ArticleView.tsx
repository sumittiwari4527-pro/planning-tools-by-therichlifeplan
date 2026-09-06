import { User, Clock, ArrowRight } from "lucide-react";
import { articles } from "../../data/articles";
import ChatGPTPluginsArticle from "../../components/ChatGPTPluginsArticle";

interface ArticleViewProps {
  articleId: number;
  onNavigateToBlog: () => void;
  onNavigateToTools: () => void;
}

export function ArticleView({ articleId, onNavigateToBlog, onNavigateToTools }: ArticleViewProps) {
  const article = articles.find((a) => a.id === articleId);
  if (!article) return null;

  return (
    <div className="pt-16 min-h-screen bg-[#f8f9fb]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <button
          onClick={onNavigateToBlog}
          className="text-[#6b7a99] text-sm hover:text-[#0f1523] flex items-center gap-1.5 mb-10 transition-colors cursor-pointer"
        >
          ← Back to articles
        </button>

        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-xs font-mono px-2.5 py-0.5 rounded-full font-semibold"
            style={{ color: article.tagColor, backgroundColor: article.tagBg }}
          >
            {article.tag}
          </span>
          <span className="text-[#6b7a99] text-xs">{article.category}</span>
        </div>

        <h1
          className="text-3xl sm:text-5xl font-bold text-[#0f1523] leading-tight mb-6"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-5 text-sm text-[#6b7a99] mb-10 pb-10 border-b border-[#e4e8f0]">
          <span className="flex items-center gap-1.5">
            <User size={13} />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {article.readTime} read
          </span>
          <span>{article.date}</span>
        </div>

        <div className="aspect-video rounded-3xl overflow-hidden mb-12 bg-slate-100 shadow-lg shadow-slate-100">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {article.id === 7 ? (
          <>
            <ChatGPTPluginsArticle />
            <div className="mt-12 p-6 bg-[#eef0fd] border border-indigo-100 rounded-3xl">
              <div className="text-[#4f46e5] text-xs font-mono uppercase tracking-widest mb-2">Try a Tool</div>
              <p className="text-[#6b7a99] text-sm mb-4">Put the workflow mindset into practice with our free precision calculators and planning tools.</p>
              <button
                onClick={onNavigateToTools}
                className="bg-[#4f46e5] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4338ca] transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-200"
              >
                Open Tools <ArrowRight size={14} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-[#374151] leading-relaxed space-y-5">
              <p className="text-xl text-[#0f1523] leading-relaxed font-medium">{article.excerpt}</p>

              {article.body.map((para, i) => (
                <div key={i}>
                  {i > 0 && (
                    <h2
                      className="text-[#0f1523] text-xl font-bold mt-10 mb-4"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
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
              <button
                onClick={onNavigateToTools}
                className="bg-[#4f46e5] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4338ca] transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-200"
              >
                Open Tools <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

        <div className="mt-12 pt-8 border-t border-[#e4e8f0]">
          <div className="text-[#6b7a99] text-xs font-mono uppercase tracking-widest mb-5">More articles</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.filter((a) => a.id !== article.id).slice(0, 2).map((a) => (
              <button
                key={a.id}
                onClick={() => window.location.assign(`#article-${a.id}`)}
                className="bg-white border border-[#e4e8f0] rounded-2xl p-4 text-left hover:shadow-md hover:border-indigo-100 transition-all group cursor-pointer shadow-sm"
              >
                <div className="text-[#6b7a99] text-xs mb-1.5">{a.category} · {a.readTime}</div>
                <div className="text-[#0f1523] text-sm font-semibold leading-snug group-hover:text-[#4f46e5] transition-colors">{a.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
