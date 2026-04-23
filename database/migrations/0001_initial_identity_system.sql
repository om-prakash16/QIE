-- 0001_initial_identity_system.sql
-- Goal: Establish the core user identity and auto-incrementing BHT codes.

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visibility_status') THEN
        CREATE TYPE visibility_status AS ENUM ('public', 'private', 'recruiter-only');
    END IF;
END $$;

-- Sequence for BHT codes
CREATE SEQUENCE IF NOT EXISTS user_code_seq START 1000;

-- Function to auto-generate BHT-XXXX codes
CREATE OR REPLACE FUNCTION generate_bht_user_code() RETURNS trigger AS $$
BEGIN
  IF NEW.user_code IS NULL THEN
    NEW.user_code := 'BHT-' || nextval('user_code_seq');
  END IF;
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Identity table updates
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_code VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS visibility visibility_status DEFAULT 'public';
ALTER TABLE users ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT '{user}';
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Trigger for user code
DROP TRIGGER IF EXISTS trg_generate_user_code ON users;
CREATE TRIGGER trg_generate_user_code
BEFORE INSERT ON users
FOR EACH ROW EXECUTE FUNCTION generate_bht_user_code();

CREATE INDEX IF NOT EXISTS idx_users_user_code ON users(user_code);
