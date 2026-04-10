-- Migration 32: Career Planning System
-- Features: Structured career goals, milestones (tasks), and progress tracking.

CREATE TABLE IF NOT EXISTS career_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_title TEXT NOT NULL,
    target_role TEXT,
    deadline DATE,
    status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'COMPLETED', 'ARCHIVED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES career_goals(id) ON DELETE CASCADE,
    task_title TEXT NOT NULL,
    status TEXT DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'COMPLETED')),
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_career_goals_user ON career_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_career_tasks_goal ON career_tasks(goal_id);

COMMENT ON TABLE career_goals IS 'Allows users to define high-level professional goals.';
COMMENT ON TABLE career_tasks IS 'Granular tasks or milestones associated with a specific career goal.';
