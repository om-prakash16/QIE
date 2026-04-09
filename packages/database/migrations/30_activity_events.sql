-- 30_activity_events.sql
-- Structured event log for real-time activity tracking across all roles.

CREATE TABLE IF NOT EXISTS public.activity_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    actor_role TEXT NOT NULL DEFAULT 'user',
    event_type TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast lookups for role-scoped timelines and recent-activity queries.
CREATE INDEX IF NOT EXISTS idx_activity_events_actor
    ON public.activity_events(actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_events_type
    ON public.activity_events(event_type);

CREATE INDEX IF NOT EXISTS idx_activity_events_role
    ON public.activity_events(actor_role);

-- RLS: users see their own events, admins see everything.
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY activity_events_select ON public.activity_events
    FOR SELECT USING (
        actor_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.role_name = 'ADMIN'
        )
    );

CREATE POLICY activity_events_insert ON public.activity_events
    FOR INSERT WITH CHECK (true);
