-- Migration: Dynamic Admin Control & Profile Schema
-- ──────────────────────────────────────────────

-- 1. Profile Schema Definition
CREATE TABLE IF NOT EXISTS profile_schema_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    key TEXT NOT NULL UNIQUE, -- e.g., 'expected_salary'
    type TEXT NOT NULL, -- 'text', 'number', 'select', 'multiselect', 'date', 'file', 'url'
    required BOOLEAN DEFAULT FALSE,
    placeholder TEXT,
    validation_rules JSONB, -- e.g., { 'min': 0, 'max': 1000000 }
    default_value TEXT,
    section_name TEXT DEFAULT 'Professional Info', -- 'Basic', 'Skills', 'Experience', etc.
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AI Reputation Configuration
CREATE TABLE IF NOT EXISTS ai_configurations (
    key TEXT PRIMARY KEY, -- e.g., 'reputation_v1'
    weights JSONB NOT NULL, -- e.g., { 'skill': 0.4, 'github': 0.3, 'project': 0.3 }
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial AI config
INSERT INTO ai_configurations (key, weights, description)
VALUES (
    'reputation_v1', 
    '{ "skill_weight": 0.4, "github_weight": 0.3, "project_weight": 0.3, "base_multiplier": 1.0 }'::jsonb, 
    'Standard reputation formula weighting logic.'
) ON CONFLICT DO NOTHING;

-- 3. Skills Taxonomy
CREATE TABLE IF NOT EXISTS skills_taxonomy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    parent_id UUID REFERENCES skills_taxonomy(id),
    category TEXT, -- 'Programming', 'Design', 'Marketing'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. NFT Template Management
CREATE TABLE IF NOT EXISTS nft_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'profile', 'skill', 'achievement'
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    metadata_schema JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Feature Flags (Toggles)
CREATE TABLE IF NOT EXISTS feature_flags (
    id TEXT PRIMARY KEY, -- e.g., 'enable_ai_quiz'
    is_enabled BOOLEAN DEFAULT FALSE,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed basic flags
INSERT INTO feature_flags (id, is_enabled, description)
VALUES 
('enable_ai_quiz', false, 'Toggle AI-powered skill assessment quizzes.'),
('enable_micro_jobs', true, 'Toggle the micro-task marketplace.'),
('enable_referral_rewards', true, 'Toggle referral bonus distributions.')
ON CONFLICT DO NOTHING;

-- 6. Dynamic User Data
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reputation_details JSONB DEFAULT '{}'::jsonb;
