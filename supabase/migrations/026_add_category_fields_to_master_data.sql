-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 026: ADD CATEGORY ENHANCEMENT FIELDS
-- ========================================================================
-- Adds image_url, show_in_home, and description to master_data
-- for dynamic category management across 3D printing and electronic projects.
-- ========================================================================

ALTER TABLE public.master_data 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS show_in_home BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Seed default image_url and show_in_home for existing 3D print categories
UPDATE public.master_data
SET image_url = '/cat_gifts.jpg', show_in_home = true, display_order = 10
WHERE type = '3d_print_category' AND (key = 'gifts' OR key = 'art-decor' OR key = 'prototypes' OR value ILIKE '%gift%' OR value ILIKE '%art%');

UPDATE public.master_data
SET image_url = '/cat_decor.jpg', show_in_home = true, display_order = 20
WHERE type = '3d_print_category' AND (key = 'decor' OR value ILIKE '%decor%' OR value ILIKE '%home%');

UPDATE public.master_data
SET image_url = '/cat_household.jpg', show_in_home = true, display_order = 30
WHERE type = '3d_print_category' AND (key = 'household' OR value ILIKE '%household%');

UPDATE public.master_data
SET image_url = '/cat_parts.jpg', show_in_home = true, display_order = 40
WHERE type = '3d_print_category' AND (key = 'parts' OR key = 'mechanical' OR value ILIKE '%part%' OR value ILIKE '%mechanical%');

-- Seed Electronic Project categories if not already present
INSERT INTO public.master_data (type, key, value, image_url, show_in_home, display_order, is_active)
VALUES
('project_category', 'robotics', 'Robotics & Development Kits', '/cat_robotics.jpg', true, 50, true),
('project_category', 'iot', 'IoT & Embedded Systems', '/cat_iot.jpg', true, 60, true),
('project_category', 'automation', 'Automation & Control', '/cat_robotics.jpg', false, 70, true),
('project_category', 'sensors', 'Sensors & Instrumentation', '/cat_iot.jpg', false, 80, true)
ON CONFLICT (type, key) DO UPDATE 
SET 
  image_url = COALESCE(EXCLUDED.image_url, master_data.image_url),
  show_in_home = EXCLUDED.show_in_home;
