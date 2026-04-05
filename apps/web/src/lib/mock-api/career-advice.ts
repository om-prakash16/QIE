
export interface Article {
    id: string
    title: string
    summary: string
    content?: string // For full page which we might not build fully yet, but good to have in type
    category: string
    readingTime: string
    publishedDate: string
    featured: boolean
    author: {
        name: string
        role: string
        avatar: string
    }
    image: string
}

export const CATEGORIES = [
    { id: "resume", label: "Resume & CV", count: 12 },
    { id: "interviews", label: "Interviews", count: 18 },
    { id: "growth", label: "Career Growth", count: 25 },
    { id: "salary", label: "Salary & Negotiation", count: 8 },
    { id: "freshers", label: "Freshers & Students", count: 15 },
    { id: "switching", label: "Switching Careers", count: 10 }
]

export const CAREER_STAGES = [
    {
        id: "student",
        title: "Students & Freshers",
        description: "Land your first internship or full-time job with confidence.",
        icon: "GraduationCap"
    },
    {
        id: "early",
        title: "Early Career (0-3 Years)",
        description: "Master the basics and accelerate your initial growth.",
        icon: "Sprout"
    },
    {
        id: "mid",
        title: "Mid-Level (3-7 Years)",
        description: "Lead projects and explore specialization or management.",
        icon: "Briefcase"
    },
    {
        id: "senior",
        title: "Senior Professionals",
        description: "Strategic leadership, mentorship, and executive roles.",
        icon: "Award"
    }
]

export const EXPERT_TIPS = [
    {
        id: "1",
        quote: "Don't just list responsibilities on your resume; list achievements. Quantify your impact whenever possible.",
        author: "Sarah Jenkins",
        role: "Senior Recruiter at TechCorp"
    },
    {
        id: "2",
        quote: "The best time to look for a job is when you don't need one. Keep your network warm and your skills sharp.",
        author: "David Chen",
        role: "VP of Engineering"
    },
    {
        id: "3",
        quote: "Negotiation starts before the offer. It starts with the value you demonstrate during the interview.",
        author: "Priya Sharma",
        role: "Career Coach"
    }
]

export const ARTICLES: Article[] = [
    {
        id: "1",
        title: "10 Mistakes to Avoid in Your First Technical Interview",
        summary: "Mastering the technical interview is an art. Here are the most common pitfalls freshers fall into and how to avoid them.",
        category: "Interviews",
        readingTime: "5 min read",
        publishedDate: "Dec 12, 2024",
        featured: true,
        author: {
            name: "Alex Johnson",
            role: "Tech Lead",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
        },
        image: "/placeholder-1.jpg"
    },
    {
        id: "2",
        title: "How to Negotiate Your Salary as a Junior Developer",
        summary: "Yes, you can negotiate even for your first job. Learn the script that has helped hundreds of juniors get paid what they're worth.",
        category: "Salary & Negotiation",
        readingTime: "8 min read",
        publishedDate: "Dec 10, 2024",
        featured: true,
        author: {
            name: "Maria Garcia",
            role: "HR Consultant",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
        },
        image: "/placeholder-2.jpg"
    },
    {
        id: "3",
        title: "The Ultimate Guide to Writing a ATS-Friendly Resume",
        summary: "Stop getting rejected by bots. Learn how to format your resume so it actually reaches a human recruiter.",
        category: "Resume & CV",
        readingTime: "6 min read",
        publishedDate: "Dec 05, 2024",
        featured: true,
        author: {
            name: "John Doe",
            role: "Resume Writer",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        },
        image: "/placeholder-3.jpg"
    },
    {
        id: "4",
        title: "Asking for a Promotion: A Step-by-Step Guide",
        summary: "Preparation is key. Here is a timeline and checklist to ensure you are ready to ask for that next level.",
        category: "Career Growth",
        readingTime: "7 min read",
        publishedDate: "Nov 28, 2024",
        featured: false,
        author: {
            name: "Emily Wang",
            role: "Manager",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
        },
        image: "/placeholder-4.jpg"
    },
    {
        id: "5",
        title: "Transitioning from Sales to Software Engineering",
        summary: "A personal story and roadmap for making a successful career switch into tech without a CS degree.",
        category: "Switching Careers",
        readingTime: "10 min read",
        publishedDate: "Nov 20, 2024",
        featured: false,
        author: {
            name: "Chris Paul",
            role: "Software Engineer",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris"
        },
        image: "/placeholder-5.jpg"
    },
    {
        id: "6",
        title: "Top 5 Soft Skills Every Developer Needs",
        summary: "Coding is only half the job. Communication, empathy, and teamwork are what will make you a senior engineer.",
        category: "Career Growth",
        readingTime: "4 min read",
        publishedDate: "Nov 15, 2024",
        featured: false,
        author: {
            name: "Sarah Lee",
            role: "Engineering Manager",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
        },
        image: "/placeholder-6.jpg"
    }
]

export const fetchArticles = async (category?: string, query?: string) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 600))

    let filtered = [...ARTICLES]
    if (category && category !== "all") {
        filtered = filtered.filter(a => a.category === category)
    }
    if (query) {
        const q = query.toLowerCase()
        filtered = filtered.filter(a =>
            a.title.toLowerCase().includes(q) ||
            a.summary.toLowerCase().includes(q)
        )
    }
    return filtered
}
