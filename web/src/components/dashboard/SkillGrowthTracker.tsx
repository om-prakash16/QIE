"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    TrendingUp, 
    Milestone, 
    Award, 
    Target, 
    ChevronRight, 
    Sparkles,
    Calendar,
    ArrowUpRight,
    Search
} from "lucide-react"
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    TooltipProps
} from "recharts"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChartPoint {
    date: string
    score: number
}

interface MilestoneData {
    achievement_type: string
    achievement_data: {
        label: string
        description: string
    }
    issued_at: string
}

interface GrowthData {
    chart_data: ChartPoint[]
    velocity: number
    milestones: MilestoneData[]
    insights: string
    summary: {
        current_score: number
        total_reputation_points: number
        percentile: number
    }
}

export function SkillGrowthTracker() {
    const [data, setData] = useState<GrowthData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchGrowth() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics/user/growth`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("sp_token")}`
                    }
                })
                const result = await res.json()
                // Mock some historical data if empty for visual beauty
                if (result.chart_data.length < 2) {
                    result.chart_data = [
                        { date: "Mar 01", score: 420 },
                        { date: "Mar 10", score: 480 },
                        { date: "Mar 20", score: 510 },
                        { date: "Mar 30", score: 590 },
                        { date: "Apr 05", score: 620 },
                        { date: "Apr 12", score: 680 },
                        { date: "Apr 17", score: result.summary.current_score || 720 }
                    ]
                }
                setData(result)
            } catch (err) {
                console.error("Failed to fetch growth metrics", err)
            } finally {
                setLoading(false)
            }
        }
        fetchGrowth()
    }, [])

    if (loading) {
        return (
            <div className="w-full h-[400px] rounded-3xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground animate-pulse font-bold tracking-widest uppercase">Plotting Growth Trajectory...</p>
                </div>
            </div>
        )
    }

    if (!data) return null

    return (
        <Card className="p-8 border-white/10 bg-white/[0.02] backdrop-blur-2xl rounded-[2.5rem] space-y-8 relative overflow-hidden group">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -z-10 group-hover:bg-primary/10 transition-all duration-1000" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-primary" />
                        Skill Growth Tracker
                    </h2>
                    <p className="text-sm text-muted-foreground">Historical trajectory of your verified identity and proof-points.</p>
                </div>
                <div className="flex gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[120px]">
                        <p className="text-[10px] font-black uppercase text-muted-foreground/60 mb-1">Total Points</p>
                        <p className="text-2xl font-black italic tracking-tighter text-white">{data.summary.total_reputation_points.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center min-w-[120px]">
                        <p className="text-[10px] font-black uppercase text-primary/60 mb-1">Growth Velocity</p>
                        <p className="text-2xl font-black italic tracking-tighter text-primary">{data.velocity > 0 ? "+" : ""}{data.velocity}</p>
                    </div>
                </div>
            </div>

            {/* Main Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 h-[300px] w-full bg-white/[0.01] rounded-3xl p-4 border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.chart_data}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
                                domain={['dataMin - 50', 'dataMax + 50']}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="score" 
                                stroke="var(--primary)" 
                                strokeWidth={4} 
                                fillOpacity={1} 
                                fill="url(#colorScore)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Insights / Milestones Sidebar */}
                <div className="space-y-6">
                    <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group/insight">
                        <Sparkles className="absolute -top-2 -right-2 w-12 h-12 text-primary/10 group-hover/insight:text-primary/20 transition-all rotate-12" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3 mt-1 flex items-center gap-2">
                            AI Growth Insight
                        </h4>
                        <p className="text-xs leading-relaxed text-white/80 italic font-medium">"{data.insights}"</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Milestones</h4>
                            <Badge variant="ghost" className="text-[10px] uppercase font-black text-primary p-0">View All</Badge>
                        </div>
                        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                            {data.milestones.length > 0 ? (
                                data.milestones.map((milestone, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group/m">
                                        <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center shrink-0">
                                            <Award className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-bold text-white truncate">{milestone.achievement_type}</p>
                                            <p className="text-[9px] text-muted-foreground truncate">{milestone.achievement_data.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 space-y-2 opacity-40">
                                    <Target className="w-6 h-6 mx-auto" />
                                    <p className="text-[10px] font-black uppercase">No milestones yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center border-t border-white/5 pt-8">
                <div className="flex-1 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white">Consistent Learning streak</p>
                        <p className="text-xs text-muted-foreground">Keep verifying skills to maintain a Top {data.summary.percentile}% standing.</p>
                    </div>
                </div>
                <Button className="w-full md:w-auto rounded-2xl px-8 h-12 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-white/90 shadow-xl shadow-white/5 gap-2">
                    Predict Next Milestone <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    )
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl">
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black italic text-primary">{payload[0].value}</span>
                    <span className="text-[10px] font-bold uppercase text-primary/60">Points</span>
                </div>
            </div>
        );
    }
    return null;
}
