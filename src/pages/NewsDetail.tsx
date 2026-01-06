import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { usePostBySlug, useLatestPosts } from "@/hooks/usePosts";
import { useTheme } from "@/hooks/useTheme";
import { NewsCard } from "@/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Eye, Share2, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isDark, toggleTheme } = useTheme();
  const { data: post, isLoading, error } = usePostBySlug(slug || "");
  const { data: latestPosts } = useLatestPosts(4);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title || "")}`, "_blank");
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(post?.title + " " + window.location.href)}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        <main className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-40 w-full" />
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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        <main className="container py-6">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">খবর পাওয়া যায়নি</h1>
            <p className="text-muted-foreground mb-6">আপনি যে খবরটি খুঁজছেন তা পাওয়া যায়নি।</p>
            <Link to="/">
              <Button>হোমে ফিরে যান</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const category = post.category as { name: string; slug: string } | null;
  const author = post.author as { name: string } | null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.seo_title || post.title} | Daily Our Times</title>
        <meta name="description" content={post.seo_description || post.excerpt || ""} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
      </Helmet>

      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            {/* Category Badge */}
            {category && (
              <Link to={`/category/${category.slug}`}>
                <Badge variant="secondary" className="mb-4 hover:bg-primary hover:text-primary-foreground">
                  {category.name}
                </Badge>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-serif font-bold leading-tight mb-4">
              {post.title}
            </h1>

            {/* Subtitle */}
            {post.subtitle && (
              <p className="text-xl text-muted-foreground mb-4">{post.subtitle}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-4 border-b border-border">
              {author && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {author.name}
                </span>
              )}
              {post.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.published_at)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views || 0} বার পড়া হয়েছে
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Share2 className="h-4 w-4" />
                শেয়ার করুন:
              </span>
              <Button variant="outline" size="sm" onClick={shareOnFacebook}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={shareOnTwitter}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={shareOnWhatsApp}>
                WhatsApp
              </Button>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <figure className="mb-6">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full rounded-lg"
                />
                {post.image_caption && (
                  <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                    {post.image_caption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Content */}
            <div 
              className="news-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-sm font-medium mb-3">ট্যাগসমূহ:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Related Posts */}
            {latestPosts && latestPosts.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-xl font-serif font-bold mb-4">আরও পড়ুন</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {latestPosts
                    .filter(p => p.slug !== slug)
                    .slice(0, 4)
                    .map((relatedPost) => (
                      <NewsCard 
                        key={relatedPost.id} 
                        news={{
                          id: relatedPost.id,
                          title: relatedPost.title,
                          subtitle: relatedPost.subtitle || undefined,
                          content: relatedPost.content || "",
                          excerpt: relatedPost.excerpt || "",
                          category: relatedPost.category as any,
                          author: relatedPost.author as any,
                          publishedAt: relatedPost.published_at || "",
                          imageUrl: relatedPost.featured_image || "",
                          tags: relatedPost.tags || [],
                          views: relatedPost.views || 0,
                          slug: relatedPost.slug
                        }} 
                        variant="small" 
                      />
                    ))}
                </div>
              </div>
            )}
          </article>

          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail;
