export interface Article {
  id: number;
  title: string;
  excerpt: string;
  body: string[];
  category: string;
  author: string;
  date: string;
  readTime: string;
  tag: string;
  image: string;
  tagColor: string;
  tagBg: string;
}

// Article content is being migrated here incrementally from AppLegacy.tsx.
// Keep this module as the single source of truth once the migration is complete.
export const articles: Article[] = [];
