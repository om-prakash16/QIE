export interface User {
    id: string
    name: string
    role: string
    avatar: string
    location: string
    experience: string
    skills: string[]
    bio: string
    verified: boolean
    github: string
    leetcode: string
    linkedin: string
    availability: "Immediate" | "15 Days" | "1 Month" | "Not Looking"
    college?: string
    company?: string
}

export const USERS: User[] = [
    {
        id: "1",
        name: "Aditya Sharma",
        role: "Senior Frontend Engineer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya",
        location: "Bangalore, India",
        experience: "5 Years",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
        bio: "Passionate about building performant and accessible web applications. Love working with modern UI stacks.",
        verified: true,
        github: "github.com/aditya-s",
        leetcode: "leetcode.com/aditya-s",
        linkedin: "linkedin.com/in/aditya-s",
        availability: "Immediate",
        company: "TechFlow",
        college: "IIT Bombay"
    },
    {
        id: "2",
        name: "Riya Patel",
        role: "Backend Developer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riya",
        location: "Mumbai, India",
        experience: "3 Years",
        skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "AWS"],
        bio: "Backend enthusiast focused on scalable architecture and microservices.",
        verified: true,
        github: "github.com/riya-p",
        leetcode: "leetcode.com/riya-p",
        linkedin: "linkedin.com/in/riya-p",
        availability: "1 Month",
        company: "FinServ",
        college: "BITS Pilani"
    },
    {
        id: "3",
        name: "Vikram Singh",
        role: "Full Stack Developer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
        location: "Hyderabad, India",
        experience: "4 Years",
        skills: ["React", "Node.js", "Python", "Django", "Docker"],
        bio: "Polyglot developer enjoying the full stack journey. Open source contributor.",
        verified: false,
        github: "github.com/vikram-s",
        leetcode: "leetcode.com/vikram-s",
        linkedin: "linkedin.com/in/vikram-s",
        availability: "15 Days",
        college: "IIIT Hyderabad"
    },
    {
        id: "4",
        name: "Sanya Gupta",
        role: "UI/UX Designer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanya",
        location: "Remote",
        experience: "2 Years",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "HTML/CSS"],
        bio: "Designing intuitive and beautiful user experiences. Bridging the gap between design and code.",
        verified: true,
        github: "github.com/sanya-g",
        leetcode: "",
        linkedin: "linkedin.com/in/sanya-g",
        availability: "Immediate",
        company: "DesignStudio",
        college: "NID"
    },
    {
        id: "5",
        name: "Arjun Kumar",
        role: "DevOps Engineer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
        location: "Pune, India",
        experience: "6 Years",
        skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Linux"],
        bio: "Automating everything. Infrastructure as Code advocate.",
        verified: true,
        github: "github.com/arjun-k",
        leetcode: "leetcode.com/arjun-k",
        linkedin: "linkedin.com/in/arjun-k",
        availability: "Not Looking",
        company: "CloudCorp",
        college: "NIT Trichy"
    },
    {
        id: "6",
        name: "Meera Reddy",
        role: "Data Scientist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
        location: "Bangalore, India",
        experience: "4 Years",
        skills: ["Python", "Pandas", "Scikit-Learn", "TensorFlow", "SQL"],
        bio: "Turning data into insights. AI/ML enthusiast.",
        verified: false,
        github: "github.com/meera-r",
        leetcode: "leetcode.com/meera-r",
        linkedin: "linkedin.com/in/meera-r",
        availability: "1 Month",
        company: "DataGen",
        college: "IISc Bangalore"
    },
    {
        id: "7",
        name: "Rohan Das",
        role: "Mobile Developer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
        location: "Gurgaon, India",
        experience: "3 Years",
        skills: ["Flutter", "Dart", "Firebase", "Android", "iOS"],
        bio: "Building cross-platform mobile apps with pixel-perfect UIs.",
        verified: true,
        github: "github.com/rohan-d",
        leetcode: "",
        linkedin: "linkedin.com/in/rohan-d",
        availability: "Immediate",
        college: "DTU"
    },
    {
        id: "8",
        name: "Kavita Joshi",
        role: "Software Engineer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita",
        location: "Noida, India",
        experience: "1 Year",
        skills: ["Java", "Spring Boot", "MySQL", "Hibernate", "REST APIs"],
        bio: "Fresh graduate eager to learn and build scalable backend systems.",
        verified: false,
        github: "github.com/kavita-j",
        leetcode: "leetcode.com/kavita-j",
        linkedin: "linkedin.com/in/kavita-j",
        availability: "Immediate",
        college: "VIT Vellore"
    }
]
