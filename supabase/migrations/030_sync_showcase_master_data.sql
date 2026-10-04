-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 030: SYNCHRONIZE SHOWCASE ASSETS IN MASTER DATA
-- ========================================================================
-- Removes deleted showcase assets and registers active ones in master_data.
-- ========================================================================

-- 1. Remove deleted files from master_data
DELETE FROM public.master_data 
WHERE type = 'homepage_assets' 
AND key IN ('showcase_batch_production', 'showcase_iot_nodes', 'flyen_rc_rover_image');

-- 2. Upsert the current active showcase files
INSERT INTO public.master_data (type, key, value, is_active, display_order)
VALUES 
(
    'homepage_assets', 
    'showcase_robotics_rover', 
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/cat_robotics.jpg', 
    true, 
    1
),
(
    'homepage_assets', 
    'showcase_enclosures_chassis', 
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/svc_enclosure.jpg', 
    true, 
    2
),
(
    'homepage_assets', 
    'showcase_gifts_decor', 
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/cat_gifts.jpg', 
    true, 
    3
),
(
    'homepage_assets', 
    'showcase_wavy_design', 
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/wavy-black-white-background.jpg', 
    true, 
    4
)
ON CONFLICT (type, key) DO UPDATE 
SET 
    value = EXCLUDED.value, 
    is_active = true,
    display_order = EXCLUDED.display_order,
    updated_at = timezone('utc'::text, now());
