export interface UserProfile {
    id: string
    basic: {
        firstName: string
        lastName: string
        email: string
        phone: string
        bio: string
        location: string
        title: string
        avatar: string
        completion: number
        experienceLevel: string
        jobType: string
        languages: string[]
        joinDate: string
    }
    skills: {
        name: string
        level: "Beginner" | "Intermediate" | "Advanced"
    }[]
    experience: {
        id: string
        company: string
        role: string
        type: string
        startDate: string
        endDate: string | "Present"
        description: string
        logo?: string // Company logo placeholder
    }[]
    education: {
        id: string
        institution: string
        degree: string
        year: string
        grade?: string
        logo?: string
    }[]
    projects: {
        id: string
        title: string
        description: string
        stack: string[]
        link?: string
        github?: string
        image?: string
    }[]
    github: {
        username: string
        repos: {
            name: string
            description: string
            stars: number
            language: string
            url: string
        }[]
    }
    leetcode: {
        username: string
        totalSolved: number
        easy: number
        medium: number
        hard: number
        ranking: number
    }
    applications: {
        id: string
        jobTitle: string
        company: string
        logo: string
        appliedDate: string
        status: "Applied" | "Shortlisted" | "Rejected" | "Hired"
    }[]
    settings: {
        notifications: boolean
        visibility: "Public" | "Private"
        theme: "light" | "dark" | "system"
    }
}

export const USER_PROFILE: UserProfile = {
    id: "1",
    basic: {
        firstName: "Alex",
        lastName: "Morgan",
        email: "alex.morgan@example.com",
        phone: "+1 (555) 123-4567",
        bio: "Full Stack Developer with 5 years of experience building scalable web applications. Passionate about clean code, performance optimization, and user experience.",
        location: "San Francisco, CA",
        title: "Senior Full Stack Developer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        completion: 85,
        experienceLevel: "Senior Level",
        jobType: "Full-time",
        languages: ["English", "Spanish", "French"],
        joinDate: "September 2018"
    },
    skills: [
        { name: "React", level: "Advanced" },
        { name: "TypeScript", level: "Advanced" },
        { name: "Node.js", level: "Advanced" },
        { name: "Next.js", level: "Advanced" },
        { name: "GraphQL", level: "Intermediate" },
        { name: "Docker", level: "Intermediate" },
        { name: "PostgreSQL", level: "Intermediate" },
        { name: "AWS", level: "Intermediate" },
        { name: "Python", level: "Beginner" },
        { name: "Go", level: "Beginner" }
    ],
    experience: [
        {
            id: "exp_1",
            company: "TechNova Solutions",
            role: "Senior Frontend Engineer",
            type: "Full-time",
            startDate: "Jan 2022",
            endDate: "Present",
            description: "Leading the frontend team in migrating legacy monolithic application to micro-frontends using Next.js. Improved site performance by 40% and established a comprehensive design system.",
            logo: "/logos/technova.png"
        },
        {
            id: "exp_2",
            company: "Creative Pulse",
            role: "Full Stack Developer",
            type: "Full-time",
            startDate: "Jun 2019",
            endDate: "Dec 2021",
            description: "Developed and maintained multiple e-commerce platforms for high-profile clients. Integrated payment gateways (Stripe, PayPal) and implemented real-time inventory management systems.",
            logo: "/logos/creative.png"
        },
        {
            id: "exp_3",
            company: "StartUp Inc",
            role: "Junior Web Developer",
            type: "Internship",
            startDate: "Jan 2019",
            endDate: "May 2019",
            description: "Assisted in building internal tools and dashboards using React and Redux. Collaborated with UX designers to implement responsive UI components.",
            logo: "/logos/startup.png"
        }
    ],
    education: [
        {
            id: "edu_1",
            institution: "University of California, Berkeley",
            degree: "Bachelor of Science in Computer Science",
            year: "2015 - 2019",
            grade: "3.8 GPA",
            logo: "/logos/ucb.png"
        }
    ],
    projects: [
        {
            id: "proj_1",
            title: "TaskMaster Pro",
            description: "A collaborative project management tool inspired by Trello and Jira. Features real-time updates via WebSockets, drag-and-drop kanban boards, and team analytics.",
            stack: ["Next.js", "Socket.io", "MongoDB", "Tailwind CSS"],
            link: "https://taskmaster-demo.com",
            github: "https://github.com/alexmorgan/taskmaster"
        },
        {
            id: "proj_2",
            title: "DevPortfolio Generator",
            description: "CLI tool that generates static portfolio sites for developers based on their GitHub profile. Parses pinned repositories and READMEs to build a showcase page.",
            stack: ["Node.js", "Commander.js", "EJS"],
            github: "https://github.com/alexmorgan/dev-portfolio-cli"
        }
    ],
    github: {
        username: "alexmorgan",
        repos: [
            {
                name: "nextjs-dashboard-starter",
                description: "A production-ready dashboard template using Next.js 14, Shadcn UI, and Recharts.",
                stars: 1240,
                language: "TypeScript",
                url: "https://github.com/alexmorgan/nextjs-dashboard-starter"
            },
            {
                name: "react-infinite-scroll",
                description: "Lightweight, headless infinite scroll hook for React applications.",
                stars: 856,
                language: "JavaScript",
                url: "https://github.com/alexmorgan/react-infinite-scroll"
            },
            {
                name: "algo-ds-typescript",
                description: "Collection of common algorithms and data structures implemented in TypeScript.",
                stars: 432,
                language: "TypeScript",
                url: "https://github.com/alexmorgan/algo-ds-typescript"
            }
        ]
    },
    leetcode: {
        username: "alex_code_wizard",
        totalSolved: 450,
        easy: 150,
        medium: 250,
        hard: 50,
        ranking: 15432
    },
    applications: [
        {
            id: "app_1",
            jobTitle: "Senior Frontend Engineer",
            company: "Acme Corp",
            logo: "/logos/acme.png",
            appliedDate: "2 days ago",
            status: "Applied"
        },
        {
            id: "app_2",
            jobTitle: "Product Engineer",
            company: "Linear",
            logo: "/logos/linear.png",
            appliedDate: "1 week ago",
            status: "Shortlisted"
        },
        {
            id: "app_3",
            jobTitle: "Software Engineer",
            company: "Airbnb",
            logo: "/logos/airbnb.png",
            appliedDate: "2 weeks ago",
            status: "Rejected"
        },
        {
            id: "app_4",
            jobTitle: "Full Stack Developer",
            company: "Netflix",
            logo: "/logos/netflix.png",
            appliedDate: "1 month ago",
            status: "Applied"
        }
    ],
    settings: {
        notifications: true,
        visibility: "Public",
        theme: "system"
    }
}
