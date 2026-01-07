-- 1. Fix Site Settings Exposure - Only allow specific public settings
DROP POLICY IF EXISTS "Public settings are viewable by everyone" ON public.site_settings;

CREATE POLICY "Public settings are viewable by everyone" 
ON public.site_settings 
FOR SELECT 
USING (setting_key IN ('site_logo_url', 'site_url', 'site_name', 'site_description'));

-- 2. Fix User News Visibility - Only admins should see pending submissions
DROP POLICY IF EXISTS "Staff can view all submissions" ON public.user_news;

CREATE POLICY "Admin can view all submissions" 
ON public.user_news 
FOR SELECT 
USING (is_admin(auth.uid()));

-- 3. Fix Storage Anonymous Access - Remove anonymous access, only authenticated users
DROP POLICY IF EXISTS "Allow anonymous read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;

-- Ensure only authenticated users can access storage
CREATE POLICY "Authenticated users can view public media" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'media');

CREATE POLICY "Public can view media bucket" 
ON storage.objects 
FOR SELECT 
TO anon
USING (bucket_id = 'media' AND (storage.foldername(name))[1] = 'public');