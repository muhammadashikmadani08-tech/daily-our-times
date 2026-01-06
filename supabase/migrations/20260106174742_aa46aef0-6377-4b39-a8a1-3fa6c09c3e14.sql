-- Drop the security definer view (not needed since RLS is now proper)
DROP VIEW IF EXISTS public.public_profiles;

-- Also fix photo_cards SELECT policy to be staff only
DROP POLICY IF EXISTS "Anyone can view photo cards" ON public.photo_cards;

CREATE POLICY "Staff can view photo cards"
ON public.photo_cards
FOR SELECT
USING (is_staff(auth.uid()));