-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 005: USER PROFILES TABLE CREATION
-- ========================================================================
-- This migration implements the foundation of the Flyen User Identity System,
-- establishing a 1:1 relation to Supabase's auth.users table.
-- ========================================================================

-- 1. Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    institution TEXT,
    department TEXT,
    year_of_study TEXT,
    profile_photo TEXT, -- Stores only the storage path (e.g. 'profiles/admin/photo.jpg')
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'active',
    email_verified BOOLEAN NOT NULL DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.profile_photo IS 'Stores the relative path in Supabase Storage. Avoid storing full public URLs.';

-- 2. Add CHECK constraints for role and status
ALTER TABLE public.profiles
    ADD CONSTRAINT check_valid_role CHECK (role IN ('user', 'admin', 'super_admin')),
    ADD CONSTRAINT check_valid_status CHECK (status IN ('active', 'inactive', 'blocked'));

-- 3. Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- 4. Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION public.handle_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profiles_timestamp ON public.profiles;
CREATE TRIGGER trigger_update_profiles_timestamp
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_update_timestamp();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Define RLS Policies

-- 6.1 SELECT: Authenticated users can only read their own profile details
DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.profiles;
CREATE POLICY "Allow users to read their own profile" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

-- 6.2 INSERT: Users can create their profile only during signup (id must match their auth.uid())
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;
CREATE POLICY "Allow users to insert their own profile" ON public.profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 6.3 UPDATE: Users can only update their own profile details
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Note: DELETE is denied by default for everyone (except database superusers/admins)
-- since no DELETE policy is defined.
