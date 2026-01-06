import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { NewsCard } from "@/components/NewsCard";
import { useCategoryBySlug } from "@/hooks/useCategories";
import { usePostsByCategory } from "@/hooks/usePosts";
import { useTheme } from "@/hooks/useTheme";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isDark, toggleTheme } = useTheme();
  const { data: category, isLoading: categoryLoading } = useCategoryBySlug(slug || "");
  const { data: posts, isLoading: postsLoading } = usePostsByCategory(slug || "");

  if (categoryLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        <main className="container py-6">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        <main className="container py-6">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">ক্যাটাগরি পাওয়া যায়নি</h1>
            <p className="text-muted-foreground mb-6">আপনি যে ক্যাটাগরি খুঁজছেন তা পাওয়া যায়নি।</p>
            <Link to="/">
              <Button>হোমে ফিরে যান</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{category.name} | Daily Our Times</title>
        <meta name="description" content={`${category.name} সম্পর্কিত সর্বশেষ খবর - Daily Our Times`} />
      </Helmet>

      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main className="container py-6">
        {/* Category Header */}
        <div className="mb-8 pb-4 border-b-2 border-primary">
          <h1 className="text-3xl font-serif font-bold text-primary">{category.name}</h1>
          {category.name_en && (
            <p className="text-muted-foreground">{category.name_en}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <NewsCard
                    key={post.id}
                    news={{
                      id: post.id,
                      title: post.title,
                      subtitle: post.subtitle || undefined,
                      content: post.content || "",
                      excerpt: post.excerpt || "",
                      category: post.category as any,
                      author: post.author as any,
                      publishedAt: post.published_at || "",
                      imageUrl: post.featured_image || "",
                      tags: post.tags || [],
                      views: post.views || 0,
                      slug: post.slug
                    }}
                    variant="medium"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">এই ক্যাটাগরিতে এখনো কোনো খবর নেই।</p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Category;
