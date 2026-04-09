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
                    { label: "Jobs Posted", value: stats?.jobs_posted ?? 0, icon: Briefcase, color: "text-blue-500" },
                    { label: "Total Applicants", value: stats?.total_applicants ?? 0, icon: Users, color: "text-emerald-500" },
                    { label: "Avg Match", value: `${stats?.avg_match_score ?? 0}%`, icon: Target, color: "text-amber-500" },
                    { label: "Time to Hire", value: `${stats?.time_to_hire_days ?? 0}d`, icon: ArrowUpRight, color: "text-violet-500" },
                ].map((s) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <s.icon className={cn("w-4 h-4", s.color)} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {s.label}
                            </span>
                        </div>
                        <p className="text-2xl font-black">{s.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Timeline */}
            <div className="space-y-3">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    Recent Recruiter Activity
                </h2>

                {events.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground text-sm">
                        No recruiter activity yet. Start by posting a job.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {events.map((event, i) => {
                            const Icon = EVENT_ICONS[event.event_type] || EVENT_ICONS.default
                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                                >
                                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                                        <Icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{event.description}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[9px] h-4 bg-white/5 border-white/10 text-muted-foreground">
                                                {event.event_type?.replace(/_/g, " ")}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50 shrink-0">
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
