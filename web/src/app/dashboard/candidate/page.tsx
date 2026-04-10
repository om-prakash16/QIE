"use client"

import { useAuth } from "@/context/auth-context"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
    Trophy,
    Briefcase,
    Shield,
    FolderGit2,
    Gem,
    Brain,
    ArrowUpRight,
    TrendingUp,
    Sparkles,
    Zap,
    CloudSync,
    RefreshCw
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { SyncStatusBadge } from "@/components/blockchain/SyncStatusBadge"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

const statCards = [
    { label: "Reputation Score", value: "742", max: "/1000", icon: Trophy, color: "from-amber-500/20 to-amber-600/5", iconColor: "text-amber-500", href: "/dashboard/candidate/reputation" },
    { label: "Active Applications", value: "5", sub: "2 shortlisted", icon: Briefcase, color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-500", href: "/dashboard/candidate/applications" },
    { label: "Verified Skills", value: "4", sub: "NFTs minted", icon: Shield, color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-500", href: "/dashboard/candidate/skills" },
    { label: "Portfolio Projects", value: "6", sub: "Avg score: 88", icon: FolderGit2, color: "from-violet-500/20 to-violet-600/5", iconColor: "text-violet-500", href: "/dashboard/candidate/portfolio" },
    { label: "NFT Credentials", value: "7", sub: "1 Profile + 4 Skills", icon: Gem, color: "from-pink-500/20 to-pink-600/5", iconColor: "text-pink-500", href: "/dashboard/candidate/nfts" },
    { label: "AI Match Score", value: "92%", sub: "Top match: Rust Dev", icon: Brain, color: "from-cyan-500/20 to-cyan-600/5", iconColor: "text-cyan-500", href: "/dashboard/candidate/jobs" },
]

const quickActions = [
    { label: "Take Skill Quiz", href: "/dashboard/candidate/skills", icon: Shield },
    { label: "Edit Profile", href: "/dashboard/candidate/edit", icon: Zap },
    { label: "View Job Matches", href: "/dashboard/candidate/jobs", icon: Briefcase },
    { label: "AI Insights", href: "/dashboard/candidate/insights", icon: Brain },
]

const recentActivity = [
    { text: "Rust Skill NFT minted (Silver level)", time: "2h ago", type: "success" },
    { text: "Applied to 'Senior Solana Dev' at DeFi Labs", time: "5h ago", type: "info" },
    { text: "Portfolio project 'ZK Voting dApp' scored 89", time: "1d ago", type: "info" },
    { text: "Reputation score increased by +45 pts", time: "1d ago", type: "success" },
    { text: "Profile synced to blockchain (v3)", time: "2d ago", type: "neutral" },
]

export default function CandidateDashboard() {
    const { user } = useAuth()
    const [syncStatus, setSyncStatus] = useState<any>({ current_state: "not_initialized" })
    const [isSyncing, setIsSyncing] = useState(false)

    useEffect(() => {
        if (user?.id) {
            fetch(`${API}/sync/status/${user.id}`)
                .then(res => res.json())
                .then(data => setSyncStatus(data))
                .catch(err => console.error("Failed to fetch sync status", err))
        }
    }, [user?.id])

    const handleSyncRequest = async () => {
        if (!user?.id) return
        setIsSyncing(true)
        try {
            const res = await fetch(`${API}/sync/profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id })
            })
            const data = await res.json()
            setSyncStatus(data)
        } catch (err) {
            console.error("Sync request failed", err)
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black font-heading tracking-tight"
                    >
                        Welcome back{user?.name ? `, ${user.name}` : ""}
                    </motion.h1>
                    <p className="text-muted-foreground text-sm">
                        Your Best Hiring Tool dashboard — track your reputation, credentials, and career progress.
                    </p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md"
                >
                    <SyncStatusBadge status={syncStatus.current_state} />
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        disabled={isSyncing || syncStatus.current_state === 'synced'}
                        onClick={handleSyncRequest}
                        className="h-8 gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                    >
                        {isSyncing ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <CloudSync className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[10px] font-black uppercase">
                            {syncStatus.current_state === 'pending' ? 'Anchor to Chain' : 'Stage Metadata'}
                        </span>
                    </Button>
                </motion.div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <Link href={card.href}>
                            <div className={cn(
                                "group relative p-6 rounded-2xl border border-white/10 bg-gradient-to-br backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:shadow-lg cursor-pointer overflow-hidden",
                                card.color
                            )}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{card.label}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black tracking-tight">{card.value}</span>
                                            {card.max && <span className="text-sm text-muted-foreground font-medium">{card.max}</span>}
                                        </div>
                                        {card.sub && <p className="text-xs text-muted-foreground">{card.sub}</p>}
                                    </div>
                                    <div className={cn("p-3 rounded-xl bg-white/5 border border-white/10", card.iconColor)}>
                                        <card.icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <ArrowUpRight className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground/30 group-hover:text-foreground/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-1 p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-5"
                >
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Quick Actions</h2>
                    <div className="space-y-2">
                        {quickActions.map((action) => (
                            <Link key={action.href} href={action.href}>
                                <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                        <action.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-muted-foreground/30 group-hover:text-primary transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-5"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Recent Activity</h2>
                        <Sparkles className="w-4 h-4 text-primary/40" />
                    </div>
                    <div className="space-y-3">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                                <div className={cn(
                                    "w-2 h-2 rounded-full shrink-0",
                                    item.type === "success" ? "bg-emerald-500" :
                                    item.type === "info" ? "bg-blue-500" : "bg-muted-foreground/30"
                                )} />
                                <p className="text-sm flex-1">{item.text}</p>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
