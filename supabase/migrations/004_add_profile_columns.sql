-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 004: ADD PROFILE & SUPPORT COLUMNS
-- ========================================================================

-- 1. Add the missing columns to the settings table
ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS profile_photo TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS profile_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS profile_email TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS profile_phone TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS profile_designation TEXT DEFAULT '';

-- 2. Insert the initial settings row if the table is empty
INSERT INTO public.settings (website_name)
SELECT 'Flyen'
WHERE NOT EXISTS (SELECT 1 FROM public.settings);
