"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, CheckCircle2, XCircle, Plus, FileText, ArrowRight, Loader2, Sparkles, TrendingUp, Activity as ActivityIcon, Brain } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api/api-client"

export default function CompanyDashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [activity, setActivity] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsData, activityData] = await Promise.all([
                    api.analytics.company(),
                    api.activity.company(10)
                ])
                setStats(analyticsData)
                setActivity(Array.isArray(activityData) ? activityData : [])
            } catch (err) {
                console.error("Failed to load company stats", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    if (isLoading) {
        return (
            <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20">Initializing Neural Pipeline...</p>
            </div>
        )
    }

    const statCards = [
        { label: "Active Nodes", value: stats?.jobs_posted || 0, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", sub: "Live job orchestrations" },
        { label: "Talent Stream", value: stats?.total_applicants || 0, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10", sub: "Unique candidate matchings" },
        { label: "Resonance Avg", value: `${stats?.avg_match_score || 0}%`, icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10", sub: "Average candidate fit" },
        { label: "Hiring Velocity", value: `${stats?.time_to_hire_days || 0}d`, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", sub: "Avg days to synthesize hire" },
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase italic">Recruiter <span className="text-primary">Hub</span></h1>
                    <p className="text-muted-foreground text-sm max-w-xl italic">Orchestrate your talent pipeline with AI-driven matching and real-time status telemetry.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/company/jobs">
                        <Button variant="outline" className="border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-[10px] h-12 px-6">
                            Manage Pulse
                        </Button>
                    </Link>
                    <Link href="/company/jobs/create">
                        <Button className="gap-3 font-black uppercase tracking-widest text-[10px] h-12 px-6 shadow-xl shadow-primary/20 transition-transform active:scale-95">
                            <Plus className="w-4 h-4" />
                            Post New Job
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden backdrop-blur-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                {stat.label}
                            </CardTitle>
                            <div className={cn("p-2 rounded-xl border border-white/5", stat.bg)}>
                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="text-3xl font-black tracking-tighter text-white">{stat.value}</div>
                            <p className="text-[9px] text-white/20 mt-1 font-medium">{stat.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Recent Activity */}
                <Card className="col-span-2 bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-black uppercase italic tracking-tight">Signal Stream</CardTitle>
                            <ActivityIcon className="w-4 h-4 text-primary/40" />
                        </div>
                        <CardDescription className="text-xs">Immutable chronological record of platform interactions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {activity.length === 0 ? (
                                <div className="text-center py-10 text-white/20 text-xs italic">No active signals detected.</div>
                            ) : activity.map((item, idx) => (
                                <div key={idx} className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-all group">
                                    <div className="mr-4 rounded-lg bg-primary/10 border border-primary/20 p-2 group-hover:scale-110 transition-transform">
                                        <Briefcase className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white/90 truncate">{item.description}</p>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-0.5">
                                            {item.event_type} • {new Date(item.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-white/10 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.25em] px-2 text-white/40 italic">Quick Commands</h3>
                    <div className="grid gap-3">
                        <Link href="/company/jobs" className="block">
                            <Button variant="outline" className="w-full justify-between h-14 px-4 bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-primary/30 group px-5 rounded-2xl">
                                <span className="flex items-center gap-4 text-xs font-bold"><Briefcase className="w-4 h-4 text-blue-500" /> Manage Pulse</span>
                                <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Button>
                        </Link>
                        <Link href="/company/applicants" className="block">
                            <Button variant="outline" className="w-full justify-between h-14 px-4 bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-primary/30 group px-5 rounded-2xl">
                                <span className="flex items-center gap-4 text-xs font-bold"><Users className="w-4 h-4 text-indigo-500" /> Match Archive</span>
                                <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Button>
                        </Link>
                        <Card className="p-6 bg-emerald-500/5 border-emerald-500/20 rounded-3xl relative overflow-hidden group hover:bg-emerald-500/10 transition-all cursor-pointer">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Brain className="w-12 h-12 text-emerald-500" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Proactive Discovery</h4>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-2xl font-black text-white">12</span>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Unseen Stars Found</span>
                            </div>
                            <p className="text-[10px] text-white/50 leading-relaxed italic mb-4">AI has identified high-resonance candidates for your active missions who haven't applied yet.</p>
                            <Link href="/company/manage-jobs">
                                <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase text-emerald-500 hover:text-emerald-400 group-hover:translate-x-1 transition-all">
                                    Initiate Discovery Pulse <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </Link>
                        </Card>
                        <Card className="p-6 bg-primary/5 border-primary/20 rounded-3xl mt-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Neural Insight</h4>
                            <p className="text-xs text-white/70 leading-relaxed italic">"Matching precision improved by 14% this week. Your 'Senior Rust' listing is gaining traction in the European cluster."</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
