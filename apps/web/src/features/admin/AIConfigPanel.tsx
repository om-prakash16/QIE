"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Save, BrainCircuit, RefreshCw, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export function AIConfigPanel() {
    const [weights, setWeights] = useState({
        skill_nft: 0.4,
        github_activity: 0.3,
        project_complexity: 0.2,
        community_reputation: 0.1
    })
    const [isSaving, setIsSaving] = useState(false)

    const handleWeightChange = (key: keyof typeof weights, value: number) => {
        setWeights(prev => ({ ...prev, [key]: value }))
    }

    const saveConfig = async () => {
        setIsSaving(true)
        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("AI Weights updated successfully!")
        } catch (error) {
            toast.error("Failed to update AI configuration")
        } finally {
            setIsSaving(false)
        }
    }

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
    const isError = Math.abs(totalWeight - 1.0) > 0.01

    return (
        <Card className="border-white/5 bg-background/20 backdrop-blur-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-primary" />
                            AI PROOF SCORE TUNER
                        </CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                            Configure global scoring weights for candidate ranking
                        </CardDescription>
                    </div>
                    <Button 
                        size="sm" 
                        onClick={saveConfig} 
                        disabled={isSaving || isError}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-tighter"
                    >
                        {isSaving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        SYNC WEIGHTS
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                {Object.entries(weights).map(([key, value]) => (
                    <div key={key} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80">
                                {key.replace("_", " ")}
                            </Label>
                            <span className="text-sm font-black text-primary">
                                {(value * 100).toFixed(0)}%
                            </span>
                        </div>
                        <Slider
                            value={[value * 100]}
                            max={100}
                            step={1}
                            onValueChange={([val]) => handleWeightChange(key as keyof typeof weights, val / 100)}
                            className="[&_[role=slider]]:bg-primary"
                        />
                    </div>
                ))}

                {isError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                            Critical Error: Total weights must equal 100% (Current: {(totalWeight * 100).toFixed(1)}%)
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
