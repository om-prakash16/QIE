-- 06_company_panel.sql
-- Company management, team structure, and organization logic

CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    website TEXT,
    description TEXT,
    industry TEXT,
    company_size TEXT,
    location TEXT,
    about_company TEXT,
    verified BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES companies(id),
    user_id UUID REFERENCES users(id),
    membership_role TEXT DEFAULT 'member', 
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS company_verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    document_url TEXT, 
    status TEXT DEFAULT 'pending', 
    reviewer_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
