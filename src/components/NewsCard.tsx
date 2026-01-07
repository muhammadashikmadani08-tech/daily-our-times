import * as React from "react";
import { Link } from "react-router-dom";
import { NewsArticle } from "@/types/news";
import { Clock, Eye } from "lucide-react";

interface NewsCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  news: NewsArticle;
  variant?: "large" | "medium" | "small" | "horizontal";
}

export const NewsCard = React.forwardRef<HTMLAnchorElement, NewsCardProps>(
  ({ news, variant = "medium", ...props }, ref) => {
    const newsLink = `/news/${news.slug || news.id}`;
    
    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      return new Date(dateString).toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "short",
      });
    };

    // Large card - Feature image on top, headline BELOW (not overlay)
    if (variant === "large") {
      return (
        <Link ref={ref} to={newsLink} className="group block" {...props}>
          <div className="aspect-[16/9] overflow-hidden rounded-lg mb-3">
            <img 
              src={news.imageUrl || "https://via.placeholder.com/800x450"} 
              alt={news.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="space-y-2">
            {news.category && (
              <span className="text-primary text-xs font-medium">
                {news.category.name}
              </span>
            )}
            <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-3">
              {news.title}
            </h2>
            {news.subtitle && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {news.subtitle}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(news.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {(news.views || 0).toLocaleString("bn-BD")}
              </span>
            </div>
          </div>
        </Link>
      );
    }

    // Horizontal card - image left, content right
    if (variant === "horizontal") {
      return (
        <Link ref={ref} to={newsLink} className="group flex gap-3 py-3 border-b border-border last:border-0" {...props}>
          <div className="w-24 h-16 flex-shrink-0 overflow-hidden rounded">
            <img 
              src={news.imageUrl || "https://via.placeholder.com/200x150"} 
              alt={news.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {news.title}
            </h4>
            <span className="text-xs text-muted-foreground mt-1 block">
              {formatDate(news.publishedAt)}
            </span>
          </div>
        </Link>
      );
    }

    // Small card - image top, headline below
    if (variant === "small") {
      return (
        <Link ref={ref} to={newsLink} className="group block" {...props}>
          <div className="aspect-[4/3] overflow-hidden rounded mb-2">
            <img 
              src={news.imageUrl || "https://via.placeholder.com/200x150"} 
              alt={news.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          {news.category && (
            <span className="text-primary text-xs font-medium">
              {news.category.name}
            </span>
          )}
          <h4 className="font-serif text-sm font-medium mt-1 line-clamp-2 group-hover:text-primary transition-colors">
            {news.title}
          </h4>
        </Link>
      );
    }

    // Medium (default) - image top, headline below
    return (
      <Link ref={ref} to={newsLink} className="group block" {...props}>
        <div className="aspect-[16/10] overflow-hidden rounded mb-3">
          <img 
            src={news.imageUrl || "https://via.placeholder.com/400x250"} 
            alt={news.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        {news.category && (
          <span className="text-primary text-xs font-medium">
            {news.category.name}
          </span>
        )}
        <h3 className="font-serif text-lg font-bold mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {news.excerpt}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(news.publishedAt)}
          </span>
        </div>
      </Link>
    );
  }
);
NewsCard.displayName = "NewsCard";
