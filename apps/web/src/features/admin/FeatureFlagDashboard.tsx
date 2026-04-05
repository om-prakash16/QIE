"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Flag, Rocket, Settings2, ShieldCheck, Zap } from "lucide-react"

const FLAGS = [
    { id: "enable_skill_nft", label: "SKILL NFT MINTING", description: "Enable automated Solana NFT issuance for verified skills", icon: Zap, category: "blockchain" },
    { id: "enable_ai_quiz", label: "AI QUIZ PIPELINE", description: "Activate dynamic MCQ generation and automated grading", icon: Rocket, category: "ai" },
    { id: "enable_referral", label: "REFERRAL PROGRAM", description: "Enable on-chain referral rewards for user onboarding", icon: Settings2, category: "growth" },
    { id: "public_job_board", label: "PUBLIC JOB BOARD", description: "Toggle visibility of the global talent marketplace", icon: Flag, category: "core" }
]

export function FeatureFlagDashboard() {
    const [states, setStates] = useState<Record<string, boolean>>({
        enable_skill_nft: true,
        enable_ai_quiz: true,
        enable_referral: false,
        public_job_board: true
    })

    const toggleFlag = (id: string) => {
        setStates(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <Card className="border-white/5 bg-background/20 backdrop-blur-xl">
            <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl font-black tracking-tight">FEATURE FLAG MATRIX</CardTitle>
                </div>
                <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                    Real-time control over platform modules without deployment
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                {FLAGS.map((flag, index) => {
                    const Icon = flag.icon
                    const isEnabled = states[flag.id]

                    return (
                        <motion.div
                            key={flag.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${isEnabled ? 'bg-primary/10 text-primary' : 'bg-muted/10 text-muted-foreground'} transition-colors duration-300`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-[11px] font-black uppercase tracking-[0.2em]">
                                            {flag.label}
                                        </Label>
                                        <Badge variant="outline" className="text-[8px] h-4 border-white/10 text-muted-foreground/60 uppercase font-black tracking-widest">
                                            {flag.category}
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-tight">
                                        {flag.description}
                                    </p>
                                </div>
                            </div>
                            <Switch 
                                checked={isEnabled} 
                                onCheckedChange={() => toggleFlag(flag.id)}
                                className="data-[state=checked]:bg-primary"
                            />
                        </motion.div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
