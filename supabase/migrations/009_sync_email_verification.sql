-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 009: SYNC EMAIL VERIFICATION FROM AUTH.USERS
-- ========================================================================
-- This migration updates the auth.users trigger to listen to both INSERT
-- and UPDATE events, ensuring that public.profiles.email_verified is
-- automatically set to true when a user verifies their email.
-- ========================================================================

-- 1. Create or replace the trigger function with UPDATE support
CREATE OR REPLACE FUNCTION public.handle_auth_user_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.profiles (id, email, full_name, role, status, email_verified)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      'user',
      'active',
      (NEW.email_confirmed_at IS NOT NULL)
    )
    ON CONFLICT (id) DO NOTHING;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.profiles
    SET 
      email = NEW.email,
      email_verified = (NEW.email_confirmed_at IS NOT NULL)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the old insert-only trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_changed ON auth.users;

-- 3. Bind the new trigger for both INSERT and UPDATE on auth.users
CREATE TRIGGER on_auth_user_changed
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_change();

-- 4. Retroactively update email_verified for all existing verified users
UPDATE public.profiles p
SET email_verified = true
FROM auth.users u
WHERE p.id = u.id AND u.email_confirmed_at IS NOT NULL;
