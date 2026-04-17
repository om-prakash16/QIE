"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    AlertTriangle, 
    TrendingUp, 
    Zap, 
    ChevronDown, 
    ChevronUp, 
    Info, 
    Sparkles, 
    ShieldCheck,
    ArrowUpRight,
    Activity
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RiskFeature {
    name: string
    impact: string
    description: string
}

interface RiskMetric {
    score: number
    level: string
    features: RiskFeature[]
    next_milestone_estimate?: string
}

interface CareerRiskData {
    metrics: {
        job_change_probability: RiskMetric
        career_growth_trajectory: RiskMetric
        skill_stagnation_risk: RiskMetric
    }
    summary: string
}

export function CareerRiskPredictor() {
    const [data, setData] = useState<CareerRiskData | null>(null)
    const [loading, setLoading] = useState(true)
    const [expandedMetric, setExpandedMetric] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/career-risk`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("sp_token")}`
                    }
                })
                const result = await res.json()
                setData(result)
            } catch (err) {
                console.error("Failed to fetch career risk data", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="w-full h-[400px] rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground animate-pulse">Analyzing career signals...</p>
                </div>
            </div>
        )
    }

    if (!data) return null

    const metrics = [
        {
            key: "job_change_probability",
            label: "Job Change Probability",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            borderColor: "border-amber-500/20",
            data: data.metrics.job_change_probability
        },
        {
            key: "career_growth_trajectory",
            label: "Growth Trajectory",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            borderColor: "border-emerald-500/20",
            data: data.metrics.career_growth_trajectory
        },
        {
            key: "skill_stagnation_risk",
            label: "Skill Stagnation Risk",
            icon: AlertTriangle,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            borderColor: "border-rose-500/20",
            data: data.metrics.skill_stagnation_risk
        }
    ]

    return (
        <Card className="p-6 border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-2xl space-y-6 overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        AI Career Risk Predictor
                    </h2>
                    <p className="text-xs text-muted-foreground">Predictive analysis based on tenure, skill velocity, and market magnetism.</p>
                </div>
                <Badge variant="outline" className="w-fit bg-primary/10 text-primary border-primary/20 gap-1.5 py-1 px-3">
                    <Sparkles className="w-3 h-3" />
                    Live ML Logic
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((metric) => {
                    const Icon = metric.icon
                    const isExpanded = expandedMetric === metric.key
                    
                    return (
                        <motion.div 
                            key={metric.key}
                            layout
                            className={cn(
                                "flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300",
                                isExpanded ? "bg-white/[0.05] border-white/20 shadow-2xl" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className={cn("p-2 rounded-xl", metric.bg)}>
                                    <Icon className={cn("w-5 h-5", metric.color)} />
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black">{metric.data.score}%</div>
                                    <div className={cn("text-[10px] font-bold uppercase tracking-wider", metric.color)}>
                                        {metric.data.level}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase">
                                    <span>{metric.label}</span>
                                    <span>Risk Level</span>
                                </div>
                                <Progress value={metric.data.score} className="h-1.5 bg-white/5" indicatorClassName={metric.bg.replace('/10', '/100')} />
                            </div>

                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/5 gap-2"
                                onClick={() => setExpandedMetric(isExpanded ? null : metric.key)}
                            >
                                {isExpanded ? (
                                    <>Collapse <ChevronUp className="w-3 h-3" /></>
                                ) : (
                                    <>Explain Features <ChevronDown className="w-3 h-3" /></>
                                )}
                            </Button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 space-y-4 border-t border-white/10 mt-2">
                                            {metric.data.features.map((feature, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-white/90">{feature.name}</span>
                                                        <Badge className="text-[9px] h-4 bg-white/5 text-muted-foreground border-white/5">{feature.impact} Impact</Badge>
                                                    </div>
                                                    <p className="text-[10px] leading-relaxed text-muted-foreground">{feature.description}</p>
                                                </div>
                                            ))}
                                            {metric.data.next_milestone_estimate && (
                                                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-primary">Next Milestone Estimate</span>
                                                    <span className="text-sm font-black text-primary">{metric.data.next_milestone_estimate}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )
                })}
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-white">AI Executive Summary</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{data.summary}</p>
                </div>
                <Button size="sm" className="ml-auto rounded-lg text-xs gap-2 shrink-0">
                    Optimize Path <ArrowUpRight className="w-3 h-3" />
                </Button>
            </div>
        </Card>
    )
}
