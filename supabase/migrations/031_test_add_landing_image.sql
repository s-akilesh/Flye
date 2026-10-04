-- ========================================================================
-- TEST: INSERT A NEW LANDING SCREEN IMAGE DIRECTLY INTO DATABASE
-- ========================================================================
-- Run this in your Supabase SQL Editor to add a new showcase card.
-- It will immediately appear on the landing screen!
-- ========================================================================

INSERT INTO public.master_data (type, key, value, description, is_active, display_order)
VALUES (
    'homepage_assets',
    'showcase_test_prototype',
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/svc_enclosure.jpg',
    'High Precision Prototyping & Enclosures',
    true,
    5
)
ON CONFLICT (type, key) DO UPDATE
SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    is_active = true,
    updated_at = timezone('utc'::text, now());
