import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  created_at: string;
  updated_at: string;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;
      return data as SiteSetting[];
    },
  });
};

export const useSiteLogo = () => {
  return useQuery({
    queryKey: ["site-logo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "site_logo_url")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data?.setting_value || null;
    },
  });
};

export const useSiteUrl = () => {
  return useQuery({
    queryKey: ["site-url"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "site_url")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data?.setting_value || null;
    },
  });
};

export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string | null }) => {
      // Try to update first
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", key)
        .single();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: value })
          .eq("setting_key", key);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert({ setting_key: key, setting_value: value });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-logo"] });
      queryClient.invalidateQueries({ queryKey: ["site-url"] });
    },
  });
};
