import { UserProfile } from "@/types/profile";

export const USER_PROFILE: UserProfile = {
  id: "u-999",
  basic: {
    firstName: "Om",
    lastName: "Prakash",
    email: "om@skillsutra.com",
    phone: "+91 9876543210",
    title: "Full Stack AI Architect",
    avatar: "/avatars/user-999.png",
    location: "Bengaluru, IN",
    experienceLevel: "Senior",
    completion: 100,
    bio: "Building the future of decentralized hiring.",
    jobType: "Full-time",
    languages: ["English", "Hindi"],
    joinDate: "2024-01-01"
  },
  skills: [
    { name: "Next.js", level: "Expert" },
    { name: "FastAPI", level: "Advanced" },
    { name: "Solana", level: "Intermediate" },
    { name: "Gemini AI", level: "Advanced" }
  ],
  experience: [],
  education: [],
  projects: [],
  github: { username: "om-prakash", repos: [] },
  leetcode: { username: "omprakash", totalSolved: 500, easy: 100, medium: 300, hard: 100, ranking: 1000 },
  applications: [],
  settings: {
    notifications: true,
    visibility: "Public",
    theme: "dark"
  }
};

export type { UserProfile };
