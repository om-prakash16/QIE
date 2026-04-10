-- Migration 33: Professional Identity & Networking
-- Features: Connections (Social Graph), Education, and Work History refined.

-- 1. Connections Table
CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    connected_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, connected_user_id)
);

-- 2. Refined Education History (Harmonizing with architect spec)
-- Updating existing if it exists, otherwise creating
CREATE TABLE IF NOT EXISTS education_history_refined (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    start_year INTEGER,
    end_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Refined Work History (Harmonizing with architect spec)
CREATE TABLE IF NOT EXISTS work_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_connections_users ON connections(user_id, connected_user_id);
CREATE INDEX IF NOT EXISTS idx_work_history_user ON work_history(user_id);

COMMENT ON TABLE connections IS 'Manages professional connections between users.';
COMMENT ON TABLE education_history_refined IS 'Standardized education records.';
COMMENT ON TABLE work_history IS 'Standardized professional experience records.';
