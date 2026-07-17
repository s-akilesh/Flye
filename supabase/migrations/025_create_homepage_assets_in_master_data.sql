-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 025: CREATE HOMEPAGE SHOWCASE ASSETS IN MASTER_DATA
-- ========================================================================

INSERT INTO public.master_data (type, key, value, is_active, display_order)
VALUES 
('homepage_assets', 'flyen_bot_image', '/flyen_bot.png', true, 0),
('homepage_assets', 'flyen_rc_rover_image', '/flyen_rc_rover.png', true, 0)
ON CONFLICT (type, key) DO NOTHING;
