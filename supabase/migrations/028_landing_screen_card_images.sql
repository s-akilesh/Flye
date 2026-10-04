-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 028: LANDING SCREEN CARD IMAGES IN MASTER DATA & STORAGE
-- ========================================================================
-- Registers landing screen hero multi-card showcase assets and ensures
-- public bucket access for website-assets in Supabase Storage.
-- ========================================================================

-- 1. Insert or update landing screen hero showcase card images in master_data
INSERT INTO public.master_data (type, key, value, is_active, display_order)
VALUES 
(
    'homepage_assets', 
    'showcase_batch_production', 
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/svc_batch.jpg', 
    true, 
    1
),
(
    'homepage_assets', 
    'showcase_robotics_rover', 
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/cat_robotics.jpg', 
    true, 
    2
),
(
    'homepage_assets', 
    'showcase_iot_nodes', 
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/cat_iot.jpg', 
    true, 
    3
),
(
    'homepage_assets', 
    'showcase_enclosures_chassis', 
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/svc_enclosure.jpg', 
    true, 
    4
),
(
    'homepage_assets', 
    'showcase_gifts_decor', 
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/cat_gifts.jpg', 
    true, 
    5
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
