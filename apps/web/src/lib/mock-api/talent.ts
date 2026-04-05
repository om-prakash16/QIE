
export interface Talent {
    id: string
    name: string
    title: string
    role: string // keeping role for filtering if title differs, or just map title=role
    avatar: string
    location: string
    experience: string
    experienceLevel: string // Junior, Senior etc for filtering
    skills: string[]
    availability: "Immediate" | "15 Days" | "1 Month" | "Not Looking"
    completion: number
    verified: boolean
}

export const TALENT_DATA: Talent[] = [
    {
        id: "1",
        name: "Aditya Sharma",
        title: "Senior Frontend Engineer",
        role: "Frontend",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya",
        location: "Bangalore, India",
        experience: "5 Years",
        experienceLevel: "Senior",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
        availability: "Immediate",
        completion: 95,
        verified: true,
    },
    {
        id: "2",
        name: "Riya Patel",
        title: "Backend Developer",
        role: "Backend",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riya",
        location: "Mumbai, India",
        experience: "3 Years",
        experienceLevel: "Mid-Level",
        skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "AWS"],
        availability: "1 Month",
        completion: 88,
        verified: true,
    },
    {
        id: "3",
        name: "Vikram Singh",
        title: "Full Stack Developer",
        role: "Full Stack",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
        location: "Hyderabad, India",
        experience: "4 Years",
        experienceLevel: "Mid-Level",
        skills: ["React", "Node.js", "Python", "Django", "Docker"],
        availability: "15 Days",
        completion: 75,
        verified: false,
    },
    {
        id: "4",
        name: "Sanya Gupta",
        title: "UI/UX Designer",
        role: "Design",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanya",
        location: "Remote",
        experience: "2 Years",
        experienceLevel: "Junior",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
        availability: "Immediate",
        completion: 92,
        verified: true,
    },
    {
        id: "5",
        name: "Arjun Kumar",
        title: "DevOps Engineer",
        role: "DevOps",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
        location: "Pune, India",
        experience: "6 Years",
        experienceLevel: "Senior",
        skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Linux"],
        availability: "Not Looking",
        completion: 100,
        verified: true,
    },
    {
        id: "6",
        name: "Meera Reddy",
        title: "Data Scientist",
        role: "Data",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
        location: "Bangalore, India",
        experience: "4 Years",
        experienceLevel: "Mid-Level",
        skills: ["Python", "Pandas", "Scikit-Learn", "TensorFlow", "SQL"],
        availability: "1 Month",
        completion: 85,
        verified: false,
    },
    {
        id: "7",
        name: "Rohan Das",
        title: "Mobile Developer",
        role: "Mobile",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
        location: "Gurgaon, India",
        experience: "3 Years",
        experienceLevel: "Mid-Level",
        skills: ["Flutter", "Dart", "Firebase", "Android", "iOS"],
        availability: "Immediate",
        completion: 78,
        verified: true,
    },
    {
        id: "8",
        name: "Kavita Joshi",
        title: "Junior Software Engineer",
        role: "Backend",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita",
        location: "Noida, India",
        experience: "1 Year",
        experienceLevel: "Fresher",
        skills: ["Java", "Spring Boot", "MySQL", "Hibernate"],
        availability: "Immediate",
        completion: 60,
        verified: false,
    }
]
