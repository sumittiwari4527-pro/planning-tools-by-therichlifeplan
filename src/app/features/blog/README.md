# Blog Feature

## Overview

Multi-article blog system displaying in-depth educational content on finance, mathematics, science, and more. Components handle both article listing and individual article viewing.

## Files

- **Blog.tsx** - Main blog list view component
- **ArticleCard.tsx** - Individual article card (in grid)
- **ArticleView.tsx** - Full article detail view
- **README.md** - This file

## How to Use

### Import components

```typescript
import { Blog } from "@/app/features/blog/Blog";
import { ArticleView } from "@/app/features/blog/ArticleView";

// In your router or parent component
{page === "blog" && <Blog onSelectArticle={setActiveArticle} />}
{page === "article" && <ArticleView articleId={activeArticle} onNavigateToBlog={handleBlogNav} onNavigateToTools={handleToolsNav} />}
```

### Data source

All article content is stored in [src/app/data/articles.ts](../../data/articles.ts) and automatically imported by components.

## Component Structure

### Blog.tsx
- Displays grid of all articles
- Maps through articles and renders ArticleCard components
- Calls onSelectArticle callback when article is clicked
- Props: `{ onSelectArticle: (articleId: number) => void }`

### ArticleCard.tsx
- Represents a single article in grid view
- Shows: featured image, title, excerpt, category, author, read time
- Hover effect: image zoom, title color change
- Click handler: triggers navigation to full article view
- Props: `{ articleId: number; onSelect: (articleId: number) => void }`

### ArticleView.tsx
- Full article page with complete content
- Shows: header info, featured image, body text with section headers
- Action CTA: "Open Tools" button to navigate to tools section
- Back button: returns to blog list
- Props: `{ articleId: number; onNavigateToBlog: () => void; onNavigateToTools: () => void }`

## Data Structure

Each article is defined in `data/articles.ts`:

```typescript
interface Article {
  id: number;
  title: string;
  excerpt: string;
  body: string[]; // Array of paragraphs
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tag: string;
  tagColor: string; // hex color
  tagBg: string; // hex color (lighter version)
}
```

## Adding New Articles

1. Edit [src/app/data/articles.ts](../../data/articles.ts)
2. Add new article object to the `articles` array:

```typescript
{
  id: 7,
  title: "Your Article Title",
  excerpt: "Brief summary of article",
  body: [
    "First paragraph of body text...",
    "Second paragraph with more details...",
    "Third paragraph with conclusion...",
  ],
  category: "Finance",
  author: "Author Name",
  date: "2026-01-15",
  readTime: "5 min",
  image: "https://example.com/image.jpg",
  tag: "Tutorial",
  tagColor: "#8b5cf6", // Color of tag text
  tagBg: "#f3f0ff", // Background color of tag
}
```

## Styling

All components use consistent design tokens:
- Primary cyan: `#06b6d4` (headers)
- Primary indigo: `#4f46e5` (links, buttons)
- Text dark: `#0f1523`
- Text gray: `#6b7a99`
- Backgrounds: `#f8f9fb` (light), `#eef0fd` (indigo tint)

### Customization

Edit component styling by modifying Tailwind classes:
- Grid layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (in Blog.tsx)
- Article card width: `rounded-3xl` (in ArticleCard.tsx)
- Title font: `fontFamily: "'Bricolage Grotesque', sans-serif"`

## SEO Features

Each article has dedicated SEO metadata:
- Structured data: BlogPosting schema
- Meta tags: title, description, keywords
- Canonical URL: `{SITE_URL}/blog/{articleId}`
- Open Graph: image, title, description

Meta generation happens in parent component using [useSEO](../../hooks/useSEO.ts) hook.

## Dependencies

- React
- Lucide-react (icons: User, Clock, ArrowRight)
- @/data/articles (article content)

## Performance Notes

- Articles are static data (no API calls)
- All content loads synchronously
- Large images should be optimized (WebP format recommended)
- Grid is responsive: 1 column mobile, 2 on tablet, 3 on desktop

## Integration Checklist

- [ ] Import Blog and ArticleView components
- [ ] Add articles to data/articles.ts
- [ ] Wire up navigation handlers (onSelectArticle, onNavigateToBlog, onNavigateToTools)
- [ ] Test article grid layout on mobile/tablet/desktop
- [ ] Verify image loading and aspect ratios
- [ ] Add SEO metadata for each article
- [ ] Test "Open Tools" navigation link
- [ ] Verify "Back to articles" button works
