-- 01_initial_schema.sql
-- Core users and basic job tables
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    profile_picture TEXT,
    bio TEXT,
    reputation_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure Constraints exist (Repair for existing tables)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_pkey') THEN
        ALTER TABLE users ADD PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_wallet_address_key' OR conname = 'unique_wallet') THEN
        ALTER TABLE users ADD CONSTRAINT unique_wallet UNIQUE(wallet_address);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    required_skills TEXT[],
    salary_range TEXT,
    job_type TEXT DEFAULT 'full-time',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id),
    candidate_id UUID REFERENCES users(id),
    resume_url TEXT,
    status TEXT DEFAULT 'pending',
    ai_match_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
