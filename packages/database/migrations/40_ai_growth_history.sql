-- Migration 40: AI Score History & Growth Tracking
-- Enables time-series analysis of candidate reputation growth.

CREATE TABLE IF NOT EXISTS public.ai_score_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    proof_score FLOAT NOT NULL,
    skill_score FLOAT,
    project_score FLOAT,
    experience_score FLOAT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast time-series retrieval
CREATE INDEX IF NOT EXISTS idx_growth_user_date ON public.ai_score_history(user_id, recorded_at);

-- Security: Users can view their own growth data
ALTER TABLE public.ai_score_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own growth history" ON public.ai_score_history;
CREATE POLICY "Users can view own growth history" 
ON public.ai_score_history FOR SELECT 
USING (auth.uid() = user_id);

-- System can manage history
DROP POLICY IF EXISTS "System can manage score history" ON public.ai_score_history;
CREATE POLICY "System can manage score history" 
ON public.ai_score_history FOR ALL 
USING (true); -- Usually restricted by Service Key

COMMENT ON TABLE public.ai_score_history IS 'Stores historical snapshots of AI Proof Scores for growth tracking and analytics.';
