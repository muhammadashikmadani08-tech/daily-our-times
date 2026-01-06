-- ================================================
-- FIX CRITICAL SECURITY VULNERABILITIES
-- ================================================

-- 1. CREATE A VIEW FOR PUBLIC PROFILE DATA (without email)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT id, name, avatar_url, status, created_at
FROM public.profiles;

-- 2. FIX POSTS TABLE RLS POLICIES
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can update posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can delete posts" ON public.posts;

-- Staff can view all posts (including drafts)
CREATE POLICY "Staff can view all posts"
ON public.posts
FOR SELECT
USING (is_staff(auth.uid()));

-- Only admin can insert posts
CREATE POLICY "Admin can insert posts"
ON public.posts
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Only admin can update posts
CREATE POLICY "Admin can update posts"
ON public.posts
FOR UPDATE
USING (is_admin(auth.uid()));

-- Only admin can delete posts
CREATE POLICY "Admin can delete posts"
ON public.posts
FOR DELETE
USING (is_admin(auth.uid()));

-- 3. FIX SITE_SETTINGS TABLE RLS POLICIES
DROP POLICY IF EXISTS "Anyone can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can delete site settings" ON public.site_settings;

-- Only admin can insert site settings
CREATE POLICY "Admin can insert site settings"
ON public.site_settings
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Only admin can update site settings
CREATE POLICY "Admin can update site settings"
ON public.site_settings
FOR UPDATE
USING (is_admin(auth.uid()));

-- Only admin can delete site settings
CREATE POLICY "Admin can delete site settings"
ON public.site_settings
FOR DELETE
USING (is_admin(auth.uid()));

-- 4. FIX PHOTO_CARDS TABLE RLS POLICIES
DROP POLICY IF EXISTS "Anyone can insert photo cards" ON public.photo_cards;
DROP POLICY IF EXISTS "Anyone can update photo cards" ON public.photo_cards;
DROP POLICY IF EXISTS "Anyone can delete photo cards" ON public.photo_cards;

-- Only staff can insert photo cards
CREATE POLICY "Staff can insert photo cards"
ON public.photo_cards
FOR INSERT
WITH CHECK (is_staff(auth.uid()));

-- Only staff can update photo cards
CREATE POLICY "Staff can update photo cards"
ON public.photo_cards
FOR UPDATE
USING (is_staff(auth.uid()));

-- Only admin can delete photo cards
CREATE POLICY "Admin can delete photo cards"
ON public.photo_cards
FOR DELETE
USING (is_admin(auth.uid()));

-- 5. FIX PROFILES TABLE - Restrict email visibility
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Users can view their own full profile
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Staff can view all profiles (for admin panel)
CREATE POLICY "Staff can view all profiles"
ON public.profiles
FOR SELECT
USING (is_staff(auth.uid()));