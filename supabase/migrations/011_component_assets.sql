-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 011: COMPONENT ASSETS & PARTS TABLES
-- ========================================================================
-- This migration establishes the database schema for the Component Asset
-- Management System, supporting master SVG uploads, part linking, and
-- future AI-generated design assets.
-- ========================================================================

-- 1. Create component_assets table
CREATE TABLE IF NOT EXISTS public.component_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_slug TEXT NOT NULL,
    asset_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_asset_type CHECK (asset_type IN ('component', 'pinout', 'exploded', 'thumbnail', '3d_model', 'ar_model', 'datasheet', 'wiring_diagram', 'working_gif'))
);

-- Index for querying assets by component
CREATE INDEX IF NOT EXISTS idx_component_assets_slug ON public.component_assets(component_slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_component_assets_slug_type ON public.component_assets(component_slug, asset_type);

-- 2. Create component_parts table
CREATE TABLE IF NOT EXISTS public.component_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_slug TEXT NOT NULL,
    svg_layer_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    part_type TEXT, -- e.g. 'mcu', 'connector', 'sensor_module', 'passive_element'
    description TEXT,
    linked_component_slug TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    visual_config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for ordering and loading parts
CREATE INDEX IF NOT EXISTS idx_component_parts_slug ON public.component_parts(component_slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_component_parts_slug_layer ON public.component_parts(component_slug, svg_layer_id);

-- 3. Install triggers for updated_at
DROP TRIGGER IF EXISTS trigger_update_component_assets_timestamp ON public.component_assets;
CREATE TRIGGER trigger_update_component_assets_timestamp
    BEFORE UPDATE ON public.component_assets
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_component_parts_timestamp ON public.component_parts;
CREATE TRIGGER trigger_update_component_parts_timestamp
    BEFORE UPDATE ON public.component_parts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_update_timestamp();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.component_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_parts ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for component_assets

-- 5.1 SELECT: Anyone can view component asset metadata
DROP POLICY IF EXISTS "Allow public read access on component assets" ON public.component_assets;
CREATE POLICY "Allow public read access on component assets" ON public.component_assets
    FOR SELECT USING (true);

-- 5.2 INSERT: Only admin/super_admin can insert component assets
DROP POLICY IF EXISTS "Allow admin insert on component assets" ON public.component_assets;
CREATE POLICY "Allow admin insert on component assets" ON public.component_assets
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- 5.3 UPDATE: Only admin/super_admin can update component assets
DROP POLICY IF EXISTS "Allow admin update on component assets" ON public.component_assets;
CREATE POLICY "Allow admin update on component assets" ON public.component_assets
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- 5.4 DELETE: Only admin/super_admin can delete component assets
DROP POLICY IF EXISTS "Allow admin delete on component assets" ON public.component_assets;
CREATE POLICY "Allow admin delete on component assets" ON public.component_assets
    FOR DELETE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- 6. RLS Policies for component_parts

-- 6.1 SELECT: Anyone can view component parts
DROP POLICY IF EXISTS "Allow public read access on component parts" ON public.component_parts;
CREATE POLICY "Allow public read access on component parts" ON public.component_parts
    FOR SELECT USING (true);

-- 6.2 INSERT: Only admin/super_admin can insert component parts
DROP POLICY IF EXISTS "Allow admin insert on component parts" ON public.component_parts;
CREATE POLICY "Allow admin insert on component parts" ON public.component_parts
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- 6.3 UPDATE: Only admin/super_admin can update component parts
DROP POLICY IF EXISTS "Allow admin update on component parts" ON public.component_parts;
CREATE POLICY "Allow admin update on component parts" ON public.component_parts
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- 6.4 DELETE: Only admin/super_admin can delete component parts
DROP POLICY IF EXISTS "Allow admin delete on component parts" ON public.component_parts;
CREATE POLICY "Allow admin delete on component parts" ON public.component_parts
    FOR DELETE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- 7. Update Storage Security Policies for public buckets to include component-assets
DROP POLICY IF EXISTS "Allow public read access on public buckets" ON storage.objects;
CREATE POLICY "Allow public read access on public buckets" ON storage.objects
    FOR SELECT USING (
        bucket_id IN ('logos', 'favicons', 'profiles', 'website-assets', 'project-images', 'learning-images', 'component-assets')
    );

DROP POLICY IF EXISTS "Allow admin insert on public buckets" ON storage.objects;
CREATE POLICY "Allow admin insert on public buckets" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id IN ('logos', 'favicons', 'website-assets', 'project-images', 'learning-images', 'component-assets')
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Allow admin update on public buckets" ON storage.objects;
CREATE POLICY "Allow admin update on public buckets" ON storage.objects
    FOR UPDATE TO authenticated USING (
        bucket_id IN ('logos', 'favicons', 'website-assets', 'project-images', 'learning-images', 'component-assets')
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    ) WITH CHECK (
        bucket_id IN ('logos', 'favicons', 'website-assets', 'project-images', 'learning-images', 'component-assets')
    );

DROP POLICY IF EXISTS "Allow admin delete on public buckets" ON storage.objects;
CREATE POLICY "Allow admin delete on public buckets" ON storage.objects
    FOR DELETE TO authenticated USING (
        bucket_id IN ('logos', 'favicons', 'website-assets', 'project-images', 'learning-images', 'component-assets')
        AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- 8. Create component_build_videos table
CREATE TABLE IF NOT EXISTS public.component_build_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_slug TEXT NOT NULL UNIQUE,
    video_url TEXT NOT NULL,
    video_title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for component queries
CREATE INDEX IF NOT EXISTS idx_component_build_videos_slug ON public.component_build_videos(component_slug);

-- Update timestamp trigger
DROP TRIGGER IF EXISTS trigger_update_component_build_videos_timestamp ON public.component_build_videos;
CREATE TRIGGER trigger_update_component_build_videos_timestamp
    BEFORE UPDATE ON public.component_build_videos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_update_timestamp();

-- Enable RLS
ALTER TABLE public.component_build_videos ENABLE ROW LEVEL SECURITY;

-- SELECT policy: public access
DROP POLICY IF EXISTS "Allow public read access on build videos" ON public.component_build_videos;
CREATE POLICY "Allow public read access on build videos" ON public.component_build_videos
    FOR SELECT USING (true);

-- INSERT/UPDATE/DELETE policies: admin/super_admin only
DROP POLICY IF EXISTS "Allow admin insert on build videos" ON public.component_build_videos;
CREATE POLICY "Allow admin insert on build videos" ON public.component_build_videos
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Allow admin update on build videos" ON public.component_build_videos;
CREATE POLICY "Allow admin update on build videos" ON public.component_build_videos
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Allow admin delete on build videos" ON public.component_build_videos;
CREATE POLICY "Allow admin delete on build videos" ON public.component_build_videos
    FOR DELETE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );
