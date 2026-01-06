import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { usePosts, useCreatePost, useUpdatePost, useDeletePost, generateSlug } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Posts = () => {
  const { toast } = useToast();
  const { data: posts, isLoading } = usePosts();
  const { data: categories } = useCategories();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    content: "",
    excerpt: "",
    featured_image: "",
    image_caption: "",
    category_id: "",
    status: "draft" as "draft" | "published",
    is_featured: false,
    is_breaking: false,
    tags: "",
    seo_title: "",
    seo_description: ""
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      subtitle: "",
      content: "",
      excerpt: "",
      featured_image: "",
      image_caption: "",
      category_id: "",
      status: "draft",
      is_featured: false,
      is_breaking: false,
      tags: "",
      seo_title: "",
      seo_description: ""
    });
    setEditingPost(null);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      subtitle: post.subtitle || "",
      content: post.content || "",
      excerpt: post.excerpt || "",
      featured_image: post.featured_image || "",
      image_caption: post.image_caption || "",
      category_id: post.category_id || "",
      status: post.status || "draft",
      is_featured: post.is_featured || false,
      is_breaking: post.is_breaking || false,
      tags: post.tags?.join(", ") || "",
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || ""
    });
    setDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingPost ? formData.slug : generateSlug(title)
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({ title: "শিরোনাম দিন", variant: "destructive" });
      return;
    }

    const postData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      subtitle: formData.subtitle || null,
      content: formData.content || null,
      excerpt: formData.excerpt || null,
      featured_image: formData.featured_image || null,
      image_caption: formData.image_caption || null,
      category_id: formData.category_id || null,
      status: formData.status,
      is_featured: formData.is_featured,
      is_breaking: formData.is_breaking,
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
      seo_title: formData.seo_title || null,
      seo_description: formData.seo_description || null,
      published_at: formData.status === "published" ? new Date().toISOString() : null
    };

    try {
      if (editingPost) {
        await updatePost.mutateAsync({ id: editingPost.id, ...postData });
        toast({ title: "পোস্ট আপডেট হয়েছে" });
      } else {
        await createPost.mutateAsync(postData);
        toast({ title: "পোস্ট তৈরি হয়েছে" });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "এরর", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত?")) {
      try {
        await deletePost.mutateAsync(id);
        toast({ title: "পোস্ট মুছে ফেলা হয়েছে" });
      } catch (error: any) {
        toast({ title: "এরর", description: error.message, variant: "destructive" });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">পোস্ট ম্যানেজমেন্ট</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                নতুন পোস্ট
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? "পোস্ট এডিট" : "নতুন পোস্ট"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label>শিরোনাম *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="পোস্টের শিরোনাম"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>স্লাগ</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="url-slug"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>সাবটাইটেল</Label>
                    <Input
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="সাবটাইটেল"
                    />
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label>কনটেন্ট</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="পোস্টের কনটেন্ট (HTML সাপোর্টেড)"
                      rows={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>সারসংক্ষেপ</Label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="সারসংক্ষেপ"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ফিচার ইমেজ URL</Label>
                  <Input
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>ইমেজ ক্যাপশন</Label>
                  <Input
                    value={formData.image_caption}
                    onChange={(e) => setFormData({ ...formData, image_caption: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>ক্যাটাগরি</Label>
                  <Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="ক্যাটাগরি সিলেক্ট করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>স্ট্যাটাস</Label>
                  <Select value={formData.status} onValueChange={(v: "draft" | "published") => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">ড্রাফট</SelectItem>
                      <SelectItem value="published">প্রকাশিত</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>ট্যাগস (কমা দিয়ে আলাদা করুন)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="ট্যাগ১, ট্যাগ২, ট্যাগ৩"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_featured}
                      onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                    />
                    <Label>ফিচারড</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_breaking}
                      onCheckedChange={(v) => setFormData({ ...formData, is_breaking: v })}
                    />
                    <Label>ব্রেকিং</Label>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
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
                  <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    বাতিল
                  </Button>
                  <Button onClick={handleSubmit} disabled={createPost.isPending || updatePost.isPending}>
                    {(createPost.isPending || updatePost.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingPost ? "আপডেট" : "তৈরি করুন"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>শিরোনাম</TableHead>
                    <TableHead>ক্যাটাগরি</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead>ভিউ</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts?.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-xs">
                        <span className="line-clamp-1">{post.title}</span>
                      </TableCell>
                      <TableCell>
                        {(post.category as any)?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status === "published" ? "প্রকাশিত" : "ড্রাফট"}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.views || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/news/${post.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
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
      </div>
    </AdminLayout>
  );
};

export default Posts;
