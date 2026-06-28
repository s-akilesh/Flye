-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 007: ROLE-BASED STORAGE SECURITY REFACTOR
-- ========================================================================
-- This migration implements production-grade, role-based security policies
-- on storage.objects. It drops all legacy authenticated-user policies
-- and replaces them with strict checks against public.profiles.role.
-- ========================================================================

-- 1. Drop all legacy storage.objects policies to ensure a clean state
DROP POLICY IF EXISTS "Allow public read access on public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated insert on public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update on public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete on public buckets" ON storage.objects;

DROP POLICY IF EXISTS "Allow authenticated read access on private buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated insert on private buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update on private buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete on private buckets" ON storage.objects;

-- ========================================================================
-- SECTION 2: POLICIES FOR PUBLIC BUCKETS
-- Target Buckets: logos, favicons, profiles, website-assets, project-images, learning-images
-- ========================================================================

-- 2.1 SELECT: Anyone (anonymous and authenticated) can read public assets
CREATE POLICY "Allow public read access on public buckets" ON storage.objects
    FOR SELECT USING (
        bucket_id IN ('logos', 'favicons', 'profiles', 'website-assets', 'project-images', 'learning-images')
    );

-- 2.2 INSERT: Only administrators can upload public assets
CREATE POLICY "Allow admin insert on public buckets" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id IN ('logos', 'favicons', 'website-assets', 'project-images', 'learning-images')
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- 2.3 UPDATE: Only administrators can replace public assets
CREATE POLICY "Allow admin update on public buckets" ON storage.objects
    FOR UPDATE TO authenticated USING (
        bucket_id IN ('logos', 'favicons', 'website-assets', 'project-images', 'learning-images')
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    ) WITH CHECK (
        bucket_id IN ('logos', 'favicons', 'website-assets', 'project-images', 'learning-images')
    );

-- 2.4 DELETE: Only administrators can delete public assets
CREATE POLICY "Allow admin delete on public buckets" ON storage.objects
    FOR DELETE TO authenticated USING (
        bucket_id IN ('logos', 'favicons', 'website-assets', 'project-images', 'learning-images')
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- ========================================================================
-- SECTION 3: POLICIES FOR THE PROFILES BUCKET (USER-SPECIFIC ACCESS)
-- ========================================================================

-- 3.1 INSERT: Users can upload to their own folder; Admins can upload anywhere
CREATE POLICY "Allow authorized insert on profiles bucket" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'profiles'
        AND (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE public.profiles.id = auth.uid() 
                AND public.profiles.role IN ('admin', 'super_admin')
            )
            OR (
                name LIKE (auth.uid()::text || '/%')
            )
        )
    );

-- 3.2 UPDATE: Users can replace files in their own folder; Admins can update anywhere
CREATE POLICY "Allow authorized update on profiles bucket" ON storage.objects
    FOR UPDATE TO authenticated USING (
        bucket_id = 'profiles'
        AND (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE public.profiles.id = auth.uid() 
                AND public.profiles.role IN ('admin', 'super_admin')
            )
            OR (
                name LIKE (auth.uid()::text || '/%')
            )
        )
    ) WITH CHECK (
        bucket_id = 'profiles'
    );

-- 3.3 DELETE: Users can delete files in their own folder; Admins can delete anywhere
CREATE POLICY "Allow authorized delete on profiles bucket" ON storage.objects
    FOR DELETE TO authenticated USING (
        bucket_id = 'profiles'
        AND (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE public.profiles.id = auth.uid() 
                AND public.profiles.role IN ('admin', 'super_admin')
            )
            OR (
                name LIKE (auth.uid()::text || '/%')
            )
        )
    );

-- ========================================================================
-- SECTION 4: POLICIES FOR PRIVATE BUCKETS
-- Target Buckets: project-documents, project-videos, downloads, temporary
-- ========================================================================

-- 4.1 SELECT: Only authenticated users can read private assets
CREATE POLICY "Allow authenticated read on private buckets" ON storage.objects
    FOR SELECT TO authenticated USING (
        bucket_id IN ('project-documents', 'project-videos', 'downloads', 'temporary')
    );

-- 4.2 INSERT: Only administrators can upload private assets
CREATE POLICY "Allow admin insert on private buckets" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id IN ('project-documents', 'project-videos', 'downloads', 'temporary')
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- 4.3 UPDATE: Only administrators can replace private assets
CREATE POLICY "Allow admin update on private buckets" ON storage.objects
    FOR UPDATE TO authenticated USING (
        bucket_id IN ('project-documents', 'project-videos', 'downloads', 'temporary')
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    ) WITH CHECK (
        bucket_id IN ('project-documents', 'project-videos', 'downloads', 'temporary')
    );

-- 4.4 DELETE: Only administrators can delete private assets
CREATE POLICY "Allow admin delete on private buckets" ON storage.objects
    FOR DELETE TO authenticated USING (
        bucket_id IN ('project-documents', 'project-videos', 'downloads', 'temporary')
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );
