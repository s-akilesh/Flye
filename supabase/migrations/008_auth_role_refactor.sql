-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 008: AUTHORIZATION ROLE REFACTOR
-- ========================================================================
-- This migration standardizes the platform roles to:
-- * 'user' (replaces deprecated 'student' and 'teacher' authorization roles)
-- * 'admin'
-- * 'super_admin'
-- It updates defaults, migrates existing data, and installs new constraints.
-- ========================================================================

-- 1. Update the default value for the role column to 'user'
ALTER TABLE public.profiles 
    ALTER COLUMN role SET DEFAULT 'user';

-- 2. Drop the legacy check constraint if it exists
ALTER TABLE public.profiles 
    DROP CONSTRAINT IF EXISTS check_valid_role;

-- 3. Migrate existing legacy 'student' and 'teacher' roles to 'user'
UPDATE public.profiles 
    SET role = 'user' 
    WHERE role IN ('student', 'teacher');

-- 4. Install the new check constraint restricting roles to the new model
ALTER TABLE public.profiles 
    ADD CONSTRAINT check_valid_role CHECK (role IN ('user', 'admin', 'super_admin'));
