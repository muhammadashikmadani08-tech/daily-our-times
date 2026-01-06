import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAllUserNews, useUpdateUserNews, useDeleteUserNews, usePublishUserNews } from "@/hooks/useUserNews";
import { useGenerateAllPhotoCards } from "@/hooks/usePhotoCards";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Loader2, Eye, Check, Copy, X } from "lucide-react";
import { format } from "date-fns";

const UserNews = () => {
  const { toast } = useToast();
  const { data: submissions, isLoading } = useAllUserNews();
  const updateUserNews = useUpdateUserNews();
  const deleteUserNews = useDeleteUserNews();
  const publishUserNews = usePublishUserNews();
  const generateAllCards = useGenerateAllPhotoCards();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    content: "",
    excerpt: "",
    featured_image: "",
    image_caption: "",
    tags: "",
    seo_title: "",
    seo_description: ""
  });

  const handleView = (news: any) => {
    setSelectedNews(news);
    setViewDialogOpen(true);
  };

  const handleEdit = (news: any) => {
    setSelectedNews(news);
    setFormData({
      title: news.title,
      slug: news.slug,
      subtitle: news.subtitle || "",
      content: news.content || "",
      excerpt: news.excerpt || "",
      featured_image: news.featured_image || "",
      image_caption: news.image_caption || "",
      tags: news.tags?.join(", ") || "",
      seo_title: news.seo_title || "",
      seo_description: news.seo_description || ""
    });
    setDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedNews) return;

    try {
      await updateUserNews.mutateAsync({
        id: selectedNews.id,
        title: formData.title,
        slug: formData.slug,
        subtitle: formData.subtitle || null,
        content: formData.content || null,
        excerpt: formData.excerpt || null,
        featured_image: formData.featured_image || null,
        image_caption: formData.image_caption || null,
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null
      });
      toast({ title: "আপডেট সফল হয়েছে" });
      setDialogOpen(false);
    } catch (error: any) {
      toast({ title: "এরর", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত?")) {
      try {
        await deleteUserNews.mutateAsync(id);
        toast({ title: "মুছে ফেলা হয়েছে" });
      } catch (error: any) {
        toast({ title: "এরর", description: error.message, variant: "destructive" });
      }
    }
  };

  const handlePublish = async (news: any) => {
    if (confirm("এই নিউজটি প্রকাশ করতে চান?")) {
      try {
        const post = await publishUserNews.mutateAsync(news);
        toast({ title: "প্রকাশিত হয়েছে" });
        
        // Generate photo cards
        if (post?.id) {
          generateAllCards.mutate({ postId: post.id });
          toast({ title: "ফটো কার্ড তৈরি হচ্ছে..." });
        }
      } catch (error: any) {
        toast({ title: "এরর", description: error.message, variant: "destructive" });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">পেন্ডিং</Badge>;
      case "published":
        return <Badge className="bg-green-500">প্রকাশিত</Badge>;
      case "rejected":
        return <Badge variant="destructive">বাতিল</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ইউজার নিউজ</h1>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              </div>
            ) : submissions?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                কোনো সাবমিশন নেই
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ইমেজ</TableHead>
                    <TableHead>শিরোনাম</TableHead>
                    <TableHead>সাবমিটার</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions?.map((news: any) => (
                    <TableRow key={news.id}>
                      <TableCell>
                        {news.featured_image ? (
                          <img 
                            src={news.featured_image} 
                            alt="" 
                            className="w-16 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                            No img
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <span className="line-clamp-2">{news.title}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {news.profile?.email || news.user_id.slice(0, 8) + "..."}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(news.created_at), "dd/MM/yyyy")}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(news.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleView(news)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(news)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {news.status === "pending" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handlePublish(news)}
                              disabled={publishUserNews.isPending}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(news.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>নিউজ প্রিভিউ</DialogTitle>
            </DialogHeader>
            {selectedNews && (
              <div className="space-y-4">
                {selectedNews.featured_image && (
                  <img 
                    src={selectedNews.featured_image} 
                    alt="" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <h2 className="text-xl font-bold">{selectedNews.title}</h2>
                {selectedNews.subtitle && (
                  <p className="text-muted-foreground">{selectedNews.subtitle}</p>
                )}
                {selectedNews.excerpt && (
                  <p className="text-sm border-l-4 border-primary pl-4">{selectedNews.excerpt}</p>
                )}
                {selectedNews.content && (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedNews.content }} />
                )}
                {selectedNews.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedNews.tags.map((tag: string, i: number) => (
                      <Badge key={i} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    বন্ধ করুন
                  </Button>
                  {selectedNews.status === "pending" && (
                    <Button onClick={() => { setViewDialogOpen(false); handlePublish(selectedNews); }}>
                      <Check className="h-4 w-4 mr-2" />
                      প্রকাশ করুন
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>এডিট করুন</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>শিরোনাম</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>স্লাগ</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>সাবটাইটেল</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>কনটেন্ট</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>সারসংক্ষেপ</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>ফিচার ইমেজ URL</Label>
                <Input
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                />
                {formData.featured_image && (
                  <img src={formData.featured_image} alt="" className="w-full h-32 object-cover rounded mt-2" />
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>ইমেজ ক্যাপশন</Label>
                <Input
                  value={formData.image_caption}
                  onChange={(e) => setFormData({ ...formData, image_caption: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>ট্যাগস</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>SEO শিরোনাম</Label>
                <Input
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>SEO বর্ণনা</Label>
                <Textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  বাতিল
                </Button>
                <Button onClick={handleUpdate} disabled={updateUserNews.isPending}>
                  {updateUserNews.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  আপডেট
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default UserNews;
