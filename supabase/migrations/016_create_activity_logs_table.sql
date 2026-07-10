-- Create public.activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'WARNING', 'INFO')),
    severity TEXT NOT NULL CHECK (severity IN ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'CRITICAL')),
    source TEXT NOT NULL DEFAULT 'WEB' CHECK (source IN ('WEB', 'SYSTEM', 'API', 'CRON', 'EDGE_FUNCTION')),
    entity_type TEXT DEFAULT NULL,
    entity_id TEXT DEFAULT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    user_agent TEXT,
    session_id TEXT
);

-- Indexing for fast sorted querying
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_module ON public.activity_logs (module);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs (user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admin profiles to read logs
CREATE POLICY "Allow admins select access to activity_logs" ON public.activity_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Allow authenticated admin profiles to delete logs (for cleanup operation)
CREATE POLICY "Allow admins delete access to activity_logs" ON public.activity_logs
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Secure RPC Insertion Wrapper (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.log_activity_secure(
    p_module TEXT,
    p_action TEXT,
    p_description TEXT,
    p_status TEXT,
    p_severity TEXT,
    p_source TEXT DEFAULT 'WEB',
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_user_agent TEXT DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.activity_logs (
        user_id,
        module,
        action,
        description,
        status,
        severity,
        source,
        entity_type,
        entity_id,
        metadata,
        user_agent,
        session_id
    ) VALUES (
        auth.uid(),
        p_module,
        p_action,
        p_description,
        p_status,
        p_severity,
        p_source,
        p_entity_type,
        p_entity_id,
        p_metadata,
        p_user_agent,
        p_session_id
    );
END;
$$;

-- Secure RPC Deletion/Purge Wrapper (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.clean_activity_logs(p_retention_days INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INT;
BEGIN
    -- Verify caller is authenticated admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role IN ('admin', 'super_admin')
    ) THEN
        RAISE EXCEPTION 'Access Denied: Only administrators can prune activity logs.';
    END IF;

    DELETE FROM public.activity_logs
    WHERE created_at < (timezone('utc'::text, now()) - (p_retention_days || ' days')::INTERVAL);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;
