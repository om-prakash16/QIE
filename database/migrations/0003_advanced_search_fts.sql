-- 0003_advanced_search_fts.sql
-- Goal: Implement PostgreSQL Full-Text Search with ranking and triggers.

-- 1. ADD SEARCH VECTORS
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 2. GIN INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_search ON profiles USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_jobs_search ON jobs USING GIN(search_vector);

-- 3. TRIGGERS FOR PROFILES
CREATE OR REPLACE FUNCTION refresh_profile_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.full_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.headline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.bio, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_refresh_profile_search ON profiles;
CREATE TRIGGER trg_refresh_profile_search
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION refresh_profile_search_vector();

-- 4. TRIGGERS FOR PROJECTS
CREATE OR REPLACE FUNCTION refresh_project_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_refresh_project_search ON projects;
CREATE TRIGGER trg_refresh_project_search
BEFORE INSERT OR UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION refresh_project_search_vector();

-- 5. TRIGGERS FOR JOBS
CREATE OR REPLACE FUNCTION refresh_job_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_refresh_job_search ON jobs;
CREATE TRIGGER trg_refresh_job_search
BEFORE INSERT OR UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION refresh_job_search_vector();
