"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Activity, Users, Briefcase, Target, Clock,
    ArrowUpRight, Loader2, UserCheck, FileSearch,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api/api-client"

const EVENT_ICONS: Record<string, any> = {
    created_job: Briefcase,
    viewed_profile: FileSearch,
    shortlisted: UserCheck,
    hired: Target,
    default: Activity,
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

export default function CompanyActivityPage() {
    const [events, setEvents] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const load = async () => {
        try {
            const [timeline, insights] = await Promise.all([
                api.activity.company(30),
                api.analytics.company(),
            ])
            setEvents(Array.isArray(timeline) ? timeline : [])
            setStats(insights)
        } catch (err) {
            console.error("[activity] company load failed:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
        const interval = setInterval(load, 30000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-black font-heading tracking-tight flex items-center gap-3"
                >
                    <Activity className="w-8 h-8 text-primary" />
                    Recruiter Activity
                </motion.h1>
                <p className="text-muted-foreground text-sm">
                    Track your hiring pipeline and candidate engagement in real time.
                </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Jobs Posted", value: stats?.jobs_posted ?? 0, icon: Briefcase, color: "text-blue-400", glow: "group-hover:shadow-blue-500/20" },
                    { label: "Total Applicants", value: stats?.total_applicants ?? 0, icon: Users, color: "text-emerald-400", glow: "group-hover:shadow-emerald-500/20" },
                    { label: "Avg Match", value: `${stats?.avg_match_score ?? 0}%`, icon: Target, color: "text-amber-400", glow: "group-hover:shadow-amber-500/20" },
                    { label: "Time to Hire", value: `${stats?.time_to_hire_days ?? 0}d`, icon: ArrowUpRight, color: "text-violet-400", glow: "group-hover:shadow-violet-500/20" },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] transition-all duration-300 hover:border-white/20"
                    >
                        <div className={cn("absolute inset-0 rounded-2xl transition-shadow duration-300", s.glow)} />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className={cn("p-1.5 rounded-lg bg-white/5", s.color)}>
                                    <s.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                                    {s.label}
                                </span>
                            </div>
                            <p className="text-3xl font-black tracking-tight">{s.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
                        Hiring Timeline
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-20 rounded-3xl border border-dashed border-white/5 bg-white/[0.01]">
                        <p className="text-muted-foreground text-sm font-medium">
                            No recruitment activity recorded yet.
                        </p>
                    </div>
                ) : (
                    <div className="relative space-y-3 before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-primary/20 before:via-primary/5 before:to-transparent">
                        {events.map((event, i) => {
                            const Icon = EVENT_ICONS[event.event_type] || EVENT_ICONS.default
                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="group relative flex items-start gap-5 p-4 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all duration-200"
                                >
                                    <div className="relative z-10 p-2.5 rounded-xl bg-background border border-white/10 group-hover:border-primary/50 transition-colors shrink-0 shadow-xl">
                                        <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1">
                                        <p className="text-sm font-bold text-foreground/90 group-hover:text-foreground transition-colors leading-snug">
                                            {event.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider h-4 bg-white/5 border-white/10 text-muted-foreground/70 group-hover:text-primary group-hover:border-primary/30 transition-all">
                                                {event.event_type?.replace(/_/g, " ")}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40 shrink-0 pt-1.5">
                                        <Clock className="w-3 h-3" />
                                        {timeAgo(event.created_at)}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
