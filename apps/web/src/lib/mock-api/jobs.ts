export interface Job {
    id: string
    title: string
    company: string
    logo: string
    location: string
    type: string
    salary: string
    postedAt: string
    tags: string[]
    description: string
    category: string
    rating?: number
    reviews?: number
    experience?: string

    // Rich Details
    roleCategory?: string
    education?: string
    openings?: number
    applicants?: string
    highlights?: string[]
    benefits?: string[]
    aboutCompany?: string
    companySocials?: {
        website?: string
        linkedin?: string
        twitter?: string
        facebook?: string
    }
    keySkills?: string[]
}

export const JOBS: Job[] = [
    {
        id: "1",
        title: "Artificial Intelligence Research Engineer",
        company: "AuthBridge",
        logo: "/logos/authbridge.png", // specific logo if possible, or generic
        location: "Gurugram, India",
        type: "Full-time",
        salary: "Not Disclosed",
        postedAt: "2 days ago",
        tags: ["NLP", "Machine Learning", "LLM", "Python"],
        category: "Engineering",
        rating: 3.2,
        reviews: 835,
        experience: "0 - 2 years",
        openings: 1,
        applicants: "100+",
        roleCategory: "Engineering - Software & QA",
        education: "B.Tech/B.E. in CS/AI, or Masters in AI/ML",
        keySkills: ["NLP", "Vector Embeddings", "ML", "LLMs", "Experimental Research", "Python", "PyTorch"],
        highlights: [
            "Bachelor’s/Master’s in Computer Science, AI/ML, Data Science, or related field; strong foundation in NLP, ML, LLMs, and experimental research",
            "Conduct research on LLMs and GenAI, execute experiments, build foundational components, and ensure ethical AI usage"
        ],
        description: "The AI Research Engineer will be a core part of the AI Center of Excellence (AICOE), responsible for driving research, experimentation, and prototyping. This role explores new AI techniques, evaluates feasibility, and builds foundational models and tools that will power Authbridge’s next-generation BGV and Risk Assurance products.",
        aboutCompany: "AuthBridge is Indias largest Authentication company, delivering cutting-edge technology and alternate data analysis for identity management, onboarding & verification, and business intelligence. With 1500+ clients across 30+ sectors, including Fortune 500 companies and unicorns, AuthBridge powers trust and risk management at scale.",
        benefits: [
            "Job/Soft skill training",
            "Cafeteria",
            "Health insurance",
            "Professional degree assistance",
            "Free meal",
            "Child care facility"
        ]
    },
    {
        id: "2",
        title: "Senior Frontend Engineer",
        company: "Acme Corp",
        logo: "/logos/acme.png",
        location: "Remote",
        type: "Full-time",
        salary: "$120k - $150k",
        postedAt: "2 days ago",
        tags: ["React", "TypeScript", "Next.js"],
        category: "Engineering",
        rating: 4.5,
        reviews: 120,
        experience: "5-7 Yrs",
        openings: 2,
        applicants: "500+",
        roleCategory: "Software Development",
        education: "B.Tech/B.E. in Computer Science",
        keySkills: ["React", "TypeScript", "Next.js", "Redux", "Tailwind CSS", "Web Performance", "Jest", "CI/CD"],
        highlights: [
            "Lead the frontend architecture for our core product using Next.js 14 and React Server Components",
            "Mentor junior developers, conduct code reviews, and drive best practices in code quality and performance",
            "Collaborate with product managers and designers to translate requirements into pixel-perfect, interactive UIs",
            "Optimize application performance to achieve 99+ Lighthouse scores"
        ],
        description: "Acme Corp is seeking a highly skilled Senior Frontend Engineer to lead our core product team. You will be responsible for building high-performance, scalable web applications using the latest technologies. As a senior member of the team, you will drive architectural decisions, mentor junior engineers, and ensure the delivery of a world-class user experience.",
        aboutCompany: "Acme Corp is a globally recognized innovator in cloud solutions, dedicated to empowering businesses with scalable and secure infrastructure. With a team of over 2,000 experts distributed worldwide, we are pushing the boundaries of what's possible in cloud computing. Our culture fosters innovation, continuous learning, and inclusivity.",
        benefits: [
            "100% Remote work flexibility",
            "Comprehensive Health, Dental, and Vision insurance",
            "Generous 401(k) matching",
            "Unlimited Paid Time Off (PTO)",
            "$2000 Annual Learning & Development budget",
            "Home office setup allowance"
        ]
    },
    {
        id: "3",
        title: "Product Designer",
        company: "Vercel",
        logo: "/logos/vercel.png",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$110k - $140k",
        postedAt: "1 day ago",
        tags: ["Figma", "UI/UX", "Prototyping"],
        category: "Design",
        rating: 4.8,
        reviews: 85,
        experience: "3-5 Yrs",
        openings: 1,
        applicants: "200+",
        roleCategory: "Design",
        description: "Join Vercel's design team to shape the future of the web. We are looking for a Product Designer with a strong visual eye and experience in building developer tools..."
    },
    {
        id: "4",
        title: "Backend Developer",
        company: "Stripe",
        logo: "/logos/stripe.png",
        location: "New York, NY",
        type: "Hybrid",
        salary: "$130k - $160k",
        postedAt: "4 hours ago",
        tags: ["Go", "PostgreSQL", "API"],
        category: "Engineering",
        rating: 4.7,
        reviews: 320,
        experience: "2-4 Yrs",
        openings: 3,
        applicants: "400+",
        description: "Stripe is building the economic infrastructure for the internet. We need a Backend Developer to help scale our payments platform and build robust APIs..."
    },
    {
        id: "5",
        title: "Marketing Manager",
        company: "Airbnb",
        logo: "/logos/airbnb.png",
        location: "Remote",
        type: "Contract",
        salary: "$80k - $100k",
        postedAt: "1 week ago",
        tags: ["SEO", "Content", "Social Media"],
        category: "Marketing",
        rating: 4.6,
        reviews: 1500,
        experience: "4-6 Yrs",
        description: "Airbnb is seeking a Marketing Manager to drive our global brand campaigns. You will work closely with cross-functional teams to tell our story..."
    },
    {
        id: "6",
        title: "Full Stack Engineer",
        company: "Zomato",
        logo: "/logos/zomato.png",
        location: "Gurugram, India",
        type: "Full-time",
        salary: "₹20L - ₹35L",
        postedAt: "1 day ago",
        tags: ["React", "Node.js", "MongoDB"],
        category: "Engineering",
        rating: 4.2,
        reviews: 2100,
        experience: "2-5 Yrs",
        description: "Zomato is connecting millions of users with great food. We are looking for a Full Stack Engineer to build scalable features for our ordering platform..."
    },
    {
        id: "7",
        title: "DevOps Engineer",
        company: "Flipkart",
        logo: "/logos/flipkart.png",
        location: "Bangalore, India",
        type: "Full-time",
        salary: "₹25L - ₹45L",
        postedAt: "3 days ago",
        tags: ["AWS", "Docker", "Kubernetes"],
        category: "Operations",
        rating: 4.3,
        reviews: 1800,
        experience: "3-6 Yrs",
        description: "Flipkart is India's leading e-commerce marketplace. Join our DevOps team to manage cloud infrastructure and ensure high availability for our services..."
    },
    {
        id: "8",
        title: "Technical Consultant",
        company: "Gaea",
        logo: "/logos/gaea.png",
        location: "Bengaluru, India",
        type: "Full Time, Permanent",
        salary: "Not Disclosed",
        postedAt: "Just now",
        tags: ["OIC", "Mulesoft", "SOA", "Java", "Consulting"],
        category: "Engineering",
        rating: 4.0,
        reviews: 42,
        experience: "3 - 8 years",
        openings: 5,
        applicants: "Less than 10",
        roleCategory: "IT Consulting",
        education: "UG: Any Graduate, PG: Any Postgraduate",
        keySkills: ["REST", "Project Management", "SOA", "Web Services", "OIC", "SOAP UI", "Engineering", "Integration Framework", "SQL", "PLSQL", "Technical Consulting", "Node.js", "Middleware Technologies", "Java", "Postman", "Mule ESB", "API", "Programming"],
        highlights: [
            "Strong expertise in web services using Java/node JS or integration middleware technologies i.e OIC/Mulesoft/SOA/etc",
            "Experience in enhancing Java functions within .xsl files is essential",
            "A strong understanding of REST and SOAP API, particularly using tools like POSTMAN and SOAP UI",
            "Willingness to travel at any time and to any location is mandatory"
        ],
        description: `Gaea is actively looking to attract and retain ambitious, knowledgeable and diligent individuals to join our dynamic team. This is an incredibly exciting time for our company. We're growing at a rapid pace and aim to disrupt the engineering, construction and project-intensive manufacturing industries with sound project management solutions and technology tools.

The ideal candidate should have strong knowledge and practical programming experience in any one of the Middleware technologies - OIC, Mulesoft, SOA or similar integration tools.

Key Responsibilities:
- Strong expertise in web services using Java/node JS or integration middleware technologies i.e OIC/Mulesoft/SOA/etc
- Experience in enhancing Java functions within .xsl files is essential.
- Ability to effectively prioritize tasks and meet project deadlines is crucial.
- Excellent written and verbal communication skills are necessary.
- Familiarity with additional integration frameworks is a plus.
- Must possess a dynamic mindset to adapt to various technologies.
- A strong understanding of REST and SOAP API, particularly using tools like POSTMAN and SOAP UI.
- Willingness to travel at any time and to any location is mandatory.
- Proven track record of delivering projects on time.
- Strong problem-solving skills and attention to detail are important.
- Ability to work collaboratively in a team-oriented environment is essential.`,
        aboutCompany: "Gaea engineers enterprise solutions for the most challenging project management and supply chain problems in every industry. And we do it with an intimate knowledge of the Oracle enterprise products that we helped pioneer along with considerable expertise in the industries we serve.",
        companySocials: {
            website: "https://gaeaglobal.com",
            linkedin: "https://linkedin.com/company/gaea",
            twitter: "https://twitter.com/gaea",
            facebook: "https://facebook.com/gaea"
        }
    }
]
