-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 034: DELETE HOMEPAGE SHOWCASE ASSETS FROM DB
-- ========================================================================
-- This script removes all homepage showcase asset records from master_data.
-- Note: Supabase storage objects are managed via Storage API or Dashboard.
-- ========================================================================

-- Delete all homepage asset records from the master_data table
DELETE FROM public.master_data 
WHERE type = 'homepage_assets';
