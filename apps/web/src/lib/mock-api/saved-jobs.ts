export interface SavedJob {
    id: string
    title: string
    company: string
    logo: string
    location: string
    type: "Full-time" | "Part-time" | "Contract" | "Freelance"
    salary: string
    savedDate: string
    postedDate: string
}

export const SAVED_JOBS: SavedJob[] = [
    {
        id: "1",
        title: "Senior Frontend Engineer",
        company: "TechCorp",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=TC",
        location: "Bangalore, India",
        type: "Full-time",
        salary: "₹25L - ₹35L",
        savedDate: "2024-03-15",
        postedDate: "2 days ago"
    },
    {
        id: "2",
        title: "Product Designer",
        company: "DesignStudio",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=DS",
        location: "Remote",
        type: "Contract",
        salary: "$60 - $80 / hr",
        savedDate: "2024-03-14",
        postedDate: "1 week ago"
    },
    {
        id: "3",
        title: "Backend Developer",
        company: "InnovateLabs",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=IL",
        location: "Hyderabad, India",
        type: "Full-time",
        salary: "₹18L - ₹24L",
        savedDate: "2024-03-10",
        postedDate: "3 days ago"
    },
    {
        id: "4",
        title: "DevOps Engineer",
        company: "CloudSystems",
        logo: "https://api.dicebear.com/7.x/initials/svg?seed=CS",
        location: "Pune, India",
        type: "Full-time",
        salary: "₹20L - ₹30L",
        savedDate: "2024-03-01",
        postedDate: "5 days ago"
    }
]
