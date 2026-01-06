-- Drop existing RLS policies on posts table
DROP POLICY IF EXISTS "Authors can delete own posts, admins can delete all" ON public.posts;
DROP POLICY IF EXISTS "Authors can update own posts, admins can update all" ON public.posts;
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Staff can create posts" ON public.posts;

-- Create new permissive policies for public access
CREATE POLICY "Anyone can view published posts" 
ON public.posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Anyone can insert posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update posts" 
ON public.posts 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete posts" 
ON public.posts 
FOR DELETE 
USING (true);