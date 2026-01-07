import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  usePhotoCards, 
  useGeneratePhotoCard, 
  useGenerateAllPhotoCards,
  useUpdatePhotoCardStatus,
  CARD_TYPE_LABELS, 
  CARD_STATUS_LABELS,
  CardType
} from "@/hooks/usePhotoCards";
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/hooks/use-toast";
import { 
  Image, 
  Download, 
  Loader2, 
  RefreshCw, 
  Calendar,
  Facebook,
  Link as LinkIcon,
  Film,
  Package
} from "lucide-react";
import { format } from "date-fns";

const PhotoCards = () => {
  const { toast } = useToast();
  const { data: photoCards, isLoading, refetch } = usePhotoCards();
  const { data: posts } = usePosts("published");
  const generateCard = useGeneratePhotoCard();
  const generateAllCards = useGenerateAllPhotoCards();
  const updateStatus = useUpdatePhotoCardStatus();

  const [selectedPost, setSelectedPost] = useState<string>("");
  const [selectedCardType, setSelectedCardType] = useState<CardType>("facebook");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [previewCard, setPreviewCard] = useState<any>(null);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);

  const handleGenerateSingle = async () => {
    if (!selectedPost) {
      toast({ title: "পোস্ট সিলেক্ট করুন", variant: "destructive" });
      return;
    }

    const scheduledAt = scheduledDate && scheduledTime 
      ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString() 
      : undefined;

    try {
      await generateCard.mutateAsync({ 
        postId: selectedPost, 
        cardType: selectedCardType,
        scheduledAt
      });
      toast({ 
        title: scheduledAt ? "ফটো কার্ড শিডিউল হয়েছে" : "ফটো কার্ড তৈরি হচ্ছে" 
      });
      setGenerateDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "এরর", description: error.message, variant: "destructive" });
    }
  };

  const handleGenerateAll = async () => {
    if (!selectedPost) {
      toast({ title: "পোস্ট সিলেক্ট করুন", variant: "destructive" });
      return;
    }

    const scheduledAt = scheduledDate && scheduledTime 
      ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString() 
      : undefined;

    try {
      await generateAllCards.mutateAsync({ 
        postId: selectedPost,
        scheduledAt
      });
      toast({ 
        title: scheduledAt ? "সব ফটো কার্ড শিডিউল হয়েছে" : "সব ফটো কার্ড তৈরি হচ্ছে" 
      });
      setGenerateDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "এরর", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setSelectedPost("");
    setSelectedCardType("facebook");
    setScheduledDate("");
    setScheduledTime("");
  };

  const handleDownload = async (imageUrl: string, cardId: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      await updateStatus.mutateAsync({ id: cardId, status: 'downloaded' });
      toast({ title: "ডাউনলোড সফল" });
    } catch (error) {
      toast({ title: "ডাউনলোড এরর", variant: "destructive" });
    }
  };

  const handleDownloadAll = async (postId: string) => {
    const postCards = photoCards?.filter(c => c.post_id === postId && c.image_url);
    if (!postCards?.length) return;

    for (const card of postCards) {
      if (card.image_url) {
        await handleDownload(
          card.image_url, 
          card.id, 
          `${card.post?.slug || 'card'}-${card.card_type}.png`
        );
      }
    }
  };

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'link': return <LinkIcon className="h-4 w-4" />;
      case 'story': return <Film className="h-4 w-4" />;
      default: return <Image className="h-4 w-4" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'generated': return 'default';
      case 'downloaded': return 'secondary';
      case 'generating': return 'outline';
      case 'pending': return 'outline';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  // Group cards by post with proper typing
  interface GroupedCards {
    post: { id: string; title: string; slug: string; featured_image: string | null; is_breaking: boolean | null } | null;
    cards: typeof photoCards extends (infer T)[] ? T[] : never[];
  }
  
  const cardsByPost = photoCards?.reduce<Record<string, GroupedCards>>((acc, card) => {
    const postId = card.post_id;
    if (!acc[postId]) {
      acc[postId] = {
        post: (card as any).post ?? null,
        cards: []
      };
    }
    acc[postId].cards.push(card);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ফটো কার্ড ম্যানেজমেন্ট</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              রিফ্রেশ
            </Button>
            <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Image className="h-4 w-4 mr-2" />
                  নতুন ফটো কার্ড
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>ফটো কার্ড তৈরি করুন</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>পোস্ট সিলেক্ট করুন *</Label>
                    <Select value={selectedPost} onValueChange={setSelectedPost}>
                      <SelectTrigger>
                        <SelectValue placeholder="পোস্ট সিলেক্ট করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {posts?.map((post) => (
                          <SelectItem key={post.id} value={post.id}>
                            {post.title.substring(0, 50)}...
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>কার্ড টাইপ</Label>
                    <Select 
                      value={selectedCardType} 
                      onValueChange={(v) => setSelectedCardType(v as CardType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">
                          <div className="flex items-center gap-2">
                            <Facebook className="h-4 w-4" />
                            Facebook / Instagram (1080x1080)
                          </div>
                        </SelectItem>
                        <SelectItem value="link">
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            Link Preview (1200x630)
                          </div>
                        </SelectItem>
                        <SelectItem value="story">
                          <div className="flex items-center gap-2">
                            <Film className="h-4 w-4" />
                            Story (1080x1920)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      শিডিউল (ঐচ্ছিক)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      খালি রাখলে এখনই তৈরি হবে
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleGenerateSingle} 
                      disabled={generateCard.isPending || !selectedPost}
                      className="flex-1"
                    >
                      {generateCard.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      একটি তৈরি করুন
                    </Button>
                    <Button 
                      onClick={handleGenerateAll} 
                      disabled={generateAllCards.isPending || !selectedPost}
                      variant="secondary"
                      className="flex-1"
                    >
                      {generateAllCards.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Package className="h-4 w-4 mr-2" />
                      সব তৈরি করুন
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Preview Dialog */}
        <Dialog open={!!previewCard} onOpenChange={() => setPreviewCard(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {previewCard?.post?.title} - {CARD_TYPE_LABELS[previewCard?.card_type as CardType]}
              </DialogTitle>
            </DialogHeader>
            {previewCard?.image_url && (
              <div className="space-y-4">
                <div className="flex justify-center bg-muted rounded-lg p-4">
                  <img 
                    src={previewCard.image_url} 
                    alt="Photo Card Preview"
                    className="max-h-[60vh] object-contain rounded-lg shadow-lg"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => handleDownload(
                    previewCard.image_url,
                    previewCard.id,
                    `${previewCard.post?.slug || 'card'}-${previewCard.card_type}.png`
                  )}>
                    <Download className="h-4 w-4 mr-2" />
                    ডাউনলোড
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          </div>
        ) : cardsByPost && Object.keys(cardsByPost).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(cardsByPost).map(([postId, { post, cards }]) => (
              <Card key={postId}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg line-clamp-1">
                      {post?.title || 'Unknown Post'}
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadAll(postId)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      সব ডাউনলোড
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['facebook', 'link', 'story'] as CardType[]).map((type) => {
                      const card = cards.find(c => c.card_type === type);
                      return (
                        <div key={type} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getCardTypeIcon(type)}
                              <span className="font-medium text-sm">
                                {type === 'facebook' ? 'Facebook' : type === 'link' ? 'Link Preview' : 'Story'}
                              </span>
                            </div>
                            {card && (
                              <Badge variant={getStatusBadgeVariant(card.status)}>
                                {CARD_STATUS_LABELS[card.status as keyof typeof CARD_STATUS_LABELS]}
                              </Badge>
                            )}
                          </div>
                          
                          {card?.image_url ? (
                            <div 
                              className="relative cursor-pointer group"
                              onClick={() => setPreviewCard(card)}
                            >
                              <img 
                                src={card.image_url} 
                                alt={`${type} card`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm">প্রিভিউ দেখুন</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-muted-foreground text-sm">
                                {card?.status === 'generating' ? 'তৈরি হচ্ছে...' : 'তৈরি হয়নি'}
                              </span>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {card?.image_url ? (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => handleDownload(
                                  card.image_url!,
                                  card.id,
                                  `${post?.slug || 'card'}-${type}.png`
                                )}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                ডাউনলোড
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => {
                                  setSelectedPost(postId);
                                  setSelectedCardType(type);
                                  handleGenerateSingle();
                                }}
                                disabled={card?.status === 'generating' || generateCard.isPending}
                              >
                                {(card?.status === 'generating' || generateCard.isPending) ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <Image className="h-3 w-3 mr-1" />
                                )}
                                তৈরি করুন
                              </Button>
                            )}
                          </div>

                          {card?.scheduled_at && card.status === 'pending' && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(card.scheduled_at), 'dd/MM/yyyy HH:mm')}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>কোন ফটো কার্ড নেই</p>
              <p className="text-sm mt-2">উপরে "নতুন ফটো কার্ড" বাটনে ক্লিক করুন</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default PhotoCards;
