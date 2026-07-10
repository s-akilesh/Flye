-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 017: LINK ACTIVITY LOGS TO PROFILES
-- ========================================================================
-- This migration adds a foreign key constraint from public.activity_logs
-- to public.profiles. This allows Supabase PostgREST select query joins
-- to resolve the user profile's full name.
-- ========================================================================

ALTER TABLE public.activity_logs
  ADD CONSTRAINT fk_activity_logs_profiles
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
