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
  const { data: latestPosts, isLoading: latestLoading } = useLatestPosts(6);
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

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Daily Our Times - সত্যের সন্ধানে</title>
        <meta name="description" content="বাংলাদেশের সবচেয়ে বিশ্বস্ত সংবাদ পোর্টাল। সর্বশেষ খবর, রাজনীতি, অর্থনীতি, খেলাধুলা এবং বিনোদন।" />
      </Helmet>

      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <BreakingNewsTicker />

      <main className="container py-6">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {featuredLoading ? (
              <Skeleton className="h-96 w-full rounded-lg" />
            ) : featuredPost ? (
              <NewsCard news={formatPostToNews(featuredPost)} variant="large" />
            ) : latestPosts?.[0] ? (
              <NewsCard news={formatPostToNews(latestPosts[0])} variant="large" />
            ) : (
              <div className="h-96 bg-muted/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">কোনো ফিচার নিউজ নেই</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {latestLoading ? (
              [1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))
            ) : (
              latestPosts?.slice(1, 5).map((post) => (
                <NewsCard key={post.id} news={formatPostToNews(post)} variant="small" />
              ))
            )}
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-2">
            {categories?.slice(0, 6).map((cat) => (
              <CategorySectionWrapper key={cat.id} category={cat} />
            ))}
          </div>
          <div className="lg:col-span-1">
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
