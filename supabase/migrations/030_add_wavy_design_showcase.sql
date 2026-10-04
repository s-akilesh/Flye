-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 030: REGISTER WAVY DESIGN SHOWCASE ASSET IN MASTER DATA
-- ========================================================================

INSERT INTO public.master_data (type, key, value, is_active, display_order)
VALUES 
(
    'homepage_assets', 
    'showcase_wavy_design', 
    'https://hchzkykatpzaowkstglx.supabase.co/storage/v1/object/public/website-assets/showcase/wavy-black-white-background.jpg', 
    true, 
    6
)
ON CONFLICT (type, key) DO UPDATE 
SET 
    value = EXCLUDED.value, 
    is_active = true,
    updated_at = timezone('utc'::text, now());
