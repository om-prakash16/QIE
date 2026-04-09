export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  industry: string;
  size: string;
  location: string;
  hiringStatus: "Actively Hiring" | "Not Hiring";
  openPositions: number;
  website: string;
  tags: string[];
}

export const INDUSTRIES = [
  "Software Engineering",
  "FinTech",
  "Web3 & Blockchain",
  "AI & Machine Learning",
  "Data Science",
  "E-commerce",
  "HealthTech",
  "Cybersecurity"
];

export const SIZES = [
  "1-50",
  "50-200",
  "200-500",
  "500-1000",
  "1000+"
];

export const COMPANIES: Company[] = [
  {
    id: "1",
    name: "Nexus Web3 Labs",
    description: "Building the next generation of decentralized infrastructure and cross-chain protocols.",
    industry: "Web3 & Blockchain",
    size: "50-200",
    location: "Zug, Switzerland (Remote)",
    hiringStatus: "Actively Hiring",
    openPositions: 12,
    website: "https://nexuslabs.io",
    tags: ["Rust", "Solana", "DeFi"]
  },
  {
    id: "2",
    name: "NeuralFlow AI",
    description: "Enterprise-grade LLM infrastructure and vector-base intelligence for modern SaaS.",
    industry: "AI & Machine Learning",
    size: "200-500",
    location: "San Francisco, CA",
    hiringStatus: "Actively Hiring",
    openPositions: 8,
    website: "https://neuralflow.ai",
    tags: ["Python", "PyTorch", "MLOps"]
  },
  {
    id: "3",
    name: "BitVault Security",
    description: "Cybersecurity solutions specializing in smart contract audits and wallet protection.",
    industry: "Cybersecurity",
    size: "1-50",
    location: "Berlin, Germany",
    hiringStatus: "Actively Hiring",
    openPositions: 4,
    website: "https://bitvault.sec",
    tags: ["Solidity", "Security", "Audit"]
  },
  {
    id: "4",
    name: "Quantis Fintech",
    description: "High-frequency trading platforms and decentralized exchange liquidity providers.",
    industry: "FinTech",
    size: "500-1000",
    location: "London, UK",
    hiringStatus: "Actively Hiring",
    openPositions: 25,
    website: "https://quantis.finance",
    tags: ["C++", "Low Latency", "Trading"]
  },
  {
    id: "5",
    name: "Sky Commerce",
    description: "Scaling global e-commerce with headless architecture and personalized AI discovery.",
    industry: "E-commerce",
    size: "1000+",
    location: "New York, NY",
    hiringStatus: "Not Hiring",
    openPositions: 0,
    website: "https://skycommerce.com",
    tags: ["Next.js", "GraphQL", "Scale"]
  }
];
