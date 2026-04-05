-- 07_user_panel_and_achievements.sql
-- User Profile, Portfolio, and Engagement Systems

CREATE TABLE IF NOT EXISTS professional_experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS education_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    institution_name TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    achievement_type TEXT NOT NULL, 
    achievement_data JSONB,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_panel_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) UNIQUE,
    theme TEXT DEFAULT 'dark',
    notification_preferences JSONB DEFAULT '{}',
    is_public_resume BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
