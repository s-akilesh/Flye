-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 001: SETTINGS TABLE CREATION
-- ========================================================================

CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    website_name TEXT NOT NULL DEFAULT 'Flyen',
    website_tagline TEXT DEFAULT '',
    logo_url TEXT DEFAULT '',
    favicon_url TEXT DEFAULT '',
    address TEXT DEFAULT '',
    contact_email TEXT DEFAULT '',
    contact_phone TEXT DEFAULT '',
    instagram_url TEXT DEFAULT '',
    youtube_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    facebook_url TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    website_url TEXT DEFAULT '',
    footer_text TEXT DEFAULT '',
    copyright_text TEXT DEFAULT '',
    notification_email TEXT DEFAULT '',
    reply_to_email TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by TEXT
);
