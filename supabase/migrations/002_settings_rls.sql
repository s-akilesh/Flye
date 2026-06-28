-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 002: SETTINGS TABLE RLS POLICIES
-- ========================================================================

-- Enable Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Allow everyone (anonymous guests / students) to read settings
CREATE POLICY "Allow public read access on settings" ON public.settings
    FOR SELECT USING (true);

-- 2. ALL: Allow authenticated users (administrators) to perform all write operations
-- TODO: Restrict upload/update/delete permissions to administrators after introducing role-based authentication.
CREATE POLICY "Allow write access for authenticated users" ON public.settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
