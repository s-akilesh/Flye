-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 022: CREATE USER PREFERENCES TABLE
-- ========================================================================
-- This table stores individual configuration preferences for authenticated users.
-- Storing preferences here ensures cross-device synchronization.
-- ========================================================================

CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    notifications JSONB DEFAULT '{"email": true, "security": true, "contact": true, "browser": false, "push": false}'::jsonb NOT NULL,
    theme TEXT DEFAULT 'dark' NOT NULL,
    language TEXT DEFAULT 'en' NOT NULL,
    timezone TEXT DEFAULT 'UTC' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy: Authenticated users can read only their own preference details
CREATE POLICY "Allow users to read their own preferences" ON public.user_preferences
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- 2. INSERT Policy: Authenticated users can insert their own preference details
CREATE POLICY "Allow users to insert their own preferences" ON public.user_preferences
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE Policy: Authenticated users can update their own preference details
CREATE POLICY "Allow users to update their own preferences" ON public.user_preferences
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Trigger to automatically update updated_at timestamp
CREATE TRIGGER trigger_update_user_preferences_timestamp
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_update_timestamp();
