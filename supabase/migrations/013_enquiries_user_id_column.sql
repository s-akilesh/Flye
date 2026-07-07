-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 013: ENQUIRIES USER ID COLUMN FOR LINKING
-- ========================================================================
-- This migration adds a nullable user_id column referencing auth.users
-- to allow future account linking for authenticated users, along with
-- indexes to speed up lookups by user_id and mobile_number.
-- ========================================================================

-- 1. Add user_id column referencing auth.users if not exists
ALTER TABLE public.enquiries 
  ADD COLUMN IF NOT EXISTS user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Add performance index on user_id for My Enquiries lookup
CREATE INDEX IF NOT EXISTS idx_enquiries_user_id ON public.enquiries(user_id);

-- 3. Add performance index on mobile_number for future OTP account linking
CREATE INDEX IF NOT EXISTS idx_enquiries_mobile_number ON public.enquiries(mobile_number);
