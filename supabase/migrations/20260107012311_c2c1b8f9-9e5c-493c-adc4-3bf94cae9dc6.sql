-- Fix storage bucket policies - require authentication for uploads
DROP POLICY IF EXISTS "Anyone can upload media files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update media files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete media files" ON storage.objects;

-- Only authenticated staff can upload media
CREATE POLICY "Staff can upload media files" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'media' AND is_staff(auth.uid()));

-- Only file owner or admin can update media
CREATE POLICY "Owner or admin can update media files" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'media' AND (auth.uid()::text = (storage.foldername(name))[1] OR is_admin(auth.uid())));

-- Only file owner or admin can delete media
CREATE POLICY "Owner or admin can delete media files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'media' AND (auth.uid()::text = (storage.foldername(name))[1] OR is_admin(auth.uid())));