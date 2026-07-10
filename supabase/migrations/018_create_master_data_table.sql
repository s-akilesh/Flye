-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 018: CENTRALIZED MASTER DATA TABLE
-- ========================================================================
-- This migration implements the centralized master_data table to manage
-- all application lookup values (categories, chipsets, types, etc.) with
-- soft deactivation, unique constraints, and optimized index configurations.
-- ========================================================================

CREATE TABLE IF NOT EXISTS public.master_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_type_key UNIQUE (type, key)
);

-- Optimize queries using database indexes
CREATE INDEX IF NOT EXISTS idx_master_data_type ON public.master_data(type);
CREATE INDEX IF NOT EXISTS idx_master_data_type_active ON public.master_data(type, is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.master_data ENABLE ROW LEVEL SECURITY;

-- Select policy: Allow public read access to active and inactive entries
CREATE POLICY "Allow public read access to master_data" ON public.master_data
    FOR SELECT TO public, authenticated
    USING (true);

-- Access policy: Allow admins write operations
CREATE POLICY "Allow admins full access to master_data" ON public.master_data
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Trigger to automatically track updated_at changes
DROP TRIGGER IF EXISTS trigger_update_master_data_timestamp ON public.master_data;
CREATE TRIGGER trigger_update_master_data_timestamp
    BEFORE UPDATE ON public.master_data
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_update_timestamp();
