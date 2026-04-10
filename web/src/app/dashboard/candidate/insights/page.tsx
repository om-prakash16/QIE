"use client"

import { useState, useEffect } from "react"

import { motion } from "framer-motion"
import { Brain, FileText, Target, TrendingUp, GitBranch, Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import Link from "next/link"

const resumeAnalysis = {
    extracted_skills: ["Rust", "Solana", "TypeScript", "Next.js", "Python", "FastAPI"],
    experience_years: 5,
    roles: ["Full Stack Engineer", "Blockchain Developer"],
    education: ["B.S. Computer Science — MIT"],
    missing_market_skills: ["ZK Proofs", "Move Language", "Formal Verification"],
    recommended_skills: ["ZK Proofs", "Anchor Testing", "Security Auditing"],
}

const skillGaps = [
    { skill: "ZK Proofs", priority: "High", resources: ["zkSNARKs Tutorial", "Circom by Example"] },
    { skill: "Formal Verification", priority: "Medium", resources: ["Certora Guide", "K Framework Docs"] },
    { skill: "Move Language", priority: "Low", resources: ["Sui Move Docs", "Aptos Developer Guide"] },
]

const githubInsights = {
    total_repos: 28,
    languages: [
        { name: "Rust", score: 90, color: "bg-orange-500" },
        { name: "TypeScript", score: 82, color: "bg-blue-500" },
        { name: "Python", score: 75, color: "bg-green-500" },
        { name: "Solidity", score: 40, color: "bg-gray-500" },
    ],
    commit_frequency: "High",
    activity_score: 85,
}

const careerPath = [
    { milestone: "Senior Blockchain Developer", probability: "92%", timeline: "Current" },
    { milestone: "Lead Protocol Engineer", probability: "78%", timeline: "1-2 years" },
    { milestone: "VP of Engineering (Web3)", probability: "55%", timeline: "3-5 years" },
]

    const [skills, setSkills] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchSkills() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/skills`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("sp_token")}`
                    }
                })
                const data = await res.json()
                setSkills(data)
            } catch (err) {
                console.error("Failed to fetch skills", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSkills()
    }, [])

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
                    <Brain className="w-8 h-8 text-primary" />
                    AI Insights
                </motion.h1>
                <p className="text-muted-foreground text-sm">AI-powered analysis of your skills, career trajectory, and market positioning.</p>
            </div>

            {/* Resume Analysis */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-5">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Resume Analysis</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Verified Profile Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                            {isLoading ? (
                                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                            ) : skills.length > 0 ? (
                                skills.map(s => (
                                    <Badge key={s.id} className={cn(
                                        "text-[10px] gap-1",
                                        s.is_verified ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    )}>
                                        {s.is_verified ? "✓ " : "? "}{s.skill_name}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-[10px] text-muted-foreground italic">No skills added yet</p>
                            )}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Experience</span>
                        <p className="text-2xl font-black">{resumeAnalysis.experience_years} years</p>
                        <p className="text-xs text-muted-foreground">{resumeAnalysis.roles.join(" · ")}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Missing Market Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                            {resumeAnalysis.missing_market_skills.map(s => (
                                <Badge key={s} variant="destructive" className="text-[10px]">+ {s}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Skill Gap Analysis */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-5">
                <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Skill Gap & Learning Path</h2>
                </div>
                <div className="space-y-4">
                    {skillGaps.map((gap, i) => (
                        <div key={gap.skill} className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold">{gap.skill}</span>
                                    <Badge className={cn(
                                        "text-[9px] font-bold",
                                        gap.priority === "High" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                        gap.priority === "Medium" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    )}>
                                        {gap.priority} Priority
                                    </Badge>
                                </div>
                                <Link href="/dashboard/candidate/skills">
                                    <Button variant="outline" size="sm" className="text-xs rounded-lg border-white/10 gap-1">
                                        Manage Skills <ArrowRight className="w-3 h-3" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                Recommended: {gap.resources.join(", ")}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* GitHub Insights + Career Path */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* GitHub */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-5">
                    <div className="flex items-center gap-3">
                        <GitBranch className="w-5 h-5 text-primary" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">GitHub Score</h2>
                        <Badge className="ml-auto bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-bold">{githubInsights.activity_score}/100</Badge>
                    </div>
                    <div className="space-y-3">
                        {githubInsights.languages.map((lang) => (
                            <div key={lang.name} className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold">{lang.name}</span>
                                    <span className="text-muted-foreground">{lang.score}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        className={cn("h-full rounded-full", lang.color)}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${lang.score}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-xs text-muted-foreground pt-2">
                        {githubInsights.total_repos} repositories · {githubInsights.commit_frequency} commit frequency
                    </div>
                </motion.div>

                {/* Career Path */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-5">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Career Path Prediction</h2>
                    </div>
                    <div className="space-y-4">
                        {careerPath.map((step, i) => (
                            <div key={step.milestone} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm border",
                                    i === 0 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                    i === 1 ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                    "bg-violet-500/10 text-violet-500 border-violet-500/20"
                                )}>
                                    {step.probability}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{step.milestone}</p>
                                    <p className="text-[10px] text-muted-foreground">{step.timeline}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 pt-2">
                        <Sparkles className="w-3 h-3" />
                        <span>Predictions based on verified on-chain skills and market data</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
