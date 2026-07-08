-- Create legal_pages table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.legal_pages (
    id text PRIMARY KEY,
    page_key text NOT NULL UNIQUE,
    title text NOT NULL,
    content text NOT NULL DEFAULT '',
    version text NOT NULL DEFAULT '1.0.0',
    published boolean NOT NULL DEFAULT false,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by text
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for published pages only)
CREATE POLICY "Allow public read of published pages"
ON public.legal_pages
FOR SELECT
USING (published = true);

-- Allow authenticated (Admin panel) operations full access
CREATE POLICY "Allow admin full access to legal_pages"
ON public.legal_pages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed initial default content for privacy_policy and terms_conditions
INSERT INTO public.legal_pages (id, page_key, title, content, version, published)
VALUES
  (
    'privacy-policy-default-id',
    'privacy_policy',
    'Privacy Policy',
    '<h2>1. Introduction</h2><p>Welcome to Flyen. We are committed to protecting your personal information and your right to privacy.</p><h2>2. Information We Collect</h2><p>We collect personal information that you voluntarily provide to us when you express interest in obtaining information about us or our products.</p>',
    '1.0.0',
    true
  ),
  (
    'terms-conditions-default-id',
    'terms_conditions',
    'Terms & Conditions',
    '<h2>1. Acceptance of Terms</h2><p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p><h2>2. Use License</h2><p>Permission is granted to temporarily download one copy of the materials on Flyen''s website for personal, non-commercial transitory viewing only.</p>',
    '1.0.0',
    true
  )
ON CONFLICT (page_key) DO NOTHING;
