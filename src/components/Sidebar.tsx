import { useState } from "react";
import { NewsCard } from "./NewsCard";
import { useLatestPosts, useMostReadPosts } from "@/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<"latest" | "popular">("latest");
  const { data: latestPosts, isLoading: latestLoading } = useLatestPosts(5);
  const { data: mostReadPosts, isLoading: mostReadLoading } = useMostReadPosts(5);

  const formatPostToNews = (post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    subtitle: post.subtitle || undefined,
    content: post.content || "",
    excerpt: post.excerpt || "",
    category: post.category || { id: "", name: "", slug: "", nameEn: "" },
    author: post.author || { id: "", name: "" },
    publishedAt: post.published_at || "",
    imageUrl: post.featured_image || "",
    tags: post.tags || [],
    views: post.views || 0
  });

  const displayPosts = activeTab === "latest" ? latestPosts : mostReadPosts;
  const isLoading = activeTab === "latest" ? latestLoading : mostReadLoading;

  return (
    <aside className="space-y-6">
      {/* Latest/Popular Toggle */}
      <div className="bg-card rounded p-4 border border-border">
        <div className="flex border-b border-border mb-4">
          <button
            onClick={() => setActiveTab("latest")}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "latest" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            সর্বশেষ
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "popular" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            সর্বাধিক পঠিত
          </button>
        </div>
        <div className="space-y-1">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))
          ) : displayPosts && displayPosts.length > 0 ? (
            displayPosts.map((post) => (
              <NewsCard key={post.id} news={formatPostToNews(post)} variant="horizontal" />
            ))
          ) : (
            <p className="text-muted-foreground text-sm">কোনো খবর নেই</p>
          )}
        </div>
      </div>

      {/* Ad Block */}
      <div className="bg-muted rounded p-8 border border-border text-center">
        <span className="text-xs text-muted-foreground">বিজ্ঞাপন</span>
        <div className="mt-4 text-muted-foreground">৩০০ × ২৫০</div>
      </div>
    </aside>
  );
};
