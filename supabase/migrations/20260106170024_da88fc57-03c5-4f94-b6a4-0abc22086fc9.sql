-- Create updated_at function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create user_news table for user submissions
CREATE TABLE public.user_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  subtitle TEXT,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  image_caption TEXT,
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  published_post_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_news ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
ON public.user_news
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own submissions"
ON public.user_news
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending submissions
CREATE POLICY "Users can update own pending submissions"
ON public.user_news
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Users can delete their own pending submissions
CREATE POLICY "Users can delete own pending submissions"
ON public.user_news
FOR DELETE
USING (auth.uid() = user_id AND status = 'pending');

-- Staff can view all submissions
CREATE POLICY "Staff can view all submissions"
ON public.user_news
FOR SELECT
USING (is_staff(auth.uid()));

-- Staff can manage all submissions
CREATE POLICY "Staff can manage all submissions"
ON public.user_news
FOR ALL
USING (is_staff(auth.uid()));

-- Create updated_at trigger
CREATE TRIGGER update_user_news_updated_at
BEFORE UPDATE ON public.user_news
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();