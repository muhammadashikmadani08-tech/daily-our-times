-- =====================================================
-- CRITICAL SECURITY FIX: Secure user_news, profiles, and media tables
-- Deny-by-default approach with explicit authenticated-only policies
-- =====================================================

-- 1. DROP existing user_news policies and recreate with strict rules
DROP POLICY IF EXISTS "Users can view own submissions" ON public.user_news;
DROP POLICY IF EXISTS "Users can insert own submissions" ON public.user_news;
DROP POLICY IF EXISTS "Users can update own pending submissions" ON public.user_news;
DROP POLICY IF EXISTS "Users can delete own pending submissions" ON public.user_news;
DROP POLICY IF EXISTS "Staff can view all submissions" ON public.user_news;
DROP POLICY IF EXISTS "Staff can manage all submissions" ON public.user_news;

-- Authenticated users can SELECT only their own submissions
CREATE POLICY "Authenticated users can view own submissions" 
ON public.user_news 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Authenticated users can INSERT submissions (only for themselves)
CREATE POLICY "Authenticated users can insert submissions" 
ON public.user_news 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Regular users CANNOT update or delete - only admin/staff can manage
-- Staff (admin/moderator) can view ALL submissions
CREATE POLICY "Staff can view all submissions" 
ON public.user_news 
FOR SELECT 
TO authenticated
USING (is_staff(auth.uid()));

-- Only admin can update submissions (approve, reject, edit)
CREATE POLICY "Admin can update submissions" 
ON public.user_news 
FOR UPDATE 
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Only admin can delete submissions
CREATE POLICY "Admin can delete submissions" 
ON public.user_news 
FOR DELETE 
TO authenticated
USING (is_admin(auth.uid()));

-- 2. SECURE profiles table - ensure no anonymous access
DROP POLICY IF EXISTS "Users can view own full profile" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Authenticated users can view ONLY their own profile
CREATE POLICY "Authenticated users view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Staff can view all profiles (for admin panel)
CREATE POLICY "Staff can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (is_staff(auth.uid()));

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (via trigger)
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- 3. SECURE media table - restrict uploaded_by visibility
DROP POLICY IF EXISTS "Media is publicly viewable" ON public.media;
DROP POLICY IF EXISTS "Staff can upload media" ON public.media;
DROP POLICY IF EXISTS "Uploader or admin can delete media" ON public.media;

-- Media files (URLs) are public, but only authenticated users can see metadata
CREATE POLICY "Authenticated users can view media" 
ON public.media 
FOR SELECT 
TO authenticated
USING (true);

-- Staff can upload media
CREATE POLICY "Staff can upload media" 
ON public.media 
FOR INSERT 
TO authenticated
WITH CHECK (is_staff(auth.uid()));

-- Uploader or admin can delete media
CREATE POLICY "Uploader or admin can delete media" 
ON public.media 
FOR DELETE 
TO authenticated
USING ((uploaded_by = auth.uid()) OR is_admin(auth.uid()));