-- Create a function to assign role to a user (only callable by super_admin)
CREATE OR REPLACE FUNCTION public.assign_user_role(
  target_user_id uuid,
  target_role app_role
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is super_admin
  IF NOT has_role(auth.uid(), 'super_admin') THEN
    RAISE EXCEPTION 'Only super_admin can assign roles';
  END IF;
  
  -- Insert the role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, target_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.assign_user_role(uuid, app_role) TO authenticated;