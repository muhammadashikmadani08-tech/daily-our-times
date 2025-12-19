import { Link } from "react-router-dom";
import { NewsArticle } from "@/types/news";
import { NewsCard } from "./NewsCard";
import { ChevronRight } from "lucide-react";

interface CategorySectionProps {
  title: string;
  slug: string;
  news: NewsArticle[];
}

export const CategorySection = ({ title, slug, news }: CategorySectionProps) => {
  if (news.length === 0) return null;

  const [mainNews, ...restNews] = news;

  return (
    <section className="py-6 border-b border-border last:border-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-bold text-foreground border-l-4 border-primary pl-3">{title}</h2>
        <Link to={`/category/${slug}`} className="text-sm text-primary hover:underline flex items-center gap-1">
          সব খবর <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <NewsCard news={mainNews} variant="medium" />
        </div>
        {restNews.slice(0, 4).map((item) => (
          <NewsCard key={item.id} news={item} variant="small" />
        ))}
      </div>
    </section>
  );
};
