export interface CompanyConfig {
    benefits: string[]
    environment: string
    diversity: string
}

export interface Review {
    id: string
    author: string
    role: string
    rating: number
    text: string
    date: string
}

export interface Company {
    id: string
    slug: string
    name: string
    logo: string
    tagline: string
    description: string
    industry: string
    location: string
    size: "Startup" | "SME" | "Enterprise"
    founded: number
    website: string
    hiringStatus: "Actively Hiring" | "Hiring" | "Not Hiring"
    jobCount: number
    stats: {
        activeJobs: number
        avgExperience: string
        workType: string
    }
    about: {
        mission: string
        vision: string
        values: string[]
    }
    culture: CompanyConfig
    techStack: {
        frontend: string[]
        backend: string[]
        infra: string[]
    }
    reviews: Review[]
    analytics: {
        jobsOverTime: { month: string; jobs: number }[]
    }
}

const STATIC_COMPANIES: Company[] = [
    {
        id: "1",
        slug: "techflow-systems",
        name: "TechFlow Systems",
        logo: "https://api.dicebear.com/7.x/identicon/svg?seed=TechFlow",
        tagline: "Streamlining enterprise workflows with AI",
        description: "TechFlow Systems is a leading provider of AI-driven workflow automation solutions for enterprise businesses. We help companies save time and reduce errors by automating repetitive tasks.",
        industry: "Information Technology (IT)",
        location: "San Francisco, CA",
        size: "SME",
        founded: 2015,
        website: "https://techflow.example.com",
        hiringStatus: "Actively Hiring",
        jobCount: 12,
        stats: {
            activeJobs: 12,
            avgExperience: "3-5 Years",
            workType: "Hybrid"
        },
        about: {
            mission: "To liberate human potential by automating the mundane.",
            vision: "A world where people focus on creativity and strategy, while AI handles the execution.",
            values: ["Innovation", "Customer Obsession", "Transparency", "Agility"]
        },
        culture: {
            benefits: ["Unlimited PTO", "Remote-first", "Health & Dental", "401k Matching", "Learning Stipend"],
            environment: "Fast-paced, collaborative, and experiment-driven. We encourage trying new things and learning from failures.",
            diversity: "We believe diverse teams build better products. We are committed to equal opportunity and an inclusive environment."
        },
        techStack: {
            frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
            backend: ["Node.js", "Python", "Go", "PostgreSQL"],
            infra: ["AWS", "Docker", "Kubernetes", "Terraform"]
        },
        reviews: [
            {
                id: "r1",
                author: "Sarah Jenkins",
                role: "Senior Engineer",
                rating: 5,
                text: "Great culture and amazing people. The problems we solve are challenging and impact real users.",
                date: "2 months ago"
            },
            {
                id: "r2",
                author: "Mike Ross",
                role: "Product Manager",
                rating: 4,
                text: "Fast-paced environment, lots of autonomy. Sometimes the workload can be high during release cycles.",
                date: "5 months ago"
            }
        ],
        analytics: {
            jobsOverTime: [
                { month: "Jan", jobs: 5 },
                { month: "Feb", jobs: 8 },
                { month: "Mar", jobs: 12 },
                { month: "Apr", jobs: 10 },
                { month: "May", jobs: 15 },
                { month: "Jun", jobs: 12 }
            ]
        }
    },
    {
        id: "2",
        slug: "finserve-global",
        name: "FinServe Global",
        logo: "https://api.dicebear.com/7.x/identicon/svg?seed=FinServe",
        tagline: "Next-generation banking infrastructure",
        description: "FinServe Global builds the rails for the next generation of financial services. From payments to lending, our API-first platform powers fintechs around the world.",
        industry: "FinTech & Financial Services",
        location: "New York, NY",
        size: "Enterprise",
        founded: 2008,
        website: "https://finserve.example.com",
        hiringStatus: "Hiring",
        jobCount: 45,
        stats: {
            activeJobs: 45,
            avgExperience: "5+ Years",
            workType: "Onsite"
        },
        about: {
            mission: "To democratize access to financial services globally.",
            vision: "Financial freedom for everyone, everywhere.",
            values: ["Integrity", "Security", "Reliability", "Impact"]
        },
        culture: {
            benefits: ["Competitive Salary", "Performance Bonus", "Premium Healthcare", "Gym Membership"],
            environment: "Professional, structured, and high-performance. We deal with money, so accuracy and security are paramount.",
            diversity: "We are building a global team for a global product."
        },
        techStack: {
            frontend: ["Angular", "RxJS", "Sass"],
            backend: ["Java", "Spring Boot", "Kafka"],
            infra: ["Azure", "Jenkins", "Ansible"]
        },
        reviews: [
            {
                id: "r3",
                author: "David Chen",
                role: "Platform Engineer",
                rating: 4,
                text: "Solid engineering practices and great stability. Can be a bit bureaucratic at times.",
                date: "1 year ago"
            }
        ],
        analytics: {
            jobsOverTime: [
                { month: "Jan", jobs: 40 },
                { month: "Feb", jobs: 42 },
                { month: "Mar", jobs: 38 },
                { month: "Apr", jobs: 45 },
                { month: "May", jobs: 48 },
                { month: "Jun", jobs: 45 }
            ]
        }
    },
    {
        id: "3",
        slug: "edulearn-tech",
        name: "EduLearn Tech",
        logo: "https://api.dicebear.com/7.x/identicon/svg?seed=EduLearn",
        tagline: "Personalized learning for everyone",
        description: "EduLearn Tech is an ed-tech startup focused on bringing personalized, adaptive learning experiences to students K-12 using machine learning.",
        industry: "Education (EdTech)",
        location: "Austin, TX",
        size: "Startup",
        founded: 2021,
        website: "https://edulearn.example.com",
        hiringStatus: "Actively Hiring",
        jobCount: 5,
        stats: {
            activeJobs: 5,
            avgExperience: "1-3 Years",
            workType: "Remote"
        },
        about: {
            mission: "To transform education through personalization.",
            vision: "Every student reaches their full potential.",
            values: ["Empathy", "Growth Mindset", "Fun", "Data-Driven"]
        },
        culture: {
            benefits: ["Equity", "Remote Work", "Home Office Stipend", "Flexible Hours"],
            environment: "Scrappy, tight-knit, and mission-driven. We wear many hats and move fast.",
            diversity: "Education is for everyone, and our team reflects that."
        },
        techStack: {
            frontend: ["Vue.js", "Nuxt", "Tailwind CSS"],
            backend: ["Node.js", "Express", "MongoDB"],
            infra: ["Google Cloud", "Firebase", "GitHub Actions"]
        },
        reviews: [],
        analytics: {
            jobsOverTime: [
                { month: "Jan", jobs: 2 },
                { month: "Feb", jobs: 3 },
                { month: "Mar", jobs: 3 },
                { month: "Apr", jobs: 4 },
                { month: "May", jobs: 5 },
                { month: "Jun", jobs: 5 }
            ]
        }
    },
    {
        id: "4",
        slug: "health-plus",
        name: "Health+",
        logo: "https://api.dicebear.com/7.x/identicon/svg?seed=HealthPlus",
        tagline: "Digital health for the modern age",
        description: "Health+ provides a comprehensive telemedicine and patient engagement platform for healthcare providers.",
        industry: "Healthcare & Life Sciences",
        location: "Boston, MA",
        size: "SME",
        founded: 2018,
        website: "https://healthplus.example.com",
        hiringStatus: "Actively Hiring",
        jobCount: 8,
        stats: {
            activeJobs: 8,
            avgExperience: "3-5 Years",
            workType: "Hybrid"
        },
        about: {
            mission: "Making healthcare accessible and efficient.",
            vision: "A healthier world through technology.",
            values: ["Care", "Privacy", "Innovation"]
        },
        culture: {
            benefits: ["Health Insurance", "Wellness Program", "Parental Leave"],
            environment: "Process-oriented but innovative.",
            diversity: "We serve a diverse patient base."
        },
        techStack: {
            frontend: ["React", "Redux"],
            backend: ["Python", "Django", "PostgreSQL"],
            infra: ["AWS", "Terraform"]
        },
        reviews: [],
        analytics: {
            jobsOverTime: []
        }

    }
]

const MNC_NAMES = [
    "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Adobe", "Salesforce", "Oracle", "IBM",
    "Cisco", "Intel", "SAP", "VMware", "NVIDIA", "Dell", "HP", "Accenture", "Deloitte", "Capgemini",
    "TCS", "Infosys", "Wipro", "HCLTech", "Cognizant", "LTIMindtree", "Tech Mahindra", "Zoho", "Flipkart",
    "Myntra", "Paytm", "Zomato", "Swiggy", "Uber", "Airbnb", "LinkedIn", "Twitter (X)", "Spotify", "Zoom",
    "Slack", "Atlassian", "Samsung", "Sony", "LG", "Siemens", "Bosch", "GE", "Honeywell", "3M", "PepsiCo",
    "Coca-Cola", "Unilever", "P&G", "Nestle", "J&J", "Pfizer", "Novartis", "Roche", "Merck", "GSK",
    "AstraZeneca", "Abbott", "Medtronic", "Visa", "Mastercard", "Amex", "JP Morgan", "Goldman Sachs",
    "Citi", "Bank of America", "Wells Fargo", "HSBC", "Barclays", "BNP Paribas", "UBS", "Credit Suisse",
    "Deutsche Bank", "Allianz", "Axa", "MetLife", "Walmart", "Costco", "Target", "Home Depot", "Starbucks",
    "McDonald's", "Nike", "Adidas", "Toyota", "VW", "BMW", "Mercedes-Benz", "Ford", "GM", "Honda",
    "Nissan", "Hyundai", "Tesla"
]

