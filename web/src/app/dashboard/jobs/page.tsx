"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Briefcase, MapPin, DollarSign, Sparkles, Search, Filter, ArrowUpRight, Clock, Loader2, Info, Brain } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api/api-client"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

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

    const { data: jobs, isLoading } = useQuery({
        queryKey: ["jobs", filter],
        queryFn: async () => {
            const userId = "pending" // Should be dynamic
            const data = await api.jobs.list()
            return Array.isArray(data) ? data : []
        }
    })

    const filtered = (jobs || [])
        .filter(job => {
            const matchScore = job.ai_match_percentage || 0
            if (search && !job.title.toLowerCase().includes(search.toLowerCase()) && !job.company?.name?.toLowerCase().includes(search.toLowerCase())) return false
            if (filter === "90+" && matchScore < 90) return false
            if (filter === "80+" && matchScore < 80) return false
            if (filter === "remote" && job.job_type !== "remote") return false
            return true
        })

    if (isLoading) {
        return (
            <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20">Syncing Proof Rankings...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-black px-3 py-1 border-primary/20 text-primary">Live Talent Network</Badge>
                </div>
                <div className="space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase italic"
                    >
                        Proof <span className="text-primary">Rankings</span>
                    </motion.h1>
                    <p className="text-muted-foreground text-sm max-w-xl">Every opportunity is weighted by your technical Proof Score. Discover roles where your verified skills have the highest resonance.</p>
                </div>
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
                        {f === "all" ? "All Jobs" : f === "remote" ? "Remote Only" : `${f} Proof`}
                    </Button>
                ))}
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
                {filtered.map((job, i) => {
                    const matchScore = job.ai_match_percentage || 0
                    return (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link href={`/dashboard/jobs/${job.id}`}>
                                <div className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
                                        {/* Match Score Badge */}
                                        <div className="flex flex-col items-center gap-1 shrink-0">
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 border",
                                                matchScore >= 90 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10 shadow-lg" :
                                                matchScore >= 80 ? "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/10 shadow-lg" :
                                                "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            )}>
                                                {matchScore}%
                                            </div>
                                            <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Proof</p>
                                        </div>

                                        {/* Job Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="text-xl font-black italic tracking-tight uppercase group-hover:text-primary transition-colors">{job.title}</h3>
                                                    <Badge variant="secondary" className="bg-white/5 border-white/10 text-[10px] font-black uppercase tracking-widest px-3">{job.job_type}</Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground font-medium italic">
                                                    <span className="flex items-center gap-1.5 text-white/50"><Briefcase className="w-3.5 h-3.5" />{job.companies?.name || "Global Tech"}</span>
                                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                                                    <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />{job.salary_range || "Competitive"}</span>
                                                    <span className="flex items-center gap-1.5 opacity-50"><Clock className="w-3.5 h-3.5" />Posted Recently</span>
                                                </div>
                                            </div>

                                            {/* AI Match Insight */}
                                            {job.match_reason && (
                                                <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 flex items-start gap-3">
                                                    <Brain className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    <p className="text-xs italic text-white/70 leading-relaxed font-medium">"{job.match_reason}"</p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 flex-wrap pt-1">
                                                {job.skills_required?.map((skill: string) => (
                                                    <Badge
                                                        key={skill}
                                                        variant="outline"
                                                        className="bg-white/5 border-white/5 text-[10px] font-bold tracking-tight px-3"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all ml-auto">
                                            <ArrowUpRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )
                })}
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
