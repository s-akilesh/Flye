-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 020: CREATE PAGE SETTINGS TABLE
-- ========================================================================
-- This table stores page-specific SEO and Open Graph metadata configuration.
-- It supports both static page routes and dynamic entity type routes.
-- Access is restricted solely to authenticated administrator roles.
-- ========================================================================

CREATE TABLE IF NOT EXISTS public.page_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route TEXT UNIQUE NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    is_enabled BOOLEAN DEFAULT true NOT NULL,
    page_title VARCHAR(60),
    meta_description VARCHAR(160),
    keywords TEXT,
    canonical_url TEXT,
    robots_index BOOLEAN DEFAULT true NOT NULL,
    robots_follow BOOLEAN DEFAULT true NOT NULL,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by TEXT,
    updated_by TEXT
);

-- Enable Row Level Security
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;

-- Select access policy: Admins only
CREATE POLICY "Allow admin read access on page_settings" ON public.page_settings
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- Insert access policy: Admins only
CREATE POLICY "Allow admin insert access on page_settings" ON public.page_settings
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- Update access policy: Admins only
CREATE POLICY "Allow admin update access on page_settings" ON public.page_settings
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- Delete access policy: Admins only
CREATE POLICY "Allow admin delete access on page_settings" ON public.page_settings
    FOR DELETE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- Trigger to automatically track updated_at changes
DROP TRIGGER IF EXISTS trigger_update_page_settings_timestamp ON public.page_settings;
CREATE TRIGGER trigger_update_page_settings_timestamp
    BEFORE UPDATE ON public.page_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_update_timestamp();
