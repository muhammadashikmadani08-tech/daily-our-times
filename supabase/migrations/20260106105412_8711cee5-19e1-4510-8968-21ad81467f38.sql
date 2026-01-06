-- Create site_settings table for storing logo and other site configurations
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings (for displaying logo on homepage)
CREATE POLICY "Site settings are viewable by everyone" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Anyone can insert settings (admin access via secret URL, no auth)
CREATE POLICY "Anyone can insert site settings" 
ON public.site_settings 
FOR INSERT 
WITH CHECK (true);

-- Anyone can update settings (admin access via secret URL, no auth)
CREATE POLICY "Anyone can update site settings" 
ON public.site_settings 
FOR UPDATE 
USING (true);

-- Anyone can delete settings (admin access via secret URL, no auth)
CREATE POLICY "Anyone can delete site settings" 
ON public.site_settings 
FOR DELETE 
USING (true);

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert default site logo setting
INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES ('site_logo_url', NULL);

-- Add position column to categories if it doesn't have proper ordering
-- Already exists based on schema, so just ensure it's properly indexed
CREATE INDEX IF NOT EXISTS idx_categories_position ON public.categories(position);