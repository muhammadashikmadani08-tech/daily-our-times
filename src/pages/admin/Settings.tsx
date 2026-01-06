import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteLogo, useUpdateSiteSetting } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

export default function Settings() {
  const { toast } = useToast();
  const { data: currentLogo, isLoading } = useSiteLogo();
  const updateSetting = useUpdateSiteSetting();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PNG only)
    if (!file.type.includes("png")) {
      toast({
        title: "অবৈধ ফাইল",
        description: "শুধুমাত্র PNG ফরম্যাট গ্রহণযোগ্য",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB for logos)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "ফাইল অনেক বড়",
        description: "লোগো ফাইল ২ এমবি এর কম হতে হবে",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = "png";
      const fileName = `site-logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      const logoUrl = urlData.publicUrl;

      // Save to site_settings
      await updateSetting.mutateAsync({
        key: "site_logo_url",
        value: logoUrl,
      });

      toast({
        title: "লোগো আপলোড সফল",
        description: "সাইট লোগো সফলভাবে আপডেট হয়েছে",
      });
    } catch (error: any) {
      toast({
        title: "আপলোড ব্যর্থ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await updateSetting.mutateAsync({
        key: "site_logo_url",
        value: null,
      });

      toast({
        title: "লোগো সরানো হয়েছে",
        description: "সাইট লোগো সফলভাবে সরানো হয়েছে",
      });
    } catch (error: any) {
      toast({
        title: "ত্রুটি",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold">সাইট সেটিংস</h1>
          <p className="text-muted-foreground">সাইট ব্র্যান্ডিং এবং সেটিংস পরিচালনা করুন</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              সাইট লোগো
            </CardTitle>
            <CardDescription>
              আপনার সাইটের লোগো আপলোড করুন। শুধুমাত্র PNG ফরম্যাট এবং স্বচ্ছ ব্যাকগ্রাউন্ড সমর্থিত।
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Logo Preview */}
            <div className="space-y-2">
              <Label>বর্তমান লোগো</Label>
              <div className="border border-dashed border-border rounded-lg p-4 bg-muted/30">
                {isLoading ? (
                  <div className="flex items-center justify-center h-24">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : currentLogo ? (
                  <div className="flex items-center gap-4">
                    <div className="bg-background p-2 rounded border">
                      <img
                        src={currentLogo}
                        alt="Site Logo"
                        className="h-16 max-w-[200px] object-contain"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveLogo}
                      disabled={updateSetting.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      সরান
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 text-muted-foreground">
                    <p>কোনো লোগো সেট করা হয়নি</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload New Logo */}
            <div className="space-y-2">
              <Label>নতুন লোগো আপলোড</Label>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      আপলোড হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      PNG লোগো আপলোড করুন
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                সর্বোচ্চ ফাইল সাইজ: ২ এমবি। স্বচ্ছ ব্যাকগ্রাউন্ড সহ PNG ফাইল ব্যবহার করুন।
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
