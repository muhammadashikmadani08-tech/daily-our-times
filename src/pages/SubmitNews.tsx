import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateUserNews, generateSlug } from "@/hooks/useUserNews";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SubmitNews = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createUserNews = useCreateUserNews();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
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

  // Check email verification
  const isEmailVerified = user?.email_confirmed_at != null;

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "শুধুমাত্র ইমেজ ফাইল আপলোড করুন", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "ফাইল সাইজ ৫MB এর কম হতে হবে", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `user-submissions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setFormData({ ...formData, featured_image: publicUrl });
      toast({ title: "ইমেজ আপলোড সফল হয়েছে" });
    } catch (error: any) {
      toast({ title: "আপলোড এরর", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "লগইন করুন", variant: "destructive" });
      return;
    }

    if (!isEmailVerified) {
      toast({ title: "ইমেইল ভেরিফাই করুন", variant: "destructive" });
      return;
    }

    if (!formData.title.trim()) {
      toast({ title: "শিরোনাম দিন", variant: "destructive" });
      return;
    }

    try {
      await createUserNews.mutateAsync({
        user_id: user.id,
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        subtitle: formData.subtitle || null,
        content: formData.content || null,
        excerpt: formData.excerpt || null,
        featured_image: formData.featured_image || null,
        image_caption: formData.image_caption || null,
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        status: "pending"
      });
      
      toast({ 
        title: "সফল!", 
        description: "আপনার নিউজ জমা হয়েছে। এডমিন রিভিউ করার পর প্রকাশিত হবে।" 
      });
      navigate("/");
    } catch (error: any) {
      toast({ title: "এরর", description: error.message, variant: "destructive" });
    }
  };

  if (authLoading) {
    return (
      <div className={isDark ? "dark" : ""}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className={isDark ? "dark" : ""}>
        <div className="min-h-screen bg-background">
          <Header isDark={isDark} toggleTheme={toggleTheme} />
          <main className="container py-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>নিউজ জমা দিন</CardTitle>
                <CardDescription>নিউজ জমা দিতে লগইন করুন</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>লগইন প্রয়োজন</AlertTitle>
                  <AlertDescription>
                    নিউজ জমা দিতে প্রথমে আপনার একাউন্টে লগইন করুন।
                  </AlertDescription>
                </Alert>
                <Button className="mt-4" onClick={() => navigate("/auth")}>
                  লগইন করুন
                </Button>
              </CardContent>
            </Card>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  // Email not verified
  if (!isEmailVerified) {
    return (
      <div className={isDark ? "dark" : ""}>
        <div className="min-h-screen bg-background">
          <Header isDark={isDark} toggleTheme={toggleTheme} />
          <main className="container py-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>নিউজ জমা দিন</CardTitle>
                <CardDescription>ইমেইল ভেরিফিকেশন প্রয়োজন</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>ইমেইল ভেরিফাই করুন</AlertTitle>
                  <AlertDescription>
                    নিউজ জমা দিতে প্রথমে আপনার ইমেইল ভেরিফাই করুন। আপনার ইমেইলে পাঠানো লিংকে ক্লিক করুন।
                  </AlertDescription>
                </Alert>
                <p className="mt-4 text-sm text-muted-foreground">
                  ইমেইল: {user.email}
                </p>
              </CardContent>
            </Card>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        
        <main className="container py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>নিউজ জমা দিন</CardTitle>
              <CardDescription>
                আপনার নিউজ সাবমিট করুন। এডমিন রিভিউ করার পর প্রকাশিত হবে।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>ইমেইল ভেরিফাইড</AlertTitle>
                <AlertDescription>
                  আপনি নিউজ জমা দিতে পারবেন। ({user.email})
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>শিরোনাম *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="নিউজের শিরোনাম"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>স্লাগ</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="url-slug"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>সাবটাইটেল</Label>
                    <Input
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="সাবটাইটেল"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>কনটেন্ট</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="নিউজের বিস্তারিত"
                      rows={10}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>সারসংক্ষেপ</Label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="সারসংক্ষেপ"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>ফিচার ইমেজ</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.featured_image}
                        onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                        placeholder="https://... অথবা আপলোড করুন"
                        className="flex-1"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            আপলোড
                          </>
                        )}
                      </Button>
                    </div>
                    {formData.featured_image && (
                      <div className="mt-2 relative rounded-lg overflow-hidden border bg-muted">
                        <img
                          src={formData.featured_image}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>ইমেজ ক্যাপশন</Label>
                    <Input
                      value={formData.image_caption}
                      onChange={(e) => setFormData({ ...formData, image_caption: e.target.value })}
                      placeholder="ইমেজের ক্যাপশন"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>ট্যাগস (কমা দিয়ে আলাদা করুন)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="ট্যাগ১, ট্যাগ২, ট্যাগ৩"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>SEO শিরোনাম</Label>
                    <Input
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      placeholder="সার্চ ইঞ্জিনের জন্য শিরোনাম"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>SEO বর্ণনা</Label>
                    <Textarea
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      placeholder="সার্চ ইঞ্জিনের জন্য বর্ণনা"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate("/")}>
                    বাতিল
                  </Button>
                  <Button type="submit" disabled={createUserNews.isPending}>
                    {createUserNews.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    জমা দিন
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default SubmitNews;
