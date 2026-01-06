import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { FileText, FolderTree, Eye, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const publishedPosts = posts?.filter(p => p.status === "published").length || 0;
  const draftPosts = posts?.filter(p => p.status === "draft").length || 0;
  const totalViews = posts?.reduce((acc, p) => acc + (p.views || 0), 0) || 0;

  const stats = [
    { 
      title: "মোট পোস্ট", 
      value: posts?.length || 0, 
      icon: FileText, 
      color: "bg-blue-500" 
    },
    { 
      title: "প্রকাশিত", 
      value: publishedPosts, 
      icon: TrendingUp, 
      color: "bg-green-500" 
    },
    { 
      title: "ড্রাফট", 
      value: draftPosts, 
      icon: FileText, 
      color: "bg-yellow-500" 
    },
    { 
      title: "মোট ভিউ", 
      value: totalViews, 
      icon: Eye, 
      color: "bg-purple-500" 
    },
    { 
      title: "ক্যাটাগরি", 
      value: categories?.length || 0, 
      icon: FolderTree, 
      color: "bg-orange-500" 
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">ড্যাশবোর্ড</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                {postsLoading || categoriesLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stat.value.toLocaleString("bn-BD")}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>সাম্প্রতিক পোস্ট</CardTitle>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-2">
                {posts.slice(0, 5).map(post => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium line-clamp-1">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.status === "published" ? "প্রকাশিত" : "ড্রাফট"}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {post.views || 0} ভিউ
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">কোনো পোস্ট নেই</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
