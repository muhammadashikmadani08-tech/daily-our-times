-- Fix the security definer view issue by using SECURITY INVOKER
DROP VIEW IF EXISTS public.public_profile_names;

-- Create view with SECURITY INVOKER (uses querying user's permissions)
CREATE VIEW public.public_profile_names 
WITH (security_invoker = true)
AS SELECT id, name FROM public.profiles;

-- Grant select to authenticated
GRANT SELECT ON public.public_profile_names TO authenticated;