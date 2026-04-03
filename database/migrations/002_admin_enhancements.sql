-- Migration: Nexus Admin Enhancements
-- ──────────────────────────────────

-- 1. Identity Infrastructure
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'talent' CHECK (role IN ('talent', 'company', 'admin'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending'));

-- 2. Moderation Layer
-- Migrate is_active to status if not already handled
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'flagged', 'draft'));
-- Optional: Populate status based on is_active if both exist
UPDATE jobs SET status = 'active' WHERE is_active = TRUE AND status = 'active';
UPDATE jobs SET status = 'closed' WHERE is_active = FALSE AND status = 'active';

-- 3. Configuration Management
CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial settings
INSERT INTO platform_settings (key, value, description)
VALUES 
('maintenance_mode', 'false'::jsonb, 'Platform-wide operational suspension.'),
('ai_moderation_enabled', 'true'::jsonb, 'Toggle neural resume/job verification system.'),
('platform_fee_percent', '2.5'::jsonb, 'Percentage fee for bounty distributions.')
ON CONFLICT (key) DO NOTHING;
