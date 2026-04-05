export interface GithubRepo {
    id: string
    name: string
    description: string
    language: string
    stars: number
    forks: number
    updatedAt: string
    url: string
    isPublic: boolean
}

export const MOCK_GITHUB_REPOS: GithubRepo[] = [
    {
        id: "1",
        name: "nextjs-dashboard",
        description: "A production-ready dashboard template using Next.js 14, Shadcn UI, and Recharts.",
        language: "TypeScript",
        stars: 1240,
        forks: 340,
        updatedAt: "2024-03-10T14:30:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "2",
        name: "react-infinite-scroll",
        description: "Lightweight, headless infinite scroll hook for React applications.",
        language: "JavaScript",
        stars: 890,
        forks: 120,
        updatedAt: "2024-02-15T09:15:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "3",
        name: "algo-ds-python",
        description: "Collection of common algorithms and data structures implemented in Python.",
        language: "Python",
        stars: 2100,
        forks: 550,
        updatedAt: "2024-03-05T18:20:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "4",
        name: "docker-microservices",
        description: "Example microservices architecture using Docker Compose and Kubernetes.",
        language: "Dockerfile",
        stars: 760,
        forks: 230,
        updatedAt: "2024-01-20T11:45:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "5",
        name: "go-fiber-api",
        description: "High-performance REST API starter kit using Go and Fiber.",
        language: "Go",
        stars: 430,
        forks: 85,
        updatedAt: "2024-03-11T10:00:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "6",
        name: "personal-portfolio-v3",
        description: "My personal developer portfolio built with Astro and Tailwind CSS.",
        language: "TypeScript",
        stars: 150,
        forks: 45,
        updatedAt: "2024-03-12T08:00:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "7",
        name: "tensorflow-vision",
        description: "Computer vision models implemented with TensorFlow 2.0.",
        language: "Python",
        stars: 1800,
        forks: 400,
        updatedAt: "2023-12-10T15:30:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "8",
        name: "rust-cli-tools",
        description: "A collection of useful CLI tools written in Rust.",
        language: "Rust",
        stars: 320,
        forks: 60,
        updatedAt: "2024-02-28T14:15:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "9",
        name: "swift-ios-kit",
        description: "Reusable UI components for iOS development using SwiftUI.",
        language: "Swift",
        stars: 240,
        forks: 50,
        updatedAt: "2024-01-05T16:00:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "10",
        name: "vue-admin-panel",
        description: "Admin panel template built with Vue 3 and Vite.",
        language: "Vue",
        stars: 560,
        forks: 140,
        updatedAt: "2024-02-10T11:30:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "11",
        name: "node-express-auth",
        description: "Authentication service boilerplate using Node.js, Express, and JWT.",
        language: "JavaScript",
        stars: 480,
        forks: 110,
        updatedAt: "2024-03-01T09:45:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "12",
        name: "aws-lambda-serverless",
        description: "Serverless implementation patterns on AWS.",
        language: "TypeScript",
        stars: 670,
        forks: 190,
        updatedAt: "2024-02-25T13:20:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "13",
        name: "kotlin-android-utils",
        description: "Utility extensions for Android development with Kotlin.",
        language: "Kotlin",
        stars: 210,
        forks: 40,
        updatedAt: "2024-01-15T10:10:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "14",
        name: "graphql-apollo-server",
        description: "GraphQL server setup with Apollo and Prisma.",
        language: "TypeScript",
        stars: 390,
        forks: 80,
        updatedAt: "2024-03-08T15:00:00Z",
        url: "#",
        isPublic: true
    },
    {
        id: "15",
        name: "design-system-figma",
        description: "Code output matching the Figma design system.",
        language: "CSS",
        stars: 180,
        forks: 30,
        updatedAt: "2023-11-20T12:00:00Z",
        url: "#",
        isPublic: true
    }
]
