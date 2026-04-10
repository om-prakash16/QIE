-- Migration 34: Community Discussion Platform
-- Features: Topic-based rooms and real-time message persistence.

CREATE TABLE IF NOT EXISTS discussion_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- e.g., 'AI', 'Fullstack', 'Web3', 'Soft Skills'
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES discussion_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_chat_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_timestamp ON chat_messages(created_at);

-- Initial seeding of public rooms
INSERT INTO discussion_rooms (room_name, category, description) 
VALUES 
('AI & LLM Innovations', 'AI', 'Discuss GPT, Gemini, and the future of LLMs.'),
('Fullstack Frontiers', 'Engineering', 'Next.js, FastAPI, and building scalable apps.'),
('Solana Ecosystem', 'Web3', 'Building on Solana and decentralized credentials.'),
('Career Strategy Hub', 'Soft Skills', 'Resume tips, interview prep, and career growth.')
ON CONFLICT (room_name) DO NOTHING;

COMMENT ON TABLE discussion_rooms IS 'Master list of categorized community chat rooms.';
COMMENT ON TABLE chat_messages IS 'History of all messages sent in community rooms.';
