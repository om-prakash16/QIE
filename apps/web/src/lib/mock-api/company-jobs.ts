
export interface CompanyJob {
    id: string;
    title: string;
    location: string;
    type: string; // 'Full-time' | 'Contract' | 'Remote' etc.
    applicantsCount: number;
    status: 'Open' | 'Closed';
    postedAt: string;
}

export const MOCK_COMPANY_JOBS: CompanyJob[] = [
    {
        id: "1",
        title: "Senior Frontend Engineer",
        location: "San Francisco, CA (Remote)",
        type: "Full-time",
        applicantsCount: 45,
        status: "Open",
        postedAt: "2024-03-10"
    },
    {
        id: "2",
        title: "Backend System Architect",
        location: "New York, NY",
        type: "Full-time",
        applicantsCount: 12,
        status: "Open",
        postedAt: "2024-03-15"
    },
    {
        id: "3",
        title: "Product Designer",
        location: "Austin, TX (Hybrid)",
        type: "Contract",
        applicantsCount: 28,
        status: "Open",
        postedAt: "2024-03-05"
    },
    {
        id: "4",
        title: "Junior React Developer",
        location: "Remote",
        type: "Part-time",
        applicantsCount: 89,
        status: "Closed",
        postedAt: "2024-02-20"
    },
    {
        id: "5",
        title: "Engineering Manager",
        location: "San Francisco, CA",
        type: "Full-time",
        applicantsCount: 6,
        status: "Open",
        postedAt: "2024-03-18"
    }
];

export const getCompanyJobs = async (): Promise<CompanyJob[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_COMPANY_JOBS;
};
