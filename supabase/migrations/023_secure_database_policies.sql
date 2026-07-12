-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 023: PRODUCTION DATABASE RLS HARDENING
-- ========================================================================
-- This migration implements production-grade Row Level Security (RLS) policies
-- across all database tables. It addresses key authorization vulnerabilities by
-- securing open write accesses and exposing public metadata (SEO/prerendering)
-- and user history correctly.
-- ========================================================================

-- ------------------------------------------------------------------------
-- SECTION 1: SETTINGS TABLE HARDENING
-- ------------------------------------------------------------------------
-- Drop legacy write policy allowing any authenticated user to edit global settings
DROP POLICY IF EXISTS "Allow write access for authenticated users" ON public.settings;

-- Create replacement policy restricting write operations to admin & super_admin
CREATE POLICY "Allow write access for administrators" ON public.settings
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );


-- ------------------------------------------------------------------------
-- SECTION 2: LEGAL PAGES TABLE HARDENING
-- ------------------------------------------------------------------------
-- Drop legacy write policy allowing any authenticated user to edit legal pages
DROP POLICY IF EXISTS "Allow admin full access to legal_pages" ON public.legal_pages;

-- Create replacement policy restricting write operations to admin & super_admin
CREATE POLICY "Allow admin full access to legal_pages" ON public.legal_pages
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );


-- ------------------------------------------------------------------------
-- SECTION 3: PROJECTS TABLE RLS AND SECURITY
-- ------------------------------------------------------------------------
-- Enable Row Level Security (RLS) on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects (necessary for marketplace catalog)
DROP POLICY IF EXISTS "Allow public read access on projects" ON public.projects;
CREATE POLICY "Allow public read access on projects" ON public.projects
    FOR SELECT USING (true);

-- Allow admins/super_admins full write/edit access
DROP POLICY IF EXISTS "Allow admin full access on projects" ON public.projects;
CREATE POLICY "Allow admin full access on projects" ON public.projects
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


-- ------------------------------------------------------------------------
-- SECTION 4: ENQUIRIES TABLE RLS AND SECURITY
-- ------------------------------------------------------------------------
-- Enable Row Level Security (RLS) on enquiries
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Allow public insert to enquiries (so guests/leads can submit orders)
DROP POLICY IF EXISTS "Allow public insert on enquiries" ON public.enquiries;
CREATE POLICY "Allow public insert on enquiries" ON public.enquiries
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view their own enquiries, and admins to view all
DROP POLICY IF EXISTS "Allow authorized select on enquiries" ON public.enquiries;
CREATE POLICY "Allow authorized select on enquiries" ON public.enquiries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
        OR (auth.uid() = user_id)
    );

-- Allow authenticated users to update their own enquiries (e.g. details edit), and admins to update all
DROP POLICY IF EXISTS "Allow authorized update on enquiries" ON public.enquiries;
CREATE POLICY "Allow authorized update on enquiries" ON public.enquiries
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
        OR (auth.uid() = user_id)
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
        OR (auth.uid() = user_id)
    );

-- Allow only administrators to delete enquiries
DROP POLICY IF EXISTS "Allow admin delete on enquiries" ON public.enquiries;
CREATE POLICY "Allow admin delete on enquiries" ON public.enquiries
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
    );


-- ------------------------------------------------------------------------
-- SECTION 5: ACTIVITY LOGS SELECT POLICIES
-- ------------------------------------------------------------------------
-- Allow authenticated users to select their own activity logs (for portal history page)
DROP POLICY IF EXISTS "Allow users select their own activity_logs" ON public.activity_logs;
CREATE POLICY "Allow users select their own activity_logs" ON public.activity_logs
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);


-- ------------------------------------------------------------------------
-- SECTION 6: PAGE SETTINGS (SEO METADATA) READ ACCESS SECURING
-- ------------------------------------------------------------------------
-- Drop the legacy page_settings read policy that restricted select queries to admins
DROP POLICY IF EXISTS "Allow admin read access on page_settings" ON public.page_settings;

-- Create replacement policy allowing anyone (including anonymous guests/crawlers) to read SEO tags
CREATE POLICY "Allow public read access on page_settings" ON public.page_settings
    FOR SELECT USING (true);
