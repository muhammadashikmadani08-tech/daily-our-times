-- Allow users to read their own roles (fixes admin panel loading issue)
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);