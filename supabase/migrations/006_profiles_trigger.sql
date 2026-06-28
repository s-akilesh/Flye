-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 006: AUTOMATIC USER PROFILE TRIGGER
-- ========================================================================
-- This migration establishes a database trigger on auth.users to 
-- automatically create a corresponding public.profiles row upon signup,
-- resolving RLS issues when email verification is enabled.
-- ========================================================================

-- 1. Create the trigger function with SECURITY DEFINER to bypass RLS during signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user',
    'active',
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the trigger to the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill any existing auth users who might be missing a profile record
INSERT INTO public.profiles (id, email, role, status, email_verified)
SELECT id, email, 'user', 'active', false
FROM auth.users
ON CONFLICT (id) DO NOTHING;
