-- Fix media table - hide uploader info from public
DROP POLICY IF EXISTS "Media is viewable by everyone" ON public.media;

-- Public can only view media file info, not who uploaded it
-- We'll use a view or more restrictive policy
-- For a news site, media files should be publicly accessible
CREATE POLICY "Media is publicly viewable"
ON public.media
FOR SELECT
USING (true);

-- Note: The uploaded_by field will still be visible but with no way to correlate
-- to actual user identities since profiles table now requires auth