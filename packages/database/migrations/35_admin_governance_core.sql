-- 35_admin_governance_core.sql
-- Solidifies Staff Permissions, Subscriptions, and Audits for the 24-Module Admin Console

-- 0. Ensure UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Fine-Grained Staff Roles & Permissions (extends base RBAC)
-- Dropping and recreating to ensure column parity with the 24-module architecture
DROP TABLE IF EXISTS public.staff_roles_master CASCADE;
CREATE TABLE public.staff_roles_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL, -- e.g., 'Senior Moderator', 'Support Agent'
    permissions JSONB NOT NULL DEFAULT '[]', -- e.g., '["view_users", "flag_job", "resolve_report"]'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Explicitly handle UNIQUE constraint
ALTER TABLE public.staff_roles_master ADD CONSTRAINT staff_roles_master_label_key UNIQUE (label);

-- Seed standard staff permission sets
-- Using NEXTVAL or explicit DEFAULT to ensure ID is populated
INSERT INTO public.staff_roles_master (id, label, permissions) VALUES 
(uuid_generate_v4(), 'Super Admin', '["*"]'),
(uuid_generate_v4(), 'Moderator', '["view_users", "flag_user", "view_jobs", "flag_job", "view_reports", "resolve_report"]'),
(uuid_generate_v4(), 'Support Staff', '["view_users", "view_tickets", "resolve_ticket"]')
ON CONFLICT (label) DO NOTHING;


-- 2. Staff Wallet Assignments (Maps wallet -> staff_role_master)
CREATE TABLE IF NOT EXISTS public.staff_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_wallet TEXT NOT NULL,
    role_id UUID REFERENCES public.staff_roles_master(id) ON DELETE CASCADE,
    granted_by TEXT, -- Wallet of the admin who granted this
    is_active BOOLEAN DEFAULT TRUE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(staff_wallet, role_id)
);

-- 3. Advanced Immutable Audit Logging (Module 13 & 21)
-- Upgrades staff_action_logs to handle robust metadata payloads
CREATE TABLE IF NOT EXISTS public.staff_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_wallet TEXT NOT NULL,
    action TEXT NOT NULL, -- e.g., 'flag_skill_nft', 'suspend_user'
    target_type TEXT NOT NULL, -- e.g., 'user', 'job', 'nft'
    target_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Subscription Plans (Module 15)
CREATE TABLE IF NOT EXISTS public.platform_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier_name TEXT NOT NULL,
    monthly_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    ai_match_limit INTEGER DEFAULT 50, -- -1 for unlimited
    job_post_limit INTEGER DEFAULT 1,
    seat_limit INTEGER DEFAULT 1,
    features JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Explicitly handle UNIQUE constraint to avoid ON CONFLICT errors
ALTER TABLE public.platform_subscriptions DROP CONSTRAINT IF EXISTS platform_subscriptions_tier_name_key;
ALTER TABLE public.platform_subscriptions ADD CONSTRAINT platform_subscriptions_tier_name_key UNIQUE (tier_name);

-- Seed SaaS Tiers
INSERT INTO public.platform_subscriptions (tier_name, monthly_price, ai_match_limit, job_post_limit, seat_limit, features) VALUES
('Free', 0.00, 50, 1, 1, '{"analytics": false, "api_access": false}'),
('Pro', 49.00, 500, 10, 5, '{"analytics": true, "api_access": false}'),
('Enterprise', 299.00, -1, -1, -1, '{"analytics": true, "api_access": true}')
ON CONFLICT ON CONSTRAINT platform_subscriptions_tier_name_key DO NOTHING;

-- Map companies to subscriptions
CREATE TABLE IF NOT EXISTS public.company_subscriptions (
    company_id UUID PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.platform_subscriptions(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled')),
    current_period_end TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AI/NFT Skill Verification Moderation Queue
CREATE TABLE IF NOT EXISTS public.skill_verification_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nft_mint TEXT NOT NULL, -- Blockchain identifier or pending identifier
    candidate_wallet TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    flag_reason TEXT,
    flagged_by TEXT, -- staff wallet
    reviewed_by TEXT, -- staff wallet 
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup RLS
ALTER TABLE public.staff_roles_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_verification_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read platform_subscriptions" ON public.platform_subscriptions FOR SELECT USING (true);
CREATE POLICY "Companies read own subscriptions" ON public.company_subscriptions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.company_members WHERE company_id = company_subscriptions.company_id AND user_id = auth.uid())
);
-- Admin RLS handled server-side via JWT limits / Service keys for mutations.
