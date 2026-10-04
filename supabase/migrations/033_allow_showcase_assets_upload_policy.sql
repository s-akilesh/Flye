-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 033: ALLOW SHOWCASE ASSETS UPLOAD & MASTER_DATA POLICIES
-- ========================================================================
-- This migration ensures that uploads to the 'website-assets' storage bucket
-- and modifications to 'homepage_assets' in the master_data table can be
-- performed cleanly without triggering Row-Level Security (RLS) violations.
-- ========================================================================

-- ------------------------------------------------------------------------
-- 1. STORAGE POLICIES FOR 'website-assets' BUCKET
-- ------------------------------------------------------------------------
-- Allow upload (INSERT) to 'website-assets'
DROP POLICY IF EXISTS "Allow upload to website-assets" ON storage.objects;
CREATE POLICY "Allow upload to website-assets" ON storage.objects
    FOR INSERT TO public
    WITH CHECK (bucket_id = 'website-assets');

-- Allow update / replace (UPDATE) in 'website-assets'
DROP POLICY IF EXISTS "Allow update on website-assets" ON storage.objects;
CREATE POLICY "Allow update on website-assets" ON storage.objects
    FOR UPDATE TO public
    USING (bucket_id = 'website-assets')
    WITH CHECK (bucket_id = 'website-assets');

-- Allow delete (DELETE) in 'website-assets'
DROP POLICY IF EXISTS "Allow delete on website-assets" ON storage.objects;
CREATE POLICY "Allow delete on website-assets" ON storage.objects
    FOR DELETE TO public
    USING (bucket_id = 'website-assets');


-- ------------------------------------------------------------------------
-- 2. MASTER_DATA POLICIES FOR 'homepage_assets'
-- ------------------------------------------------------------------------
-- Allow INSERT of homepage_assets records
DROP POLICY IF EXISTS "Allow insert to homepage_assets in master_data" ON public.master_data;
CREATE POLICY "Allow insert to homepage_assets in master_data" ON public.master_data
    FOR INSERT TO public
    WITH CHECK (type = 'homepage_assets');

-- Allow UPDATE of homepage_assets records
DROP POLICY IF EXISTS "Allow update to homepage_assets in master_data" ON public.master_data;
CREATE POLICY "Allow update to homepage_assets in master_data" ON public.master_data
    FOR UPDATE TO public
    USING (type = 'homepage_assets')
    WITH CHECK (type = 'homepage_assets');

-- Allow DELETE of homepage_assets records
DROP POLICY IF EXISTS "Allow delete to homepage_assets in master_data" ON public.master_data;
CREATE POLICY "Allow delete to homepage_assets in master_data" ON public.master_data
    FOR DELETE TO public
    USING (type = 'homepage_assets');
