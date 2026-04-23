-- 0004_admin_cms_config.sql
-- Goal: Centralized platform control, feature flags, and moderation logs.

-- 1. PLATFORM SETTINGS
DROP TABLE IF EXISTS platform_settings CASCADE;
CREATE TABLE platform_settings (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

INSERT INTO platform_settings (config_key, config_value, description) VALUES
('ai_score_weights', '{"resume": 0.4, "github": 0.3, "skills": 0.3}', 'Weights used for global Proof Score calculation'),
('ai_thresholds', '{"passing_score": 60, "elite_score": 85}', 'Benchmarks for candidate categorization'),
('system_limits', '{"max_upload_size_mb": 5, "ai_requests_per_user_day": 10}', 'Global usage constraints')
ON CONFLICT (config_key) DO NOTHING;

-- 2. FEATURE FLAGS
DROP TABLE IF EXISTS feature_flags CASCADE;
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_name VARCHAR(100) UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

INSERT INTO feature_flags (feature_name, description) VALUES
('ai_matching', 'Enables AI-driven candidate to job matching'),
('nft_credentials', 'Enables minting of skill credentials on-chain'),
('community_chat', 'Enables the peer-to-peer messaging system')
ON CONFLICT (feature_name) DO NOTHING;

-- 3. MODERATION LOGS
DROP TABLE IF EXISTS moderation_logs CASCADE;
CREATE TABLE moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id),
    target_id UUID NOT NULL,
    target_type VARCHAR(20) NOT NULL,
    action VARCHAR(20) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. PROFILE SCHEMA (Dynamic Field Builder)
CREATE TABLE IF NOT EXISTS profile_schema (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_name VARCHAR(50) UNIQUE NOT NULL,
    field_type VARCHAR(20) NOT NULL, -- 'text', 'number', 'select', 'file'
    label VARCHAR(100),
    is_required BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);
