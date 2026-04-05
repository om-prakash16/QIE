
export interface Application {
    id: string
    jobId: string
    title: string
    company: string
    companyLogo: string
    location: string
    appliedDate: string
    status: "Applied" | "Under Review" | "Shortlisted" | "Interviewing" | "Rejected" | "Hired"
    salary?: string
}

export const APPLICATION_DATA: Application[] = [
    {
        id: "app-1",
        jobId: "job-1",
        title: "Senior React Engineer",
        company: "TechFlow Solutions",
        companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=TechFlow",
        location: "San Francisco, CA (Remote)",
        appliedDate: "2024-03-15",
        status: "Applied",
        salary: "$140k - $160k"
    },
    {
        id: "app-2",
        jobId: "job-2",
        title: "Frontend Architect",
        company: "Nebula Systems",
        companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=Nebula",
        location: "New York, NY",
        appliedDate: "2024-03-10",
        status: "Shortlisted",
        salary: "$160k - $190k"
    },
    {
        id: "app-3",
        jobId: "job-3",
        title: "Full Stack Developer",
        company: "GreenEnergy Corp",
        companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=Green",
        location: "Austin, TX",
        appliedDate: "2024-03-01",
        status: "Rejected",
        salary: "$120k - $140k"
    },
    {
        id: "app-4",
        jobId: "job-4",
        title: "UI/UX Developer",
        company: "Creative Studio",
        companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=Creative",
        location: "Remote",
        appliedDate: "2024-03-18",
        status: "Interviewing",
        salary: "$100k - $130k"
    },
    {
        id: "app-5",
        jobId: "job-5",
        title: "Lead Frontend Engineer",
        company: "FinTech Global",
        companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=FinTech",
        location: "London, UK",
        appliedDate: "2024-02-20",
        status: "Hired",
        salary: "£90k - £110k"
    },
    {
        id: "app-6",
        jobId: "job-6",
        title: "Product Engineer",
        company: "StartUp Inc",
        companyLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=StartUp",
        location: "Bangalore, India",
        appliedDate: "2024-03-19",
        status: "Applied",
        salary: "₹30L - ₹50L"
    }
]

interface FetchParams {
    query?: string
    status?: string
}

export const fetchApplications = async (params: FetchParams = {}) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800))

    let data = [...APPLICATION_DATA]

    if (params.query) {
        const q = params.query.toLowerCase()
        data = data.filter(app =>
            app.title.toLowerCase().includes(q) ||
            app.company.toLowerCase().includes(q)
        )
    }

    if (params.status && params.status !== "all") {
        data = data.filter(app => app.status.toLowerCase() === params.status?.toLowerCase())
    }

    return data
}
