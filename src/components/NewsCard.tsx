import { Link } from "react-router-dom";
import { NewsArticle } from "@/types/news";
import { Clock, Eye } from "lucide-react";

interface NewsCardProps {
  news: NewsArticle;
  variant?: "large" | "medium" | "small" | "horizontal";
}

export const NewsCard = ({ news, variant = "medium" }: NewsCardProps) => {
  const newsLink = `/news/${news.slug || news.id}`;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "short",
    });
  };

  if (variant === "large") {
    return (
      <Link to={newsLink} className="group block">
        <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
          <img src={news.imageUrl || "https://via.placeholder.com/800x450"} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {news.category && <span className="bg-primary text-primary-foreground px-2 py-1 text-xs font-medium">{news.category.name}</span>}
            <h2 className="font-serif text-2xl md:text-3xl font-bold mt-3 mb-2 group-hover:underline">{news.title}</h2>
            {news.subtitle && <p className="text-white/80 text-sm md:text-base">{news.subtitle}</p>}
            <div className="flex items-center gap-4 mt-3 text-xs text-white/70">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(news.publishedAt)}</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{(news.views || 0).toLocaleString("bn-BD")}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link to={newsLink} className="group flex gap-3 py-3 border-b border-border last:border-0">
        <div className="w-24 h-16 flex-shrink-0 overflow-hidden rounded-sm">
          <img src={news.imageUrl || "https://via.placeholder.com/200x150"} alt={news.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif text-sm font-medium line-clamp-2 group-hover:text-primary">{news.title}</h4>
          <span className="text-xs text-muted-foreground mt-1 block">{formatDate(news.publishedAt)}</span>
        </div>
      </Link>
    );
  }

  if (variant === "small") {
    return (
      <Link to={newsLink} className="group block">
        <div className="aspect-[4/3] overflow-hidden rounded-sm mb-2">
          <img src={news.imageUrl || "https://via.placeholder.com/200x150"} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        {news.category && <span className="text-news-category text-xs font-medium">{news.category.name}</span>}
        <h4 className="font-serif text-sm font-medium mt-1 line-clamp-2 group-hover:text-primary">{news.title}</h4>
      </Link>
    );
  }

  // Medium (default)
  return (
    <Link to={newsLink} className="group block">
      <div className="aspect-[16/10] overflow-hidden rounded-sm mb-3">
        <img src={news.imageUrl || "https://via.placeholder.com/400x250"} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      {news.category && <span className="text-news-category text-xs font-medium">{news.category.name}</span>}
      <h3 className="font-serif text-lg font-bold mt-1 mb-2 line-clamp-2 group-hover:text-primary">{news.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{news.excerpt}</p>
      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(news.publishedAt)}</span>
      </div>
    </Link>
  );
};
