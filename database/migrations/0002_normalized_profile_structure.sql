-- 0002_normalized_profile_structure.sql
-- Goal: Replace JSONB blobs with structured relational tables.

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    headline VARCHAR(255),
    bio TEXT,
    location VARCHAR(100),
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. SKILLS DICTIONARY
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    icon_url TEXT
);

-- 3. USER SKILLS (MANY-TO-MANY)
CREATE TABLE IF NOT EXISTS user_skills_relational (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20), -- 'Beginner', 'Intermediate', 'Expert'
    is_verified BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, skill_id)
);

-- 4. EXPERIENCES
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    start_date DATE,
    end_date DATE,
    description TEXT,
    is_current BOOLEAN DEFAULT FALSE
);

-- 5. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    github_url TEXT,
    live_url TEXT,
    thumbnail_url TEXT,
    start_date DATE,
    end_date DATE
);

-- 6. EDUCATION
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    institution VARCHAR(150) NOT NULL,
    degree VARCHAR(100),
    field_of_study VARCHAR(100),
    start_date DATE,
    end_date DATE
);

-- 7. AI SCORES
CREATE TABLE IF NOT EXISTS ai_scores (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    proof_score DECIMAL(5,2) DEFAULT 0,
    technical_score DECIMAL(5,2) DEFAULT 0,
    soft_skills_score DECIMAL(5,2) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_scores_proof_score ON ai_scores(proof_score DESC);
