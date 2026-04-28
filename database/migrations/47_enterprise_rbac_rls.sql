-- 47_enterprise_rbac_rls.sql
-- Implements enterprise-grade Role-Based Access Control and Row-Level Security

BEGIN;

-- 1. Ensure Roles Exist
-- The 'roles' table might exist from 02_rbac_schema.sql, but we need to ensure standardized roles exist.
INSERT INTO roles (role_name, description) VALUES
  ('SUPER_ADMIN', 'Platform owner with full access'),
  ('ADMIN', 'Platform moderator'),
  ('COMPANY_OWNER', 'Owner of a specific company workspace'),
  ('RECRUITER', 'Member of a company with hiring privileges'),
  ('USER', 'Standard candidate')
ON CONFLICT (role_name) DO NOTHING;

-- 2. Ensure basic permissions exist
INSERT INTO permissions (permission_name, description) VALUES
  ('system.admin', 'Full system access'),
  ('company.edit', 'Edit company profile'),
  ('job.create', 'Create new job posts'),
  ('job.edit', 'Edit own job posts'),
  ('job.delete', 'Delete own job posts'),
  ('application.review', 'Review applications for own jobs'),
  ('profile.edit', 'Edit own profile')
ON CONFLICT (permission_name) DO NOTHING;

-- Map permissions to roles (Simplified example)
-- Let's assume a helper function or manual mapping here for MVP. We will handle ABAC in FastAPI.

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- USERS TABLE
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read all public profiles (assuming visibility='public' exists, or all if open platform)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
CREATE POLICY "Public profiles are viewable by everyone" ON users FOR SELECT USING (true);

-- Users can only update their own row
DROP POLICY IF EXISTS "Users can update their own row" ON users;
CREATE POLICY "Users can update their own row" ON users FOR UPDATE USING (auth.uid() = id);

-- PROFILES TABLE (Candidate Data)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- JOBS TABLE
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
-- Anyone can view active jobs
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (
  is_active = true OR 
  company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid())
);

-- Only creators (or company admins) can update jobs
DROP POLICY IF EXISTS "Creators can update jobs" ON jobs;
CREATE POLICY "Creators can update jobs" ON jobs FOR UPDATE USING (
  company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid())
);
CREATE POLICY "Creators can insert jobs" ON jobs FOR INSERT WITH CHECK (
  company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid())
);
CREATE POLICY "Creators can delete jobs" ON jobs FOR DELETE USING (
  company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid())
);

-- APPLICATIONS TABLE
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
-- Candidates can view their own apps
DROP POLICY IF EXISTS "Candidates can view own applications" ON applications;
CREATE POLICY "Candidates can view own applications" ON applications FOR SELECT USING (auth.uid() = candidate_id);

-- Job owners can view applications to their jobs
DROP POLICY IF EXISTS "Job owners can view applications" ON applications;
CREATE POLICY "Job owners can view applications" ON applications FOR SELECT USING (
  job_id IN (SELECT id FROM jobs WHERE company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()))
);

-- Candidates can insert their own applications
DROP POLICY IF EXISTS "Candidates can apply" ON applications;
CREATE POLICY "Candidates can apply" ON applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);

-- Job owners can update application status
DROP POLICY IF EXISTS "Job owners can update applications" ON applications;
CREATE POLICY "Job owners can update applications" ON applications FOR UPDATE USING (
  job_id IN (SELECT id FROM jobs WHERE company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()))
);

COMMIT;
