-- 08_verification_logic.sql
-- Skill and Identity Verification Logic

CREATE TABLE IF NOT EXISTS user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    skill_name TEXT NOT NULL,
    proficiency_level INTEGER DEFAULT 1, 
    is_verified BOOLEAN DEFAULT FALSE,
    verification_hash TEXT, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skill_verification_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    skill_key TEXT NOT NULL, 
    verified_by UUID REFERENCES users(id), 
    verification_method TEXT, 
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS moderation_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL,
    entity_type TEXT NOT NULL, 
    reason TEXT,
    priority TEXT DEFAULT 'normal',
    status TEXT DEFAULT 'pending',
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