const INDUSTRIES = [
    "Information Technology (IT)",
    "FinTech & Financial Services",
    "Healthcare & Life Sciences",
    "Education (EdTech)",
    "E-commerce & Retail",
    "Manufacturing & Engineering",
    "Media & Entertainment",
    "Professional Services"
]
const LOCATIONS = ["Bangalore, India", "Hyderabad, India", "Pune, India", "Gurugram, India", "Remote", "San Francisco, CA", "London, UK", "New York, NY", "Austin, TX"]

const generateMNC = (name: string, index: number): Company => {
    const industry = INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)]
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]

    return {
        id: `mnc-${index}`,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: name,
        logo: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        tagline: "Leading the way in innovation",
        description: `${name} is a global leader in ${industry}. We are dedicated to delivering excellence and driving digital transformation for our clients worldwide.`,
        industry: industry,
        location: location,
        size: "Enterprise",
        founded: 1990 + Math.floor(Math.random() * 30),
        website: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
        hiringStatus: Math.random() > 0.3 ? "Actively Hiring" : "Hiring",
        jobCount: Math.floor(Math.random() * 500) + 50,
        stats: {
            activeJobs: Math.floor(Math.random() * 100) + 10,
            avgExperience: "3-8 Years",
            workType: "Hybrid"
        },
        about: {
            mission: "To innovate and inspire.",
            vision: "A better connected world.",
            values: ["Innovation", "Integrity", "Excellence"] // Simplified
        },
        culture: {
            benefits: ["Comprehensive Health", "401k / PF", "Learning Budget"],
            environment: "Global, inclusive, and professional.",
            diversity: "Committed to global diversity standards."
        },
        techStack: {
            frontend: ["React", "Angular"],
            backend: ["Java", "Node.js"],
            infra: ["AWS", "Azure"]
        },
        reviews: [],
        analytics: { jobsOverTime: [] }
    }
}

const MNCS = MNC_NAMES.map((name, i) => generateMNC(name, i))

export const COMPANIES = [...STATIC_COMPANIES, ...MNCS]
