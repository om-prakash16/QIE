const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Using anon key for now, hoping the schema allows it or assuming it's correctly permissionsed for a demo.

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MIGRATION_SQL = `
-- Update Users table for full profile support
ALTER TABLE users ADD COLUMN IF NOT EXISTS id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;

-- Update Jobs table for rich display
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_type TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_range TEXT;
`;

async function migrate() {
  console.log('🚀 Running Database Migration (Zero-Mock Schema)...');

  // Since we don't have direct SQL execution in many client setups, 
  // we'll try to perform a dummy select to verify connection, 
  // then inform that SQL should be run in Supabase Dashboard if this script can't exec raw SQL.
  
  // Actually, we'll try to use a dummy RPC if it exists, or just explain the SQL.
  const { data, error } = await supabase.rpc('exec_sql', { sql: MIGRATION_SQL });

  if (error) {
    console.error('❌ Migration Error (RPC exec_sql might be disabled):', error.message);
    console.log('\n💡 Please copy-paste the following SQL into your Supabase SQL Editor:\n');
    console.log(MIGRATION_SQL);
  } else {
    console.log('✅ Migration Successful!');
  }
}

migrate();
 Simon;
