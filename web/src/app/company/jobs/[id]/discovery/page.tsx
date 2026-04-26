"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Users, 
    Sparkles, 
    ArrowLeft, 
    Brain, 
    CheckCircle2, 
    ReputationScore, 
    Trophy,
    UserPlus,
    Loader2,
    Info,
    ExternalLink
} from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api/api-client"
import { cn } from "@/lib/utils"

export default function JobDiscoveryPage() {
    const params = useParams()
    const router = useRouter()
    const jobId = params.id as string
    
    const [job, setJob] = useState<any>(null)
    const [candidates, setCandidates] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [jobData, discoveryData] = await Promise.all([
                    api.jobs.details(jobId),
                    api.jobs.discovery(jobId)
                ])
                setJob(jobData)
                setCandidates(discoveryData || [])
            } catch (err) {
                console.error("Discovery load failed", err)
            } finally {
                setIsLoading(false)
            }
        }
        if (jobId) loadData()
    }, [jobId])

    if (isLoading) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                    <Brain className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">Analyzing Talent Clusters</p>
                    <p className="text-xs text-muted-foreground animate-pulse italic">Scanning global profile vector space...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.back()}
                        className="text-muted-foreground hover:text-white -ml-2 gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Button>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] uppercase font-black tracking-widest px-3">AI Recommendations</Badge>
                            <span className="text-white/20">|</span>
                            <span className="text-xs text-muted-foreground italic truncate max-w-[300px]">{job?.title}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase italic">Strategic <span className="text-primary">Discovery</span></h1>
                        <p className="text-muted-foreground text-sm max-w-2xl">We've identified the top 1% of talent whose semantic profiles match your job requirements. Use these insights to proactively expand your pipeline.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Card className="bg-white/5 border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Matches Found</p>
                            <p className="text-xl font-black">{candidates.length}</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {candidates.length === 0 ? (
                    <div className="col-span-full border border-dashed border-white/10 rounded-3xl p-20 text-center bg-white/[0.01]">
                        <Brain className="w-12 h-12 mx-auto mb-4 text-white/10" />
                        <h3 className="text-lg font-bold mb-2 uppercase tracking-tight italic">No Exact Matches Detected</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto italic">Our neural network couldn't find public talent currently matching these specific constraints. Try broadening your skill requirements.</p>
                    </div>
                ) : candidates.map((candidate, idx) => (
                    <Card key={idx} className="bg-white/5 border-white/10 hover:border-primary/40 transition-all rounded-3xl overflow-hidden group">
                        <CardHeader className="pb-4 relative">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative group-hover:scale-105 transition-transform">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                                        <Users className="w-6 h-6 text-white/40" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black italic tracking-tight uppercase group-hover:text-primary transition-colors">{candidate.full_name}</h3>
                                        <div className="flex items-center gap-2">
                                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="text-xs font-bold text-white/60">Reputation: {candidate.reputation}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 justify-end mb-1">
                                        <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                                            <span className="text-lg font-black tracking-tighter text-primary">{candidate.match_score}%</span>
                                        </div>
                                    </div>
                                    <p className="text-[9px] uppercase font-black tracking-widest text-white/20">Proof Score Resonance</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Match Insight */}
                            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Brain className="w-12 h-12" />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                                    <Info className="w-3 h-3" /> AI Match Reasoning
                                </h4>
                                <p className="text-sm italic text-white/80 leading-relaxed font-medium">"{candidate.match_reason}"</p>
                            </div>

                            {/* Skills Tag Stream */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Top Skill Clusters</h4>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.skills?.slice(0, 6).map((skill: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="bg-white/5 border-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wide px-3 py-1">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {candidate.skills?.length > 6 && (
                                        <Badge variant="ghost" className="text-[10px] font-black text-white/20">+{candidate.skills.length - 6} more</Badge>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-4">
                                <Button className="flex-1 h-12 gap-3 uppercase text-[10px] font-black tracking-[0.2em] shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all">
                                    <UserPlus className="w-4 h-4" /> Reach Out
                                </Button>
                                <Button variant="outline" size="icon" className="h-12 w-12 border-white/10 hover:bg-white/5">
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
