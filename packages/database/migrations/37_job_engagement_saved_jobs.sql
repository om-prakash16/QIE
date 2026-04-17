-- Migration: 37_job_engagement_saved_jobs.sql
-- Description: Adds saved_jobs table for tracking candidate interest and admin analytics.

CREATE TABLE IF NOT EXISTS saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure a user can only save a job once
    UNIQUE(candidate_id, job_id)
);

-- Enable RLS
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own saved jobs" ON saved_jobs;
CREATE POLICY "Users can view their own saved jobs"
    ON saved_jobs FOR SELECT
    USING (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Users can save jobs" ON saved_jobs;
CREATE POLICY "Users can save jobs"
    ON saved_jobs FOR INSERT
    WITH CHECK (auth.uid() = candidate_id);

DROP POLICY IF EXISTS "Users can remove saved jobs" ON saved_jobs;
CREATE POLICY "Users can remove saved jobs"
    ON saved_jobs FOR DELETE
    USING (auth.uid() = candidate_id);

-- Admin Policy: Admins can view all saved jobs for analytics
DROP POLICY IF EXISTS "Admins can view all engagement data" ON saved_jobs;
CREATE POLICY "Admins can view all engagement data"
    ON saved_jobs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Add index for analytics performance
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_candidate_id ON saved_jobs(candidate_id);

-- Logging for activity feed
-- This would typically be handled by a trigger or the backend service
