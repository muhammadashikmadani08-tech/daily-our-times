import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BreakingNewsTicker } from "@/components/BreakingNewsTicker";
import { NewsCard } from "@/components/NewsCard";
import { Sidebar } from "@/components/Sidebar";
import { CategorySection } from "@/components/CategorySection";
import { getFeaturedNews, getLeadNews, getNewsByCategory } from "@/data/news";
import { categories } from "@/data/categories";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const { isDark, toggleTheme } = useTheme();
  const featuredNews = getFeaturedNews();
  const leadNews = getLeadNews(6);

  return (
    <div className="min-h-screen bg-background">
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <BreakingNewsTicker />

      <main className="container py-6">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {featuredNews && <NewsCard news={featuredNews} variant="large" />}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {leadNews.slice(0, 4).map((news) => (
              <NewsCard key={news.id} news={news} variant="small" />
            ))}
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-2">
            {categories.slice(0, 6).map((cat) => {
              const catNews = getNewsByCategory(cat.slug);
              if (catNews.length === 0) return null;
              return (
                <CategorySection
                  key={cat.id}
                  title={cat.name}
                  slug={cat.slug}
                  news={catNews}
                />
              );
            })}
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

export default Index;
