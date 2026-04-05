-- 10_notification_and_logging.sql
-- Notification and Activity Logging System

-- Hyper-Repair for existing tables
DO $$ 
BEGIN
    -- 1. Ensure id is PK
    BEGIN
        ALTER TABLE public.users ADD PRIMARY KEY (id);
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'id is likely already Primary Key';
    END;

    -- 2. Ensure wallet_address is Unique
    BEGIN
        ALTER TABLE public.users ADD CONSTRAINT users_wallet_unique UNIQUE(wallet_address);
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'wallet_address is likely already Unique';
    END;
END $$;

-- 1. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, 
-- 'nft_minted', 'job_offer', 'app_update'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread', -- 'read', 'unread'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL, -- 'profile_update', 'job_apply', 'config_change'
    entity_type TEXT, -- 'job', 'user', 'nft'
    entity_id UUID,
    description TEXT,
    tx_hash TEXT, -- Solana reference
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AI Logs Table
CREATE TABLE IF NOT EXISTS public.ai_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    model_name TEXT NOT NULL, -- 'gpt-4o', 'text-embedding-3'
    operation_type TEXT NOT NULL, -- 'resume_parser', 'job_matcher'
    input_summary TEXT,
    output_data JSONB,
    token_usage INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS Policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

-- Notifications: Users only see their own
CREATE POLICY select_own_notifications ON public.notifications 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY update_own_notifications ON public.notifications 
    FOR UPDATE USING (auth.uid() = user_id);

-- Activity Logs: Users see their own; Admins see all
CREATE POLICY select_activity_logs ON public.activity_logs 
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.staff_assignments sa 
            JOIN public.staff_roles sr ON sa.role_id = sr.id 
            WHERE sa.user_id = auth.uid() AND sr.role_name = 'admin'
        )
    );

-- AI Logs: Admin only
CREATE POLICY select_ai_logs ON public.ai_logs 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.staff_assignments sa 
            JOIN public.staff_roles sr ON sa.role_id = sr.id 
            WHERE sa.user_id = auth.uid() AND sr.role_name = 'admin'
        )
    );

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON public.ai_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_operation ON public.ai_logs(operation_type);
