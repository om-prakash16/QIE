-- 03_dynamic_profile_system.sql
-- Dynamic Profile Field Definitions

CREATE TABLE IF NOT EXISTS profile_field_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_name TEXT NOT NULL, 
    label TEXT NOT NULL,
    key TEXT UNIQUE NOT NULL, 
    field_type TEXT NOT NULL, 
    is_required BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Defaults
INSERT INTO profile_field_definitions (section_name, label, key, field_type, display_order) VALUES
('professional', 'GitHub URL', 'github_url', 'url', 1),
('professional', 'Portfolio URL', 'portfolio_url', 'url', 2),
('web3', 'Solana Wallet', 'solana_wallet', 'text', 3)
ON CONFLICT (key) DO NOTHING;
