-- ========================================================================
-- FLYEN PLATFORM - MIGRATION 021: CREATE NOTIFICATIONS TABLE
-- ========================================================================
-- This table stores high-priority notifications requiring admin attention.
-- It features strict RLS policies, custom indexing, and a SECURITY DEFINER
-- function to safely allow guest form triggers to log alerts without direct
-- table write permissions.
-- ========================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    priority TEXT NOT NULL,
    source TEXT NOT NULL,
    reference_type TEXT,
    reference_id TEXT,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by TEXT
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Read policy: Admins only
CREATE POLICY "Allow admin read access on notifications" ON public.notifications
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- Update policy: Admins only
CREATE POLICY "Allow admin update access on notifications" ON public.notifications
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- Delete policy: Admins only
CREATE POLICY "Allow admin delete access on notifications" ON public.notifications
    FOR DELETE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE public.profiles.id = auth.uid() 
            AND public.profiles.role IN ('admin', 'super_admin')
        )
    );

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);

-- SECURITY DEFINER RPC function for secure notification insertion
CREATE OR REPLACE FUNCTION public.create_notification_secure(
    p_title TEXT,
    p_message TEXT,
    p_type TEXT,
    p_priority TEXT,
    p_source TEXT,
    p_action_url TEXT,
    p_reference_type TEXT DEFAULT NULL,
    p_reference_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_new_id UUID;
    v_user_role TEXT;
BEGIN
    -- If the notification type is not public (like CONTACT_ENQUIRY or SYSTEM email failure),
    -- restrict it to authenticated administrators.
    IF p_type NOT IN ('CONTACT_ENQUIRY', 'SYSTEM') THEN
        SELECT role INTO v_user_role FROM public.profiles WHERE id = auth.uid();
        IF v_user_role NOT IN ('admin', 'super_admin') OR v_user_role IS NULL THEN
            RAISE EXCEPTION 'Unauthorized notification creation for this role.';
        END IF;
    END IF;

    INSERT INTO public.notifications (
        title,
        message,
        type,
        priority,
        source,
        action_url,
        reference_type,
        reference_id,
        created_by
    ) VALUES (
        p_title,
        p_message,
        p_type,
        p_priority,
        p_source,
        p_action_url,
        p_reference_type,
        p_reference_id,
        COALESCE(auth.jwt() ->> 'email', 'System/Guest')
    )
    RETURNING id INTO v_new_id;

    RETURN v_new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Realtime publication
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    END IF;
END $$;
