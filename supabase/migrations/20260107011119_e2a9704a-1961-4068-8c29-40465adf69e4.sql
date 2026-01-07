-- =====================================================
-- CRITICAL SECURITY FIX: Restrict email access to admin only
-- Create a separate view for admin-only profile data
-- =====================================================

-- Drop existing profile policies
DROP POLICY IF EXISTS "Authenticated users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Users can view ONLY their own profile (including email for account settings)
CREATE POLICY "Users view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- ADMIN ONLY can view all profiles (including emails)
-- Staff (moderators) should NOT see emails
CREATE POLICY "Admin can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (is_admin(auth.uid()));

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

-- Create a secure view for public profile data (name only, no email)
CREATE OR REPLACE VIEW public.public_profile_names AS
SELECT id, name
FROM public.profiles;

-- Grant access to authenticated users
GRANT SELECT ON public.public_profile_names TO authenticated;