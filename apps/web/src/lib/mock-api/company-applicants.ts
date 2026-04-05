
export interface CompanyApplicant {
    id: string;
    name: string;
    role: string;
    avatar: string;
    skills: string[];
    hasGithub: boolean; // Indicator for "GitHub Connected"
    status: 'New' | 'Shortlisted' | 'Rejected' | 'Interviewing';
    appliedAt: string;
    email: string;
}

const AVATAR_BASE = "https://api.dicebear.com/7.x/avataaars/svg?seed=";

export const MOCK_APPLICANTS: CompanyApplicant[] = [
    {
        id: "a1",
        name: "Alex Morgan",
        role: "Senior Full Stack Developer",
        avatar: `${AVATAR_BASE}Alex`,
        skills: ["React", "Node.js", "TypeScript", "AWS"],
        hasGithub: true,
        status: "New",
        appliedAt: "2 hours ago",
        email: "alex.morgan@example.com"
    },
    {
        id: "a2",
        name: "Sarah Chen",
        role: "Frontend Specialist",
        avatar: `${AVATAR_BASE}Sarah`,
        skills: ["Vue.js", "CSS3", "Design Systems"],
        hasGithub: true,
        status: "New",
        appliedAt: "5 hours ago",
        email: "sarah.chen@example.com"
    },
    {
        id: "a3",
        name: "James Wilson",
        role: "Backend Engineer",
        avatar: `${AVATAR_BASE}James`,
        skills: ["Go", "Kubernetes", "PostgreSQL"],
        hasGithub: false,
        status: "Shortlisted",
        appliedAt: "1 day ago",
        email: "j.wilson@example.com"
    },
    {
        id: "a4",
        name: "Emily Rodriguez",
        role: "Full Stack Engineer",
        avatar: `${AVATAR_BASE}Emily`,
        skills: ["Python", "Django", "React"],
        hasGithub: true,
        status: "Rejected",
        appliedAt: "2 days ago",
        email: "emily.r@example.com"
    },
    {
        id: "a5",
        name: "Michael Ross",
        role: "Product Designer (UX/UI)",
        avatar: `${AVATAR_BASE}Michael`,
        skills: ["Figma", "User Research", "Prototyping"],
        hasGithub: true,
        status: "Interviewing",
        appliedAt: "3 days ago",
        email: "m.ross@example.com"
    }
];

export const getApplicantsByJobId = async (jobId: string): Promise<CompanyApplicant[]> => {
    // In a real app we'd filter by job ID. Here we just return the full mock list for demo purposes.
    await new Promise(resolve => setTimeout(resolve, 700));
    return MOCK_APPLICANTS;
};
