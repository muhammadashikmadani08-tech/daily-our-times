-- Drop the view as it creates RLS confusion - use direct table access with proper policies instead
DROP VIEW IF EXISTS public.public_profile_names;

-- The profiles table already has proper RLS:
-- 1. Users can only view their own profile
-- 2. Only admins can view all profiles (moderators cannot)
-- This prevents email harvesting since non-admins can't query other users