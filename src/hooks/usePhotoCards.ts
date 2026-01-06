import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CardType = 'facebook' | 'link' | 'story';
export type CardStatus = 'pending' | 'generating' | 'generated' | 'failed' | 'downloaded';

export interface PhotoCard {
  id: string;
  post_id: string;
  card_type: CardType;
  image_url: string | null;
  status: CardStatus;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
}

export const usePhotoCards = (postId?: string) => {
  return useQuery({
    queryKey: ["photo_cards", postId],
    queryFn: async () => {
      let query = supabase
        .from("photo_cards")
        .select(`
          *,
          post:posts(id, title, slug, featured_image, is_breaking)
        `)
        .order("created_at", { ascending: false });
      
      if (postId) {
        query = query.eq("post_id", postId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
};

export const usePhotoCardsByPost = (postId: string) => {
  return useQuery({
    queryKey: ["photo_cards", "post", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("photo_cards")
        .select("*")
        .eq("post_id", postId)
        .order("card_type");
      
      if (error) throw error;
      return data as PhotoCard[];
    },
    enabled: !!postId
  });
};

export const useGeneratePhotoCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, cardType, scheduledAt }: { 
      postId: string; 
      cardType: CardType; 
      scheduledAt?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('generate-photo-card', {
        body: { postId, cardType, scheduledAt }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photo_cards"] });
    }
  });
};

export const useGenerateAllPhotoCards = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, scheduledAt }: { postId: string; scheduledAt?: string }) => {
      const cardTypes: CardType[] = ['facebook', 'link', 'story'];
      const results = [];
      
      for (const cardType of cardTypes) {
        const { data, error } = await supabase.functions.invoke('generate-photo-card', {
          body: { postId, cardType, scheduledAt }
        });
        
        if (error) throw error;
        results.push(data);
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photo_cards"] });
    }
  });
};

export const useUpdatePhotoCardStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CardStatus }) => {
      const { data, error } = await supabase
        .from("photo_cards")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photo_cards"] });
    }
  });
};

export const useDeletePhotoCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("photo_cards")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photo_cards"] });
    }
  });
};

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  facebook: 'Facebook / Instagram (1080x1080)',
  link: 'Link Preview (1200x630)',
  story: 'Story (1080x1920)'
};

export const CARD_STATUS_LABELS: Record<CardStatus, string> = {
  pending: 'অপেক্ষমাণ',
  generating: 'তৈরি হচ্ছে...',
  generated: 'তৈরি হয়েছে',
  failed: 'ব্যর্থ',
  downloaded: 'ডাউনলোড হয়েছে'
};
