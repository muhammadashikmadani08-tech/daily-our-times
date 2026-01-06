import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BreakingNewsTicker } from "@/components/BreakingNewsTicker";
import { NewsCard } from "@/components/NewsCard";
import { Sidebar } from "@/components/Sidebar";
import { CategorySection } from "@/components/CategorySection";
import { useTheme } from "@/hooks/useTheme";
import { useFeaturedPosts, useLatestPosts, usePostsByCategory } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const { isDark, toggleTheme } = useTheme();
  const { data: featuredPost, isLoading: featuredLoading } = useFeaturedPosts();
  const { data: latestPosts, isLoading: latestLoading } = useLatestPosts(10);
  const { data: categories } = useCategories();

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
    views: post.views || 0,
    isFeatured: post.is_featured,
    isBreaking: post.is_breaking
  });

  // Get first post for featured section
  const mainFeatured = featuredPost || latestPosts?.[0];
  // Get remaining posts for the grid
  const gridPosts = featuredPost 
    ? latestPosts?.slice(0, 4) 
    : latestPosts?.slice(1, 5);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Daily Our Times - সত্যের সন্ধানে</title>
        <meta name="description" content="বাংলাদেশের সবচেয়ে বিশ্বস্ত সংবাদ পোর্টাল। সর্বশেষ খবর, রাজনীতি, অর্থনীতি, খেলাধুলা এবং বিনোদন।" />
      </Helmet>

      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <BreakingNewsTicker />

      <main className="container py-4 md:py-6">
        {/* Featured News Section - Mobile First */}
        <section className="mb-6">
          {featuredLoading || latestLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-full aspect-[16/9] rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : mainFeatured ? (
            <NewsCard news={formatPostToNews(mainFeatured)} variant="large" />
          ) : (
            <div className="aspect-[16/9] bg-muted/50 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">কোনো নিউজ নেই</p>
            </div>
          )}
        </section>

        {/* Latest News Grid - 2 columns on mobile */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latestLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full aspect-[4/3] rounded" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : (
              gridPosts?.map((post) => (
                <NewsCard key={post.id} news={formatPostToNews(post)} variant="small" />
              ))
            )}
          </div>
        </section>

        {/* Main Content with Sidebar - Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {categories?.slice(0, 6).map((cat) => (
              <CategorySectionWrapper key={cat.id} category={cat} />
            ))}
          </div>
          <div className="lg:col-span-1 hidden lg:block">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Separate component to use hook for each category
const CategorySectionWrapper = ({ category }: { category: any }) => {
  const { data: posts } = usePostsByCategory(category.slug);

  if (!posts || posts.length === 0) return null;

  const formatPostToNews = (post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    subtitle: post.subtitle || undefined,
    content: post.content || "",
    excerpt: post.excerpt || "",
    category: post.category || category,
    author: post.author || { id: "", name: "" },
    publishedAt: post.published_at || "",
    imageUrl: post.featured_image || "",
    tags: post.tags || [],
    views: post.views || 0
  });

  return (
    <CategorySection
      title={category.name}
      slug={category.slug}
      news={posts.map(formatPostToNews)}
    />
  );
};

export default Index;
