"use client"

import { motion } from "framer-motion"
import { Trophy, TrendingUp, Award, Target, Zap, GitBranch, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

const reputationData = {
    total: 742,
    max: 1000,
    level: "Expert",
    percentile: 88,
    breakdown: [
        { label: "Skills Score", value: 82, weight: "30%", icon: Target, color: "bg-emerald-500" },
        { label: "Project Quality", value: 78.5, weight: "25%", icon: GitBranch, color: "bg-blue-500" },
        { label: "GitHub Score", value: 71, weight: "20%", icon: Zap, color: "bg-violet-500" },
        { label: "Job Success", value: 65, weight: "15%", icon: Briefcase, color: "bg-amber-500" },
        { label: "Web3 Activity", value: 45.5, weight: "10%", icon: Award, color: "bg-pink-500" },
    ],
    history: [620, 635, 648, 660, 672, 688, 695, 705, 710, 718, 725, 730, 735, 738, 742],
}

export default function ReputationPage() {
    const { total, max, level, percentile, breakdown, history } = reputationData
    const peakValue = Math.max(...history)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-primary" />
                    Reputation Dashboard
                </motion.h1>
                <p className="text-muted-foreground text-sm">Your composite proof-score across skills, projects, and blockchain activity.</p>
            </div>

            {/* Main Score Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 to-primary/[0.02] backdrop-blur-md"
            >
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Circular Score */}
                    <div className="relative w-48 h-48 shrink-0">
                        <svg className="w-48 h-48 -rotate-90" viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                            <motion.circle
                                cx="100" cy="100" r="85" fill="none" stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={`${(total / max) * 534} 534`}
                                initial={{ strokeDasharray: "0 534" }}
                                animate={{ strokeDasharray: `${(total / max) * 534} 534` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-5xl font-black tracking-tight"
                            >
                                {total}
                            </motion.span>
                            <span className="text-xs text-muted-foreground font-medium">/ {max}</span>
                        </div>
                    </div>

                    {/* Score Details */}
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                            <h2 className="text-2xl font-black">{level} Level</h2>
                            <p className="text-sm text-muted-foreground">
                                Top <span className="text-primary font-bold">{100 - percentile}%</span> of all candidates on the platform
                            </p>
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start text-sm text-emerald-500">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-bold">+45 pts this month</span>
                        </div>
                        <div className="flex gap-4 justify-center md:justify-start">
                            {["Rust Certified", "5+ Projects", "Web3 Active"].map(badge => (
                                <span key={badge} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Sub-Score Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-6"
            >
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Score Breakdown</h2>
                <div className="space-y-5">
                    {breakdown.map((item, i) => {
                        const Icon = item.icon
                        return (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.color + "/10")}>
                                            <Icon className={cn("w-4 h-4", item.color.replace("bg-", "text-"))} />
                                        </div>
                                        <span className="text-sm font-bold">{item.label}</span>
                                        <span className="text-[10px] text-muted-foreground/60 font-mono">({item.weight})</span>
                                    </div>
                                    <span className="text-sm font-black">{item.value}<span className="text-muted-foreground/40">/100</span></span>
                                </div>
                                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        className={cn("h-full rounded-full", item.color)}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                                    />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </motion.div>

            {/* Trend Sparkline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-4"
            >
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Score Trend (Last 15 Days)</h2>
                <div className="h-24 flex items-end gap-1">
                    {history.map((val, i) => (
                        <motion.div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t"
                            initial={{ height: 0 }}
                            animate={{ height: `${(val / peakValue) * 100}%` }}
                            transition={{ duration: 0.5, delay: 0.6 + i * 0.03 }}
                        />
                    ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground/40">
                    <span>15 days ago</span>
                    <span>Today</span>
                </div>
            </motion.div>
        </div>
    )
}
