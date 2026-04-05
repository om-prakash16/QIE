import { GithubRepo } from "./github-data";

export interface GithubAnalysisSection {
    title: string;
    content: string | string[];
    type: "text" | "list" | "tags" | "recommendation";
}

export interface GithubAnalysisReport {
    executiveSummary: string;
    technicalStrengths: string[];
    architectureSignals: {
        label: string;
        value: string;
        description: string;
    }[];
    roleFit: {
        bestFitRole: string;
        seniority: string;
        environment: string;
    };
    notableProjects: {
        id: string;
        name: string;
        reason: string;
    }[];
    growthRecommendations: string[];
}

export const MOCK_GITHUB_ANALYSIS: GithubAnalysisReport = {
    executiveSummary: "A highly versatile Senior Full-Stack Engineer with strong production-grade expertise in the React ecosystem and cloud-native backends. Demonstrates architect-level understanding of microservices (Docker/Kubernetes), mobile development (Swift/Kotlin), and AI integration (TensorFlow). The portfolio reflects a 'Builder' mindset with a focus on developer tooling and scalable architecture.",
    technicalStrengths: [
        "Modern Web Architecture (Next.js, React, Tailwind, GraphQL)",
        "Cloud-Native DevOps (Docker, Kubernetes, AWS Lambda, Serverless)",
        "Systems Programming (Go, Rust) & Performance Optimization",
        "Applied Machine Learning (TensorFlow, Computer Vision)",
        "Mobile Development (SwiftUI, Kotlin)"
    ],
    architectureSignals: [
        {
            label: "System Design",
            value: "Microservices-Ready",
            description: "Evidence of decoupled services (Docker, Go-Fiber) and event-driven patterns."
        },
        {
            label: "Frontend",
            value: "Component-Driven",
            description: "Strong usage of design tokens, reusable UI kits, and headless hooks."
        },
        {
            label: "Focus",
            value: "Production-First",
            description: "Repositories emphasize 'production-ready', 'boilerplate', and 'best practices'."
        }
    ],
    roleFit: {
        bestFitRole: "Senior Full-Stack Engineer / Technical Lead",
        seniority: "Senior to Staff Level",
        environment: "High-growth startups or Platform Engineering teams needing versatility."
    },
    notableProjects: [
        {
            id: "3",
            name: "algo-ds-python",
            reason: "High community validation (2.1k⭐) indicating strong foundational CS knowledge."
        },
        {
            id: "1",
            name: "nextjs-dashboard",
            reason: "Demonstrates capability to build polished, complex business applications."
        },
        {
            id: "7",
            name: "tensorflow-vision",
            reason: "Shows advanced domain expertise beyond typical web engineering."
        }
    ],
    growthRecommendations: [
        "Focus on system design documentation to showcase architectural decision-making processes.",
        "Contribute to major open-source frameworks to increase visibility beyond personal tooling.",
        "Formalize the 'Polyglot' capability by building a unified project integrating Rust/Go backend with React frontend."
    ]
};
