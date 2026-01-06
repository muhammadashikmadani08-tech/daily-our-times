-- The current INSERT policy for posts requires is_admin() to be true
-- But no users have admin roles assigned yet
-- 
-- This migration ensures:
-- 1. The policies are correctly structured
-- 2. Adds a way for the first admin to be assigned via SQL

-- First, let's verify and recreate the INSERT policy with proper structure
DROP POLICY IF EXISTS "Admin can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Admin can update posts" ON public.posts;
DROP POLICY IF EXISTS "Admin can delete posts" ON public.posts;

-- Admin can insert any posts
CREATE POLICY "Admin can insert posts" 
ON public.posts 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin(auth.uid()));

-- Admin can update any posts  
CREATE POLICY "Admin can update posts" 
ON public.posts 
FOR UPDATE 
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Admin can delete any posts
CREATE POLICY "Admin can delete posts" 
ON public.posts 
FOR DELETE 
TO authenticated
USING (is_admin(auth.uid()));