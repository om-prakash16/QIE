"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Activity, Users, Building2, Briefcase, BarChart3,
    Clock, Shield, Loader2, Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api/api-client"

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

const ROLE_COLORS: Record<string, string> = {
    user: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    company: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    admin: "bg-violet-500/10 text-violet-500 border-violet-500/20",
}

export default function AdminActivityPage() {
    const [events, setEvents] = useState<any[]>([])
    const [totals, setTotals] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const load = async () => {
        try {
            const [timeline, insights] = await Promise.all([
                api.activity.admin(50),
                api.analytics.admin(),
            ])
            setEvents(Array.isArray(timeline) ? timeline : [])
            setTotals(insights?.totals)
        } catch (err) {
            console.error("[admin-activity] load failed:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
        const interval = setInterval(load, 15000)
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
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h1 className="text-4xl font-black font-heading tracking-tight flex items-center gap-4">
                    <BarChart3 className="w-9 h-9 text-primary" />
                    Platform Activity
                </h1>
                <p className="text-muted-foreground text-sm">
                    Live system-wide event stream. Refreshes every 15 seconds.
                </p>
            </div>

            {/* Platform totals */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Users", value: totals?.users ?? 0, icon: Users, color: "text-blue-500" },
                    { label: "Companies", value: totals?.companies ?? 0, icon: Building2, color: "text-emerald-500" },
                    { label: "Jobs", value: totals?.jobs ?? 0, icon: Briefcase, color: "text-amber-500" },
                    { label: "Applications", value: totals?.applications ?? 0, icon: Zap, color: "text-violet-500" },
                    { label: "Events", value: totals?.events ?? 0, icon: Activity, color: "text-rose-500" },
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

            {/* Global event stream */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Live Event Stream
                    </h2>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground text-sm">
                        No events recorded yet.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {events.map((event, i) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.02 }}
                                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                            >
                                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                                    <Shield className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{event.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[9px] h-4 font-bold",
                                                ROLE_COLORS[event.actor_role] || "bg-white/5 text-muted-foreground border-white/10"
                                            )}
                                        >
                                            {event.actor_role}
                                        </Badge>
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
