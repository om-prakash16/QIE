"use client"

import { motion } from "framer-motion"
import { ClipboardList, ExternalLink, CheckCircle2, Clock, XCircle, UserCheck, CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
    applied: { icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    shortlisted: { icon: UserCheck, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
    interview: { icon: CalendarDays, color: "text-violet-500", bg: "bg-violet-500/10 border-violet-500/20" },
    hired: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" },
}

const statuses = ["applied", "shortlisted", "interview", "hired"]

const mockApplications = [
    { id: "1", job_title: "Senior Solana Developer", company: "DeFi Labs", status: "shortlisted", applied_at: "2026-04-02", on_chain_tx: "5wK8xJr...", match_score: 94 },
    { id: "2", job_title: "Full-Stack Web3 Engineer", company: "CryptoVentures", status: "applied", applied_at: "2026-04-03", on_chain_tx: "3rJ9bTm...", match_score: 88 },
    { id: "3", job_title: "AI/ML Engineer — Web3", company: "Neural Protocol", status: "interview", applied_at: "2026-03-28", on_chain_tx: "7hZ2dQw...", match_score: 82 },
    { id: "4", job_title: "Rust Developer", company: "Solana Foundation", status: "hired", applied_at: "2026-03-15", on_chain_tx: "9kL4fRs...", match_score: 91 },
    { id: "5", job_title: "Smart Contract Auditor", company: "SecureChain", status: "rejected", applied_at: "2026-03-10", on_chain_tx: "2mN6gPq...", match_score: 76 },
]

export default function ApplicationsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-black font-heading tracking-tight flex items-center gap-3"
                >
                    <ClipboardList className="w-8 h-8 text-primary" />
                    Application Tracker
                </motion.h1>
                <p className="text-muted-foreground text-sm">Track every application with on-chain verification.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(statusConfig).map(([key, config]) => {
                    const count = mockApplications.filter(a => a.status === key).length
                    const Icon = config.icon
                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn("p-4 rounded-xl border text-center", config.bg)}
                        >
                            <Icon className={cn("w-5 h-5 mx-auto mb-2", config.color)} />
                            <div className="text-2xl font-black">{count}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground capitalize">{key}</div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Application Cards */}
            <div className="space-y-4">
                {mockApplications.map((app, i) => {
                    const config = statusConfig[app.status]
                    const Icon = config.icon
                    const currentStep = statuses.indexOf(app.status)

                    return (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold">{app.job_title}</h3>
                                    <p className="text-sm text-muted-foreground">{app.company} · Applied {app.applied_at}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={cn("text-[10px] font-bold uppercase tracking-wider capitalize", config.bg, config.color)}>
                                        <Icon className="w-3 h-3 mr-1" />{app.status}
                                    </Badge>
                                    <a
                                        href={`https://explorer.solana.com/tx/${app.on_chain_tx}?cluster=devnet`}
                                        target="_blank"
                                        className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
                                    >
                                        Verify <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>

                            {/* Status Stepper */}
                            {app.status !== "rejected" && (
                                <div className="flex items-center gap-1">
                                    {statuses.map((step, idx) => {
                                        const isCompleted = idx <= currentStep
                                        const isCurrent = idx === currentStep
                                        return (
                                            <div key={step} className="flex items-center flex-1">
                                                <div className={cn(
                                                    "flex-1 flex flex-col items-center gap-1.5",
                                                )}>
                                                    <div className={cn(
                                                        "w-3 h-3 rounded-full border-2 transition-all",
                                                        isCompleted ? "bg-primary border-primary" : "border-white/20 bg-transparent",
                                                        isCurrent && "ring-4 ring-primary/20"
                                                    )} />
                                                    <span className={cn(
                                                        "text-[9px] font-bold uppercase tracking-wider capitalize",
                                                        isCompleted ? "text-primary" : "text-muted-foreground/40"
                                                    )}>
                                                        {step}
                                                    </span>
                                                </div>
                                                {idx < statuses.length - 1 && (
                                                    <div className={cn(
                                                        "h-0.5 flex-1 rounded-full -mt-4",
                                                        idx < currentStep ? "bg-primary" : "bg-white/10"
                                                    )} />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {app.status === "rejected" && (
                                <div className="text-xs text-red-400/60 bg-red-500/5 rounded-xl p-3 border border-red-500/10">
                                    AI suggests: You were missing 2 key skills. Consider verifying &quot;Security Auditing&quot; and &quot;Formal Verification&quot;.
                                </div>
                            )}
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
