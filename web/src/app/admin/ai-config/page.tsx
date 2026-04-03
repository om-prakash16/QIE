"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
    Brain, 
    Zap, 
    Save, 
    RefreshCcw, 
    ShieldCheck, 
    Github, 
    Code, 
    Briefcase,
    TrendingUp,
    Info,
    CheckCircle2,
    Sparkles
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function AIConfigPage() {
    const queryClient = useQueryClient()
    const [localWeights, setLocalWeights] = useState({
        skill_weight: 0.4,
        github_weight: 0.3,
        project_weight: 0.3,
        base_multiplier: 1.0
    })

    const { data: config, isLoading } = useQuery({
        queryKey: ["aiConfig"],
        queryFn: async () => {
            const res = await fetch("/api/v1/config/ai?key=reputation_v1")
            if (!res.ok) throw new Error("Failed to sync AI neural network")
            return res.json()
        }
    })

    useEffect(() => {
        if (config?.weights) {
            setLocalWeights(config.weights)
        }
    }, [config])

    const mutation = useMutation({
        mutationFn: async (weights: any) => {
            const res = await fetch("/api/v1/config/ai/reputation_v1", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ weights, description: "Updated via admin console", is_active: true })
            })
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["aiConfig"] })
            toast.success("AI Reputation formula recalibrated correctly")
        }
    })

    const totalWeight = Math.round((localWeights.skill_weight + localWeights.github_weight + localWeights.project_weight) * 100)
    const isBalanced = totalWeight === 100

    const updateWeight = (key: string, val: number[]) => {
        setLocalWeights(prev => ({ ...prev, [key]: val[0] }))
    }

    return (
        <div className="space-y-12 pb-24 max-w-[1400px] mx-auto relative">
             {/* Background Accent Glow */}
             <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                            <Brain className="w-6 h-6 text-primary" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 mb-1">Neural Node</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-foreground">
                                AI Configuration
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <div className={cn(
                        "hidden md:flex items-center gap-3 px-6 py-3 rounded-2xl border backdrop-blur-xl transition-all duration-500",
                        isBalanced ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    )}>
                       <div className={cn("h-2 w-2 rounded-full", isBalanced ? "bg-emerald-400 animate-pulse" : "bg-rose-400")} />
                       <span className="text-[10px] font-black uppercase tracking-widest">
                           Mesh Equilibrium: {totalWeight}%
                       </span>
                    </div>

                    <Button 
                        onClick={() => mutation.mutate(localWeights)}
                        disabled={mutation.isPending || !isBalanced}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-10 h-14 shadow-2xl border-t border-white/20 font-black tracking-tight text-lg group overflow-hidden relative"
                    >
                        {mutation.isPending ? <RefreshCcw className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3" />}
                        <span className="relative z-10">{mutation.isPending ? "Syncing..." : "Sync Recalibration"}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-20">
                {/* Weight Tuning Section */}
                <div className="lg:col-span-2 space-y-12">
                    <Card className="bg-background/20 backdrop-blur-3xl border-white/5 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <CardHeader className="p-8">
                            <CardTitle className="text-2xl font-black font-heading flex items-center gap-3">
                                <Zap className="w-5 h-5 text-primary" />
                                Reputation Matrix
                            </CardTitle>
                            <CardDescription className="text-secondary-foreground/60 font-bold">
                                Control how the AI calculates professional reputation scores across the mesh.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-12">
                            {/* Skill Score */}
                            <div className="space-y-6 group/item">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg group-hover/item:bg-emerald-500/20 transition-colors">
                                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <Label className="font-black text-lg">Verified Skill Weight</Label>
                                    </div>
                                    <span className="font-mono text-emerald-400 font-black">{Math.round(localWeights.skill_weight * 100)}%</span>
                                </div>
                                <Slider 
                                    max={1} 
                                    step={0.01} 
                                    value={[localWeights.skill_weight]} 
                                    onValueChange={(val) => updateWeight('skill_weight', val)}
                                    className="data-[disabled]:opacity-50"
                                />
                                <p className="text-xs font-bold text-muted-foreground/40 italic">Weight given to AI-assessed skill verification and quiz scores.</p>
                            </div>

                            {/* GitHub Score */}
                            <div className="space-y-6 group/item">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-500/10 rounded-lg group-hover/item:bg-slate-500/20 transition-colors">
                                            <Github className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <Label className="font-black text-lg">Repository Quality Weight</Label>
                                    </div>
                                    <span className="font-mono text-slate-400 font-black">{Math.round(localWeights.github_weight * 100)}%</span>
                                </div>
                                <Slider 
                                    max={1} 
                                    step={0.01} 
                                    value={[localWeights.github_weight]} 
                                    onValueChange={(val) => updateWeight('github_weight', val)}
                                    className="data-[disabled]:opacity-50"
                                />
                                <p className="text-xs font-bold text-muted-foreground/40 italic">Contribution analysis and code quality from linked GitHub repositories.</p>
                            </div>

                            {/* Project Ledger */}
                            <div className="space-y-6 group/item">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg group-hover/item:bg-blue-500/20 transition-colors">
                                            <Briefcase className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <Label className="font-black text-lg">Platform Project Weight</Label>
                                    </div>
                                    <span className="font-mono text-blue-400 font-black">{Math.round(localWeights.project_weight * 100)}%</span>
                                </div>
                                <Slider 
                                    max={1} 
                                    step={0.01} 
                                    value={[localWeights.project_weight]} 
                                    onValueChange={(val) => updateWeight('project_weight', val)}
                                    className="data-[disabled]:opacity-50"
                                />
                                <p className="text-xs font-bold text-muted-foreground/40 italic">Historical success rate on jobs and micro-tasks within the ecosystem.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Real-time Preview Section */}
                <div className="space-y-12">
                    <Card className="bg-[#0f172a]/40 backdrop-blur-3xl border-primary/20 rounded-[2.5rem] p-8 shadow-[0_0_50px_-12px_rgba(var(--primary),0.2)] overflow-hidden relative border-t-primary/40">
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                       <CardHeader className="p-0 mb-8">
                           <CardTitle className="text-xl font-black font-heading flex items-center gap-2">
                               <TrendingUp className="w-5 h-5 text-primary" />
                               Simulation Preview
                           </CardTitle>
                       </CardHeader>
                       <CardContent className="p-0 space-y-10">
                           <div className="text-center py-10 rounded-[2rem] bg-white/5 border border-white/5 relative group">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Sample Candidate Score</p>
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                    <span className="text-7xl font-black tracking-tighter relative z-10 text-white leading-none">
                                        {Math.round((85 * localWeights.skill_weight) + (72 * localWeights.github_weight) + (94 * localWeights.project_weight))}
                                    </span>
                                </div>
                                <div className="mt-6 flex flex-col gap-1 items-center">
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map(s => <Sparkles key={s} className="w-3 h-3 text-primary/40" />)}
                                    </div>
                                    <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">Protocol Sync: Verified</span>
                                </div>
                           </div>

                           <div className="space-y-4">
                               <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                   <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                       <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                   </div>
                                   <div className="space-y-1">
                                       <p className="text-[10px] font-black uppercase tracking-widest">AI Matching Threshold</p>
                                       <p className="text-xs font-bold text-muted-foreground/60 leading-none">Min. score required for matching</p>
                                   </div>
                                   <span className="ml-auto font-mono font-black text-primary">70%</span>
                               </div>

                               <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                                   <div className="flex items-center gap-2 mb-2 text-primary">
                                       <Info className="w-4 h-4" />
                                       <span className="text-[10px] font-black uppercase tracking-widest leading-none">Developer Note</span>
                                   </div>
                                   <p className="text-xs font-medium text-primary/80 leading-relaxed">
                                       Formula adjustments will re-calculate all node reputations within the next 24-hour sync cycle. High weights in manual verification can increase moderation latency.
                                   </p>
                               </div>
                           </div>
                       </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
