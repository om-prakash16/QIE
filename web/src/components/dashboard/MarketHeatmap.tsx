"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Flame, 
    TrendingUp, 
    Users, 
    Briefcase, 
    Info, 
    Sparkles, 
    Target, 
    BarChart3,
    Radar
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface HeatmapPoint {
    skill: string
    demand: number
    supply: number
    opportunity_index: number
    saturation: string
}

interface MarketData {
    heatmap: HeatmapPoint[]
    predictions: {
        breakout_skills: string[]
        saturated_domain: string
        predictions_summary: string
    }
}

export function MarketHeatmap() {
    const [data, setData] = useState<MarketData | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedSkill, setSelectedSkill] = useState<HeatmapPoint | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics/market-intel`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("sp_token")}`
                    }
                })
                const result = await res.json()
                if (result.status === "success") {
                    setData({
                        heatmap: result.market_data.heatmap,
                        predictions: result.predictions
                    })
                }
            } catch (err) {
                console.error("Failed to fetch market intel", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="w-full h-[500px] border border-white/10 bg-white/[0.02] rounded-3xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground animate-pulse font-bold tracking-widest uppercase">Scanning Global Talent Shifts...</p>
                </div>
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Heatmap Grid */}
                <Card className="lg:col-span-2 p-8 border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-3xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent" />
                    
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                                Talent Opportunity Heatmap
                            </h2>
                            <p className="text-xs text-muted-foreground">Visualization of employer demand vs. candidate availability.</p>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-2 py-1 px-3">
                            <ActivityIcon className="w-3 h-3" />
                            Live Market Data
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        <TooltipProvider>
                            {data.heatmap.map((point) => {
                                // Color scale based on opportunity index (0 to 5+)
                                const intensity = Math.min(1, point.opportunity_index / 3)
                                const bgColor = intensity > 0.7 ? "bg-orange-600" : intensity > 0.4 ? "bg-orange-500" : "bg-orange-400"
                                
                                return (
                                    <Tooltip key={point.skill}>
                                        <TooltipTrigger asChild>
                                            <motion.button
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                onClick={() => setSelectedSkill(point)}
                                                className={cn(
                                                    "h-20 rounded-xl flex flex-col items-center justify-center p-2 transition-all border border-white/5",
                                                    selectedSkill?.skill === point.skill ? "ring-2 ring-primary ring-offset-2 ring-offset-black" : ""
                                                )}
                                                style={{ 
                                                    backgroundColor: `rgba(249, 115, 22, ${0.1 + intensity * 0.8})` 
                                                }}
                                            >
                                                <span className="text-[10px] font-black uppercase text-white drop-shadow-md truncate w-full text-center">{point.skill}</span>
                                                <span className="text-[14px] font-black text-white/90">{point.opportunity_index}x</span>
                                            </motion.button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-black border-white/10 p-3 rounded-xl shadow-2xl">
                                            <div className="space-y-2">
                                                <p className="text-xs font-black uppercase tracking-wider">{point.skill}</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Demand</p>
                                                        <p className="text-sm font-black">{point.demand} Jobs</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Supply</p>
                                                        <p className="text-sm font-black">{point.supply} Ph</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            })}
                        </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                            <span>Saturated</span>
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="w-4 h-2 rounded-full" style={{ backgroundColor: `rgba(249, 115, 22, ${0.1 + (i-1)*0.2})` }} />
                                ))}
                            </div>
                            <span>High Opportunity</span>
                        </div>
                    </div>
                </Card>

                {/* Sidebar logic */}
                <div className="space-y-8">
                    {/* Selected Skill Details */}
                    <AnimatePresence mode="wait">
                        {selectedSkill ? (
                            <motion.div
                                key={selectedSkill.skill}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <Card className="p-6 border-white/10 bg-white/[0.05] rounded-3xl space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/20 uppercase text-[10px]">{selectedSkill.saturation} Saturation</Badge>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setSelectedSkill(null)}>
                                            <XIcon className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <h3 className="text-3xl font-black italic tracking-tighter capitalize">{selectedSkill.skill}</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                <span>Opportunity Ratio</span>
                                                <span className="text-white">{selectedSkill.opportunity_index}x</span>
                                            </div>
                                            <Progress value={selectedSkill.opportunity_index * 20} className="h-1" />
                                        </div>
                                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                                            There is an average of <strong>{selectedSkill.opportunity_index} open job positions</strong> for every 1 verified candidate with {selectedSkill.skill} expertise on the platform.
                                        </p>
                                        <Button size="sm" className="w-full rounded-xl bg-orange-600 hover:bg-orange-500 font-bold uppercase text-[10px] tracking-widest">
                                            View Talent Pool <ArrowRight className="w-3 h-3 ml-2" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <Card className="p-8 border-white/10 bg-white/[0.02] border-dashed rounded-3xl flex flex-col items-center justify-center text-center space-y-4 h-[220px]">
                                <Target className="w-10 h-10 text-muted-foreground/20" />
                                <p className="text-sm font-bold text-muted-foreground/60">Select a heatmap zone to view deep analytics</p>
                            </Card>
                        )}
                    </AnimatePresence>

                    {/* Predictions */}
                    <Card className="p-6 border-white/10 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl space-y-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Radar className="w-12 h-12 text-primary/10" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                AI Future Projection
                            </h4>
                            <p className="text-[10px] text-muted-foreground italic">Powered by Gemini 1.5 Real-time Analysis</p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[11px] font-bold text-white/80 leading-relaxed uppercase tracking-tighter">Breakout Skills (Next 6mo)</p>
                            <div className="flex flex-wrap gap-2">
                                {data.predictions.breakout_skills.map(s => (
                                    <Badge key={s} className="bg-primary/20 text-primary border-primary/20 text-[10px] font-black uppercase px-2">{s}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-2">
                            <p className="text-[10px] font-black text-rose-500 uppercase">Saturated Domain</p>
                            <p className="text-xs font-bold">{data.predictions.saturated_domain}</p>
                        </div>

                        <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                             <p className="text-[10px] leading-relaxed text-muted-foreground italic">"{data.predictions.predictions_summary}"</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function ActivityIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    )
}

function XIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
    )
}

function ArrowRight(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
    )
}
