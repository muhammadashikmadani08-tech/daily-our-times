import { Link } from "react-router-dom";
import { useBreakingPosts } from "@/hooks/usePosts";
import { AlertCircle } from "lucide-react";

export const BreakingNewsTicker = () => {
  const { data: breakingNews } = useBreakingPosts();

  if (!breakingNews || breakingNews.length === 0) {
    return null;
  }

  const duplicatedNews = [...breakingNews, ...breakingNews];

  return (
    <div className="bg-breaking-bg text-breaking-text py-2 overflow-hidden">
      <div className="container flex items-center gap-4">
        <div className="flex items-center gap-2 flex-shrink-0 bg-white/20 px-3 py-1 rounded">
          <AlertCircle className="h-4 w-4" />
          <span className="font-bold text-sm">ব্রেকিং</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker flex gap-12 whitespace-nowrap">
            {duplicatedNews.map((news, index) => (
              <Link
                key={`${news.id}-${index}`}
                to={`/news/${news.slug}`}
                className="hover:underline text-sm"
              >
                ◆ {news.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
