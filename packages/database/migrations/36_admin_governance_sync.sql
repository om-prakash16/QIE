-- 36_admin_governance_sync.sql
-- Synchronizes 24-module governance parameters with the database-driven control center.

-- 1. Ensure Table Parity
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Upsert Resonance Formula (Module 17)
-- Unified JSON structure instead of flat keys for easier UI binding
INSERT INTO public.platform_settings (setting_key, setting_value) VALUES (
    'resonance_formula',
    '{
        "skill_match_weight": 40,
        "experience_weight": 30,
        "project_score_weight": 30,
        "min_resonance_threshold": 65,
        "mcq_difficulty": 2,
        "questions_per_assessment": 10,
        "skill_importance_weight": 70
    }'
) ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- 3. Upsert Blockchain Governance Config (Module 11)
INSERT INTO public.platform_settings (setting_key, setting_value) VALUES (
    'blockchain_config',
    '{
        "auto_mint": true,
        "soulbound": true,
        "min_resonance_score": 85,
        "metadata_template": "SKILLPROOF_V1_METAPLEX",
        "collection_mint": "3u7...9vJ"
    }'
) ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- 4. Clean up legacy flat keys if they exist (from 19_admin_control_foundation.sql)
DELETE FROM public.platform_settings WHERE setting_key IN ('skill_weight', 'github_weight', 'project_weight', 'experience_weight');

-- 5. Final Audit Log
INSERT INTO public.staff_audit_logs (staff_wallet, action, target_type, target_id, metadata)
VALUES ('SYSTEM', 'GOVERNANCE_SYNC', 'platform_settings', 'GLOBAL', '{"status": "completed", "version": "1.1.0"}');
