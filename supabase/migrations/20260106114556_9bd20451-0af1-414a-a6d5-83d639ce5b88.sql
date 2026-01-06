-- Create photo_cards table for storing generated photo cards
CREATE TABLE public.photo_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  card_type TEXT NOT NULL CHECK (card_type IN ('facebook', 'link', 'story')),
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'generated', 'failed', 'downloaded')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, card_type)
);

-- Enable RLS
ALTER TABLE public.photo_cards ENABLE ROW LEVEL SECURITY;

-- RLS policies (admin access via secret URL, no auth)
CREATE POLICY "Anyone can view photo cards"
ON public.photo_cards
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert photo cards"
ON public.photo_cards
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update photo cards"
ON public.photo_cards
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete photo cards"
ON public.photo_cards
FOR DELETE
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_photo_cards_updated_at
  BEFORE UPDATE ON public.photo_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create index for faster lookups
CREATE INDEX idx_photo_cards_post_id ON public.photo_cards(post_id);
CREATE INDEX idx_photo_cards_status ON public.photo_cards(status);
CREATE INDEX idx_photo_cards_scheduled_at ON public.photo_cards(scheduled_at) WHERE scheduled_at IS NOT NULL;