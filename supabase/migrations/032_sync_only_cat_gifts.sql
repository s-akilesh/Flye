-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 032: SYNC ONLY EXISTING CAT_GIFTS SHOWCASE
-- ========================================================================
-- Deletes any missing showcase rows and keeps only cat_gifts.jpg
-- ========================================================================

DELETE FROM public.master_data 
WHERE type = 'homepage_assets' 
AND key NOT IN ('landing_screen_bg', 'showcase_gifts_decor');

-- Ensure showcase_gifts_decor is properly registered with cat_gifts.jpg
INSERT INTO public.master_data (type, key, value, description, is_active, display_order)
VALUES (
    'homepage_assets',
    'showcase_gifts_decor',
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/cat_gifts.jpg',
    'Personalised Gifts & Home Décor',
    true,
    1
)
ON CONFLICT (type, key) DO UPDATE
SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    is_active = true,
    display_order = 1,
    updated_at = timezone('utc'::text, now());
