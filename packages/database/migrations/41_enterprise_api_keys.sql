-- Migration 41: Enterprise API Keys & Developer Platform
-- Allows ATS platforms to securely verify candidates via Skillsutra.

CREATE TABLE IF NOT EXISTS public.enterprise_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    api_key_hash TEXT NOT NULL, -- SHA-256 Hash
    label TEXT NOT NULL, -- e.g. 'Greenhouse Integration'
    scopes JSONB DEFAULT '["read.proof_score", "read.skills"]',
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for lookup performance
CREATE INDEX IF NOT EXISTS idx_api_key_hash ON public.enterprise_api_keys(api_key_hash);

-- Security: Companies can only see their own keys
ALTER TABLE public.enterprise_api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Companies manage own API keys" ON public.enterprise_api_keys;
CREATE POLICY "Companies manage own API keys" 
ON public.enterprise_api_keys FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.company_members 
    WHERE company_id = enterprise_api_keys.company_id AND user_id = auth.uid()
));

COMMENT ON TABLE public.enterprise_api_keys IS 'Stores hashed API keys for external ATS integrations and enterprise consumers.';
