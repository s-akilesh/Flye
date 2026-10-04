-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 028: ADD LANDING SCREEN BG ASSET IN MASTER_DATA
-- ========================================================================
-- Stores the landing screen background asset pointing to Supabase Storage:
-- Bucket: website-assets
-- Path: landing-screen-image/landing_screen_bg.jpg
-- ========================================================================

-- 1. Ensure master_data contains the homepage landing screen background asset
INSERT INTO public.master_data (type, key, value, is_active, display_order)
VALUES 
(
    'homepage_assets', 
    'landing_screen_bg', 
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/landing-screen-image/landing_screen_bg.jpg', 
    true, 
    0
)
ON CONFLICT (type, key) DO UPDATE 
SET 
    value = EXCLUDED.value, 
    is_active = true,
    updated_at = timezone('utc'::text, now());

-- 2. Ensure website-assets public read policy is active on storage.objects
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow public read access on public buckets'
    ) THEN
        CREATE POLICY "Allow public read access on public buckets" ON storage.objects
            FOR SELECT USING (
                bucket_id IN ('logos', 'favicons', 'profiles', 'website-assets', 'project-images', 'learning-images', 'component-assets')
            );
    END IF;
END $$;
