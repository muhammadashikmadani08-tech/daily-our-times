-- Fix 1: Make profiles table more secure - only allow users to see their own email
-- Drop the existing policies and recreate with proper restrictions
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Admin can view basic profile info but we'll use a restricted approach
CREATE POLICY "Staff can view profiles for admin purposes"
ON public.profiles
FOR SELECT
USING (is_staff(auth.uid()));

-- Fix 2: Restrict site_settings to staff only for most settings
-- Keep public read only for specific safe keys
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON public.site_settings;

CREATE POLICY "Public settings are viewable by everyone"
ON public.site_settings
FOR SELECT
USING (setting_key IN ('site_logo_url', 'site_url', 'site_name', 'site_description'));

CREATE POLICY "Staff can view all site settings"
ON public.site_settings
FOR SELECT
USING (is_staff(auth.uid()));

-- Fix 3: Restrict media table to proper access
DROP POLICY IF EXISTS "Authenticated users can view media" ON public.media;

-- Users can only view their own uploaded media OR media used in published posts
CREATE POLICY "Users can view own media"
ON public.media
FOR SELECT
USING (uploaded_by = auth.uid());

-- Staff can view all media for admin purposes
CREATE POLICY "Staff can view all media"
ON public.media
FOR SELECT
USING (is_staff(auth.uid()));

-- Public can view media that is used in published posts (featured images)
CREATE POLICY "Public can view published post media"
ON public.media
FOR SELECT
USING (
  file_url IN (
    SELECT featured_image FROM public.posts WHERE status = 'published' AND featured_image IS NOT NULL
  )
);