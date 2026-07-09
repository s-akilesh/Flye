-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 015: CREATE CONTACTS TABLE
-- ========================================================================

DROP TABLE IF EXISTS public.contacts CASCADE;

CREATE TABLE IF NOT EXISTS public.contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT NOT NULL,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'in_progress', 'resolved', 'closed'
    internal_notes TEXT DEFAULT '',
    assigned_to TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 1. ALL ACTIONS: Allow authenticated admin and super_admin users
CREATE POLICY "Allow admin full access to contacts" ON public.contacts
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- 2. INSERT: Allow public submissions
CREATE POLICY "Allow public insert to contacts" ON public.contacts
    FOR INSERT WITH CHECK (true);
