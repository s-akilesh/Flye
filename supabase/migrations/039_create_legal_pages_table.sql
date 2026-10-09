-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 039: CREATE LEGAL PAGES TABLE
-- ========================================================================
-- Creates legal_pages table with RLS for public read and authenticated write.
-- ========================================================================

CREATE TABLE IF NOT EXISTS public.legal_pages (
    id TEXT PRIMARY KEY,
    page_key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    version TEXT NOT NULL DEFAULT '1.0.0',
    published BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

-- Select policy: Allow public read access to published pages
DROP POLICY IF EXISTS "Allow public read of published pages" ON public.legal_pages;
CREATE POLICY "Allow public read of published pages"
ON public.legal_pages
FOR SELECT
TO public, authenticated
USING (published = true);

-- Allow authenticated users / admins full management access
DROP POLICY IF EXISTS "Allow admin full access to legal_pages" ON public.legal_pages;
CREATE POLICY "Allow admin full access to legal_pages"
ON public.legal_pages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert initial seed records
INSERT INTO public.legal_pages (id, page_key, title, content, version, published)
VALUES
  ('legal-privacy_policy', 'privacy_policy', 'Privacy Policy', '', '1.0.0', true),
  ('legal-terms_conditions', 'terms_conditions', 'Terms & Conditions', '', '1.0.0', true),
  ('legal-shipping_delivery', 'shipping_delivery', 'Shipping and Delivery', '', '1.0.0', true),
  ('legal-returns_cancellations', 'returns_cancellations', 'Returns and Cancellations', '', '1.0.0', true),
  ('legal-personalised_order_policy', 'personalised_order_policy', 'Personalised-Order Policy', '', '1.0.0', true),
  ('legal-custom_bulk_enquiries', 'custom_bulk_enquiries', 'Custom Printing and Bulk Enquiries', '', '1.0.0', true)
ON CONFLICT (page_key) DO NOTHING;
