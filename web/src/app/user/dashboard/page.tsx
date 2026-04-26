"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Bookmark, FileText, TrendingUp } from "lucide-react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ProofScoreDisplay } from "@/components/ai/ProofScoreDisplay"
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel"
import { Sparkles } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function UserDashboard() {
    const { user } = useAuth()
    const [aiData, setAiData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user?.id) {
            fetchAIData()
        }
    }, [user?.id])

    const fetchAIData = async () => {
        try {
            const token = localStorage.getItem("auth_token")
            // In a real flow, we'd trigger /analyze if scores are missing or stale
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/scores/${user?.id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setAiData(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const stats = [
        { label: "Active Nodes", value: 12, icon: Briefcase, href: "/user/applications", sub: "Job Applications" },
        { label: "Signal Matrix", value: 5, icon: Bookmark, href: "/user/saved", sub: "Saved Opportunities" },
        { label: "Resonance Pulse", value: 2, icon: TrendingUp, href: "/user/applications", sub: "Active Interviews" },
        { label: "Entity Views", value: 45, icon: FileText, href: "/user/profile", sub: "Recruiter Hits" },
    ]

    return (
        <div className="space-y-12 pb-24 pt-4 animate-in fade-in duration-1000">
            <div className="flex flex-col gap-3">
                <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tighter uppercase italic">
                    Career <span className="text-primary">Intelligence</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl italic font-medium opacity-70">
                    Synchronized with the <span className="text-foreground">Best Hiring Tool</span> nexus. Welcome back, {user?.name || 'User'}.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Link key={i} href={stat.href} className="block group">
                        <Card className="glass h-full border-white/5 hover:border-primary/30 transition-all duration-500 relative overflow-hidden group-hover:translate-y-[-4px]">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                                    {stat.label}
                                </CardTitle>
                                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                                    <stat.icon className="h-4 w-4 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black tracking-tighter text-white">{stat.value}</div>
                                <p className="text-[9px] text-white/20 mt-1 font-black uppercase tracking-widest">{stat.sub}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid gap-10 lg:grid-cols-7">
                <div className="lg:col-span-4 space-y-10">
                    <Card className="glass border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        <CardHeader className="pb-8">
                            <CardTitle className="text-xl font-black uppercase italic tracking-tight">Deployment Stream</CardTitle>
                        </CardHeader>
                        <CardContent className="py-16">
                            <div className="flex flex-col items-center justify-center text-center space-y-6">
                                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 shadow-inner">
                                    <Briefcase className="w-10 h-10 text-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-white/40 font-medium italic">No active deployments detected in the current cycle.</p>
                                    <p className="text-[10px] text-primary/40 font-black uppercase tracking-widest">Awaiting Command...</p>
                                </div>
                                <Link href="/jobs">
                                    <Button variant="premium" className="h-12 px-8 rounded-xl shadow-2xl shadow-primary/20">
                                        Initiate Discovery Pulse
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <AIInsightsPanel 
                        isLoading={isLoading} 
                        data={aiData?.analysis || {
                            strengths: ["FastAPI Architecture", "Real-time Synchronization", "Neural Matching"],
                            missing_skills: ["Solana Smart Contracts", "On-chain Identity Proofing"],
                            recommendations: ["Upgrade to Senior Protocol status", "Contribute to the Proof-of-Work Ledger"]
                        }} 
                    />
                </div>

                <div className="lg:col-span-3 space-y-10">
                    <ProofScoreDisplay 
                        isLoading={isLoading} 
                        scores={aiData || {
                            skill_score: 85,
                            project_score: 75,
                            experience_score: 90,
                            proof_score: 82.5
                        }} 
                    />

                    <Card className="glass relative overflow-hidden group border-white/5 rounded-[2.5rem]">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-primary/20 transition-all duration-700" />
                        <CardHeader className="pb-8">
                            <CardTitle className="flex items-center gap-3 text-lg font-black uppercase italic tracking-tight">
                                <Sparkles className="w-5 h-5 text-primary" /> Profile Resonance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-10">
                            <div className="flex items-center justify-center py-10 relative">
                                <div className="relative w-48 h-48 rounded-full border-[12px] border-white/5 flex items-center justify-center shadow-2xl">
                                    <div className="text-center">
                                        <span className="text-5xl font-black tracking-tighter text-white">80</span>
                                        <span className="text-lg font-black text-primary">%</span>
                                    </div>
                                    <svg className="absolute top-[-12px] left-[-12px] w-[calc(100%+24px)] h-[calc(100%+24px)] -rotate-90">
                                        <circle 
                                            cx="108" cy="108" r="96" 
                                            fill="none" stroke="currentColor" strokeWidth="12" 
                                            strokeDasharray={603} strokeDashoffset={603 * (1 - 0.8)}
                                            className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-center text-[10px] text-white/30 italic font-black uppercase tracking-[0.2em] mt-6">
                                Complete your <span className="text-primary/60">Source Integration</span> to reach 100%
                            </p>
                            <Link href="/user/profile">
                                <Button className="w-full mt-10 h-14 rounded-2xl glass border-white/10 hover:border-primary/50 text-[10px] font-black uppercase tracking-widest transition-all" variant="outline">
                                    Synchronize Identity
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
