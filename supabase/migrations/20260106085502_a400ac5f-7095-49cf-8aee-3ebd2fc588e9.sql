-- Drop existing restrictive storage policies for media bucket
DROP POLICY IF EXISTS "Staff can upload media files" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete own media files" ON storage.objects;

-- Create new permissive policies for media bucket (allowing anonymous access for admin via secret URL)
CREATE POLICY "Anyone can upload media files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Anyone can update media files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'media');

CREATE POLICY "Anyone can delete media files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'media');