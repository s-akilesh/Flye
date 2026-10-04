-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 037: MAKE MOBILE NUMBER AND SUBJECT OPTIONAL IN CONTACTS
-- ========================================================================

-- Allow mobile_number and subject to be NULL / empty string in contacts table
ALTER TABLE public.contacts ALTER COLUMN mobile_number DROP NOT NULL;
ALTER TABLE public.contacts ALTER COLUMN subject DROP NOT NULL;

ALTER TABLE public.contacts ALTER COLUMN mobile_number SET DEFAULT '';
ALTER TABLE public.contacts ALTER COLUMN subject SET DEFAULT '';
