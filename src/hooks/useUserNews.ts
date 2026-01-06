import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type UserNews = Database["public"]["Tables"]["user_news"]["Row"];
type UserNewsInsert = Database["public"]["Tables"]["user_news"]["Insert"];
type UserNewsUpdate = Database["public"]["Tables"]["user_news"]["Update"];

// User's own submissions
export const useMySubmissions = () => {
  return useQuery({
    queryKey: ["user-news", "my"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_news")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

// All submissions for admin
export const useAllUserNews = () => {
  return useQuery({
    queryKey: ["user-news", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_news")
        .select(`
          *,
          profile:profiles!user_news_user_id_fkey(name, email)
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        // Fallback without join if foreign key doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("user_news")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      return data;
    }
  });
};

export const useCreateUserNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (news: UserNewsInsert) => {
      const { data, error } = await supabase
        .from("user_news")
        .insert(news)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-news"] });
    }
  });
};

export const useUpdateUserNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...news }: UserNewsUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("user_news")
        .update(news)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-news"] });
    }
  });
};

export const useDeleteUserNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("user_news")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-news"] });
    }
  });
};

// Publish user news to main posts
export const usePublishUserNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userNews: UserNews) => {
      // Create post from user news
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({
          title: userNews.title,
          slug: userNews.slug,
          subtitle: userNews.subtitle,
          content: userNews.content,
          excerpt: userNews.excerpt,
          featured_image: userNews.featured_image,
          image_caption: userNews.image_caption,
          tags: userNews.tags,
          seo_title: userNews.seo_title,
          seo_description: userNews.seo_description,
          status: "published",
          published_at: new Date().toISOString(),
          author_id: userNews.user_id
        })
        .select()
        .single();
      
      if (postError) throw postError;

      // Update user news status
      const { error: updateError } = await supabase
        .from("user_news")
        .update({ 
          status: "published",
          published_post_id: post.id
        })
        .eq("id", userNews.id);
      
      if (updateError) throw updateError;
      
      return post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-news"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  });
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim() + "-" + Date.now().toString(36);
};
