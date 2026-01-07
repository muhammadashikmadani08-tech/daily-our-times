-- Fix: Only admins should view all profiles, not all staff
DROP POLICY IF EXISTS "Staff can view profiles for admin purposes" ON public.profiles;

CREATE POLICY "Admin can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin(auth.uid()));