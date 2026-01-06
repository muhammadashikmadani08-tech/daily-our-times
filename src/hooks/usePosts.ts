import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

export const usePosts = (status?: "draft" | "published") => {
  return useQuery({
    queryKey: ["posts", status],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          category:categories(*),
          author:profiles(*)
        `)
        .order("published_at", { ascending: false, nullsFirst: false });
      
      if (status) {
        query = query.eq("status", status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
};

export const usePublishedPosts = () => {
  return useQuery({
    queryKey: ["posts", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(*),
          author:profiles(*)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(*),
          author:profiles(*)
        `)
        .eq("slug", slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });
};

export const usePostsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ["posts", "category", categorySlug],
    queryFn: async () => {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();
      
      if (!category) return [];

      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(*),
          author:profiles(*)
        `)
        .eq("category_id", category.id)
        .eq("status", "published")
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!categorySlug
  });
};

export const useFeaturedPosts = () => {
  return useQuery({
    queryKey: ["posts", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(*),
          author:profiles(*)
        `)
        .eq("status", "published")
        .eq("is_featured", true)
        .order("published_at", { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data?.[0] || null;
    }
  });
};

export const useBreakingPosts = () => {
  return useQuery({
    queryKey: ["posts", "breaking"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug")
        .eq("status", "published")
        .eq("is_breaking", true)
        .order("published_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });
};

export const useLatestPosts = (limit = 10) => {
  return useQuery({
    queryKey: ["posts", "latest", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(*),
          author:profiles(*)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    }
  });
};

export const useMostReadPosts = (limit = 10) => {
  return useQuery({
    queryKey: ["posts", "most-read", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          category:categories(*),
          author:profiles(*)
        `)
        .eq("status", "published")
        .order("views", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    }
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: PostInsert) => {
      const { data, error } = await supabase
        .from("posts")
        .insert(post)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...post }: PostUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("posts")
        .update(post)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
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
    .trim();
};
