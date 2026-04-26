export type ProficiencyLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Skill {
  name: string;
  level: ProficiencyLevel;
  category?: string;
  is_verified?: boolean;
  proof_score?: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  logo?: string;
  type: "Full-time" | "Part-time" | "Contract" | "Freelance";
  startDate: string;
  endDate: string | "Present";
  description: string;
  skills?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  grade?: string;
  fieldOfStudy?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  link?: string;
  github?: string;
  thumbnail?: string;
}

export interface BasicInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio: string;
  location: string;
  title: string;
  avatar: string;
  completion: number;
  experienceLevel?: string;
  jobType?: string;
  languages?: string[];
  joinDate?: string;
}

export interface UserProfile {
  id: string;
  basic: BasicInfo;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  github: {
    username: string;
    repos: any[];
  };
  leetcode: {
    username: string;
    totalSolved: number;
    easy: number;
    medium: number;
    hard: number;
    ranking: number;
  };
  applications: any[];
  settings: {
    notifications: boolean;
    visibility: "Public" | "Private";
    theme: "light" | "dark" | "system";
  };
  ai_scores?: {
    skill_score: number;
    forensic_confidence: number;
    technical_score: number;
    proof_score: number;
  };
}
