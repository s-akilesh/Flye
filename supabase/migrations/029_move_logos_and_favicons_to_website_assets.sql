-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 029: UNIFY LOGOS & FAVICONS INTO WEBSITE-ASSETS BUCKET
-- ========================================================================
-- Moves logos and favicons storage files into the website-assets bucket
-- and updates public.settings table URLs accordingly.
-- Uses WHERE NOT EXISTS to guarantee constraint-agnostic idempotence.
-- ========================================================================

-- 1. Copy existing logos from 'logos' bucket into 'website-assets/logos/'
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
SELECT 
    'website-assets' AS bucket_id,
    'logos/' || (regexp_match(s.name, '[^/]+$'))[1] AS name,
    s.owner,
    s.metadata
FROM storage.objects s
WHERE s.bucket_id = 'logos'
  AND NOT EXISTS (
      SELECT 1 FROM storage.objects t 
      WHERE t.bucket_id = 'website-assets' 
      AND t.name = 'logos/' || (regexp_match(s.name, '[^/]+$'))[1]
  );

-- 2. Copy existing favicons from 'favicons' bucket into 'website-assets/favicons/'
INSERT INTO storage.objects (bucket_id, name, owner, metadata)
SELECT 
    'website-assets' AS bucket_id,
    'favicons/' || (regexp_match(s.name, '[^/]+$'))[1] AS name,
    s.owner,
    s.metadata
FROM storage.objects s
WHERE s.bucket_id = 'favicons'
  AND NOT EXISTS (
      SELECT 1 FROM storage.objects t 
      WHERE t.bucket_id = 'website-assets' 
      AND t.name = 'favicons/' || (regexp_match(s.name, '[^/]+$'))[1]
  );

-- 3. Update public.settings table logo_url and favicon_url
UPDATE public.settings
SET 
    logo_url = REPLACE(REPLACE(logo_url, '/public/logos/website/', '/public/website-assets/logos/'), '/public/logos/', '/public/website-assets/logos/'),
    favicon_url = REPLACE(REPLACE(favicon_url, '/public/favicons/website/', '/public/website-assets/favicons/'), '/public/favicons/', '/public/website-assets/favicons/'),
    updated_at = timezone('utc'::text, now())
WHERE (logo_url LIKE '%/public/logos/%' OR favicon_url LIKE '%/public/favicons/%');

-- 4. Ensure website-assets public read policy is active
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow public read access on public buckets'
    ) THEN
        CREATE POLICY "Allow public read access on public buckets" ON storage.objects
            FOR SELECT USING (
                bucket_id IN ('logos', 'favicons', 'profiles', 'website-assets', 'project-images', 'learning-images', 'component-assets')
            );
    END IF;
END $$;
