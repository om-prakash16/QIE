
export interface CompanyStats {
    activeJobs: number;
    totalApplicants: number;
    shortlisted: number;
    closedJobs: number;
    recentActivity: ActivityItem[];
}

export interface ActivityItem {
    id: string;
    type: 'job_posted' | 'new_applicant' | 'job_closed';
    message: string;
    time: string;
}

export const MOCK_COMPANY_STATS: CompanyStats = {
    activeJobs: 12,
    totalApplicants: 148,
    shortlisted: 24,
    closedJobs: 5,
    recentActivity: [
        { id: '1', type: 'new_applicant', message: 'Alex Morgan applied for Senior Frontend Engineer', time: '2 hours ago' },
        { id: '2', type: 'new_applicant', message: 'Sarah Chen applied for Senior Frontend Engineer', time: '5 hours ago' },
        { id: '3', type: 'job_posted', message: 'Posted new job: Backend System Architect', time: '1 day ago' },
        { id: '4', type: 'job_closed', message: 'Closed job: Junior React Developer', time: '3 days ago' },
        { id: '5', type: 'new_applicant', message: 'Michael Ross applied for Product Designer', time: '3 days ago' },
    ]
};

export const getCompanyStats = async (): Promise<CompanyStats> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_COMPANY_STATS;
};
