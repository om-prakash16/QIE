"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Briefcase, MapPin, DollarSign, Sparkles, Search, Filter, ArrowUpRight, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8011/api/v1"

const mockJobs = [
    {
        id: "1",
        title: "Senior Solana Developer",
        company: "DeFi Labs",
        location: "Remote",
        salary_range: "$120k-$180k",
        job_type: "full-time",
        required_skills: ["Rust", "Solana", "Anchor", "TypeScript"],
        match_score: 94,
        missing_skills: ["Anchor testing"],
        posted: "2d ago"
    },
    {
        id: "2",
        title: "Full-Stack Web3 Engineer",
        company: "CryptoVentures",
        location: "New York, NY",
        salary_range: "$130k-$170k",
        job_type: "full-time",
        required_skills: ["React", "Next.js", "Solana", "Rust"],
        match_score: 88,
        missing_skills: ["Move language"],
        posted: "5d ago"
    },
    {
        id: "3",
        title: "Rust Smart Contract Auditor",
        company: "SecureChain",
        location: "Remote",
        salary_range: "$140k-$200k",
        job_type: "contract",
        required_skills: ["Rust", "Security", "Anchor", "Formal Verification"],
        match_score: 76,
        missing_skills: ["Formal Verification", "Security auditing"],
        posted: "1w ago"
    },
    {
        id: "4",
        title: "AI/ML Engineer — Web3",
        company: "Neural Protocol",
        location: "San Francisco, CA",
        salary_range: "$150k-$220k",
        job_type: "full-time",
        required_skills: ["Python", "LangChain", "FastAPI", "Solana"],
        match_score: 82,
        missing_skills: ["PyTorch"],
        posted: "3d ago"
    },
    {
        id: "5",
        title: "Next.js Frontend Lead",
        company: "Web3 Studio",
        location: "Remote",
        salary_range: "$100k-$150k",
        job_type: "full-time",
        required_skills: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
        match_score: 96,
        missing_skills: [],
        posted: "1d ago"
    },
]

export default function JobListingsPage() {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState<"all" | "90+" | "80+" | "remote">("all")

    const filtered = mockJobs
        .filter(job => {
            if (search && !job.title.toLowerCase().includes(search.toLowerCase()) && !job.company.toLowerCase().includes(search.toLowerCase())) return false
            if (filter === "90+" && job.match_score < 90) return false
            if (filter === "80+" && job.match_score < 80) return false
            if (filter === "remote" && job.location !== "Remote") return false
            return true
        })
        .sort((a, b) => b.match_score - a.match_score)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-black font-heading tracking-tight flex items-center gap-3"
                >
                    <Briefcase className="w-8 h-8 text-primary" />
                    AI Job Matches
                </motion.h1>
                <p className="text-muted-foreground text-sm">Jobs ranked by AI compatibility with your verified skill profile.</p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search jobs or companies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-11 h-12 bg-white/5 border-white/10 rounded-xl"
                    />
                </div>
                {(["all", "90+", "80+", "remote"] as const).map(f => (
                    <Button
                        key={f}
                        variant={filter === f ? "default" : "outline"}
                        onClick={() => setFilter(f)}
                        className={cn("rounded-xl h-12 font-medium capitalize", filter !== f && "border-white/10 bg-white/5")}
                    >
                        {f === "all" ? "All Jobs" : f === "remote" ? "Remote Only" : `${f} Match`}
                    </Button>
                ))}
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
                {filtered.map((job, i) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                    >
                        <Link href={`/dashboard/candidate/jobs/${job.id}`}>
                            <div className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:border-white/20 hover:shadow-lg transition-all cursor-pointer">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    {/* Match Score Badge */}
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 border",
                                        job.match_score >= 90 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                        job.match_score >= 80 ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    )}>
                                        {job.match_score}%
                                    </div>

                                    {/* Job Info */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">{job.job_type}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.company}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                                            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{job.salary_range}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.posted}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap pt-1">
                                            {job.required_skills.map(skill => (
                                                <Badge
                                                    key={skill}
                                                    variant={job.missing_skills.includes(skill) ? "destructive" : "secondary"}
                                                    className={cn(
                                                        "text-[10px] font-bold",
                                                        !job.missing_skills.includes(skill) && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    )}
                                                >
                                                    {job.missing_skills.includes(skill) && "✗ "}{skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <ArrowUpRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-all shrink-0" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <Sparkles className="w-8 h-8 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">No jobs match your current filters.</p>
                </div>
            )}
        </div>
    )
}
