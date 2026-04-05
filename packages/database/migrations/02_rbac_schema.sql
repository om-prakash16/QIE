-- 02_rbac_schema.sql
-- Role-Based Access Control Infrastructure

CREATE TABLE IF NOT EXISTS public.staff_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name TEXT UNIQUE NOT NULL, 
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.staff_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES public.staff_roles(id),
    permission_key TEXT NOT NULL, 
    granted_by UUID REFERENCES public.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.staff_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    role_id UUID REFERENCES public.staff_roles(id),
    assigned_by UUID REFERENCES public.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed defaults
INSERT INTO public.staff_roles (role_name, description) VALUES 
('admin', 'Full platform control'),
('moderator', 'Job and user moderation'),
('support', 'Ticketing and user assistance'),
('recruiter', 'Job posting management')
ON CONFLICT (role_name) DO NOTHING;
