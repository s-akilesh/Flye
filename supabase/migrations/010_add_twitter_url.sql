-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 010: ADD TWITTER URL TO SETTINGS TABLE
-- ========================================================================

ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS twitter_url TEXT DEFAULT '';
