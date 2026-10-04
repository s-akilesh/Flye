-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 036: RESTORE & FIX STORAGE RLS FOR WEBSITE-ASSETS
-- ========================================================================
-- Run this in Supabase SQL Editor to restore all permissions for:
-- 1. Storage bucket 'website-assets' (including landingscreen-slider)
-- 2. Database table 'master_data' (type = 'homepage_assets')
-- ========================================================================

-- 1. ENSURE 'website-assets' BUCKET EXISTS AND IS PUBLIC
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. DROP ALL EXISTING POLICIES ON 'website-assets' TO AVOID CONFLICTS
DROP POLICY IF EXISTS "Allow select on website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow insert on website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload to website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated select on website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated insert on website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update on website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete on website-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow all on website-assets" ON storage.objects;

-- 3. CREATE POLICIES FOR 'website-assets' STORAGE BUCKET
CREATE POLICY "Allow select on website-assets" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'website-assets');

CREATE POLICY "Allow insert on website-assets" ON storage.objects
    FOR INSERT TO public
    WITH CHECK (bucket_id = 'website-assets');

CREATE POLICY "Allow update on website-assets" ON storage.objects
    FOR UPDATE TO public
    USING (bucket_id = 'website-assets')
    WITH CHECK (bucket_id = 'website-assets');

CREATE POLICY "Allow delete on website-assets" ON storage.objects
    FOR DELETE TO public
    USING (bucket_id = 'website-assets');


-- 4. POLICIES FOR 'homepage_assets' IN MASTER_DATA TABLE
DROP POLICY IF EXISTS "Allow select homepage_assets in master_data" ON public.master_data;
DROP POLICY IF EXISTS "Allow insert to homepage_assets in master_data" ON public.master_data;
DROP POLICY IF EXISTS "Allow update to homepage_assets in master_data" ON public.master_data;
DROP POLICY IF EXISTS "Allow delete to homepage_assets in master_data" ON public.master_data;
DROP POLICY IF EXISTS "Allow all for homepage_assets in master_data" ON public.master_data;

CREATE POLICY "Allow select homepage_assets in master_data" ON public.master_data
    FOR SELECT TO public
    USING (type = 'homepage_assets');

CREATE POLICY "Allow insert to homepage_assets in master_data" ON public.master_data
    FOR INSERT TO public
    WITH CHECK (type = 'homepage_assets');

CREATE POLICY "Allow update to homepage_assets in master_data" ON public.master_data
    FOR UPDATE TO public
    USING (type = 'homepage_assets')
    WITH CHECK (type = 'homepage_assets');

CREATE POLICY "Allow delete to homepage_assets in master_data" ON public.master_data
    FOR DELETE TO public
    USING (type = 'homepage_assets');
