-- 04_dynamic_admin_control.sql
-- Platform-wide dynamic configuration and AI matching rules

CREATE TABLE IF NOT EXISTS platform_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key TEXT UNIQUE NOT NULL, 
    config_value JSONB NOT NULL,
    config_type TEXT NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ai_matching_schemas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_category TEXT UNIQUE NOT NULL, 
    required_field_keys TEXT[], 
    weight_map JSONB NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed defaults
INSERT INTO platform_configs (config_key, config_value, config_type) VALUES 
('ai_match_threshold', '0.75', 'ai'),
('referral_bonus_pct', '0.05', 'financial')
ON CONFLICT (config_key) DO NOTHING;
