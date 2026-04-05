"use client"

import { use } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MapPin, DollarSign, Briefcase, Clock, Shield, ArrowLeft, Send, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import { useParams } from "next/navigation"

const mockJobDetails: Record<string, any> = {
    "1": {
        title: "Senior Solana Developer",
        company: "DeFi Labs",
        location: "Remote",
        salary_range: "$120k-$180k",
        job_type: "full-time",
        match_score: 94,
        posted: "2 days ago",
        description: "We're looking for an experienced Solana developer to join our core protocol team. You'll be responsible for designing and implementing smart contracts for our next-generation DeFi platform, working closely with our research team on novel yield optimization strategies.",
        responsibilities: [
            "Design and implement Anchor smart contracts for DeFi protocols",
            "Optimize on-chain program performance and minimize compute costs",
            "Collaborate with frontend team on seamless wallet integration",
            "Conduct code reviews and security audits",
            "Contribute to protocol documentation and developer guides",
        ],
        required_skills: ["Rust", "Solana", "Anchor", "TypeScript"],
        nice_to_have: ["DeFi protocols", "Security auditing", "Zero-knowledge proofs"],
        missing_skills: ["Anchor testing"],
        benefits: ["Fully remote", "Token allocation", "Unlimited PTO", "Learning budget"],
    },
    "2": { title: "Full-Stack Web3 Engineer", company: "CryptoVentures", location: "New York, NY", salary_range: "$130k-$170k", job_type: "full-time", match_score: 88, posted: "5 days ago", description: "Build the future of decentralized finance.", responsibilities: ["Build full-stack dApps"], required_skills: ["React", "Next.js", "Solana", "Rust"], nice_to_have: [], missing_skills: ["Move language"], benefits: ["Hybrid work"] },
    "3": { title: "Rust Smart Contract Auditor", company: "SecureChain", location: "Remote", salary_range: "$140k-$200k", job_type: "contract", match_score: 76, posted: "1 week ago", description: "Audit smart contracts for security vulnerabilities.", responsibilities: ["Security audits"], required_skills: ["Rust", "Security", "Anchor", "Formal Verification"], nice_to_have: [], missing_skills: ["Formal Verification", "Security auditing"], benefits: ["Remote"] },
    "4": { title: "AI/ML Engineer — Web3", company: "Neural Protocol", location: "San Francisco, CA", salary_range: "$150k-$220k", job_type: "full-time", match_score: 82, posted: "3 days ago", description: "Apply AI to Web3.", responsibilities: ["Build AI models"], required_skills: ["Python", "LangChain", "FastAPI", "Solana"], nice_to_have: [], missing_skills: ["PyTorch"], benefits: ["Office perks"] },
    "5": { title: "Next.js Frontend Lead", company: "Web3 Studio", location: "Remote", salary_range: "$100k-$150k", job_type: "full-time", match_score: 96, posted: "1 day ago", description: "Lead the frontend team.", responsibilities: ["Lead frontend"], required_skills: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"], nice_to_have: [], missing_skills: [], benefits: ["Remote", "Equity"] },
}

export default function JobDetailPage() {
    const params = useParams()
    const id = params?.id as string
    const job = id ? mockJobDetails[id] : null
    const [applying, setApplying] = useState(false)

    if (!job) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <p>Job not found.</p>
                <Link href="/dashboard/candidate/jobs">
                    <Button variant="outline" className="mt-4">Back to Jobs</Button>
                </Link>
            </div>
        )
    }

    const handleApply = () => {
        setApplying(true)
        setTimeout(() => {
            setApplying(false)
            toast.success("Application submitted! On-chain record will be created.")
        }, 1500)
    }

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Back Link */}
            <Link href="/dashboard/candidate/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />Back to Job Matches
            </Link>

            {/* Job Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black font-heading tracking-tight">{job.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salary_range}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.posted}</span>
                        </div>
                    </div>
                    <div className={cn(
                        "w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 border",
                        job.match_score >= 90 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        job.match_score >= 80 ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                        <span className="text-2xl">{job.match_score}%</span>
                        <span className="text-[8px] uppercase tracking-wider opacity-60">match</span>
                    </div>
                </div>

                {/* Apply Button */}
                <Button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-black rounded-xl h-14 text-lg gap-3"
                >
                    <Send className={`w-5 h-5 ${applying ? "animate-bounce" : ""}`} />
                    {applying ? "Submitting Application..." : "Apply Now"}
                </Button>
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">About the Role</h2>
                <p className="text-sm leading-relaxed">{job.description}</p>
            </motion.div>

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Responsibilities</h2>
                    <ul className="space-y-2">
                        {job.responsibilities.map((r: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                {r}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Skills Assessment */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Skill Assessment
                </h2>
                <div className="flex flex-wrap gap-2">
                    {job.required_skills?.map((skill: string) => (
                        <Badge
                            key={skill}
                            variant={job.missing_skills?.includes(skill) ? "destructive" : "secondary"}
                            className={cn(
                                "text-xs font-bold px-3 py-1",
                                !job.missing_skills?.includes(skill) && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            )}
                        >
                            {job.missing_skills?.includes(skill) ? "✗ " : "✓ "}{skill}
                        </Badge>
                    ))}
                </div>
                {job.missing_skills?.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-amber-500/80 pt-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Take AI skill quizzes to verify missing skills and boost your match score.</span>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
