-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 035: REGISTER LANDING SCREEN SLIDER ASSETS
-- ========================================================================
-- This migration registers the 5 landing screen slider images pointing to
-- Supabase Storage bucket 'website-assets' in folder 'landingscreen-slider'.
-- ========================================================================

-- Clear existing showcase rows
DELETE FROM public.master_data 
WHERE type = 'homepage_assets' 
  AND key NOT IN ('landing_screen_bg');

-- Insert 5 slider cards
INSERT INTO public.master_data (type, key, value, description, is_active, display_order)
VALUES 
(
    'homepage_assets',
    'slider_batch_production',
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/landingscreen-slider/svc_batch.jpg',
    'Precision 3D Batch Production',
    true,
    1
),
(
    'homepage_assets',
    'slider_robotics_rover',
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/landingscreen-slider/cat_robotics.jpg',
    'Autonomous Robotics Rover Kit',
    true,
    2
),
(
    'homepage_assets',
    'slider_iot_nodes',
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/landingscreen-slider/cat_iot.jpg',
    'Smart IoT Edge & Cloud Nodes',
    true,
    3
),
(
    'homepage_assets',
    'slider_enclosures_chassis',
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/landingscreen-slider/svc_enclosure.jpg',
    'Snap-Fit Enclosures & Chassis',
    true,
    4
),
(
    'homepage_assets',
    'slider_gifts_decor',
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/landingscreen-slider/cat_gifts.jpg',
    'Personalised Gifts & Home Décor',
    true,
    5
)
ON CONFLICT (type, key) DO UPDATE
SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    is_active = true,
    display_order = EXCLUDED.display_order,
    updated_at = timezone('utc'::text, now());
