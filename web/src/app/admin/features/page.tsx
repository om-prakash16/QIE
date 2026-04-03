"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
    Boxes, 
    Lock, 
    Unlock, 
    ShieldAlert, 
    RefreshCcw, 
    Zap, 
    Sparkles, 
    Settings2,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function FeatureFlagsPage() {
    const queryClient = useQueryClient()

    const { data: flags, isLoading } = useQuery({
        queryKey: ["featureFlags"],
        queryFn: async () => {
            const res = await fetch("/api/v1/config/features")
            if (!res.ok) throw new Error("Failed to sync platform features")
            return res.json()
        }
    })

    const mutation = useMutation({
        mutationFn: async ({ id, is_enabled }: { id: string, is_enabled: boolean }) => {
            const res = await fetch(`/api/v1/config/features/${id}`, {

                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_enabled })
            })
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["featureFlags"] })
            toast.success("Platform protocol re-routed correctly")
        }
    })

    return (
        <div className="space-y-12 pb-24 max-w-[1200px] mx-auto relative">
             {/* Background Accent Glow */}
             <div className="absolute -top-40 -right-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                            <Boxes className="w-6 h-6 text-primary" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 mb-1">Matrix Routing</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-foreground">
                                Feature Toggles
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="relative h-4 w-4">
                        <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                        <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <span className="text-[11px] font-black text-white/40 uppercase tracking-widest animate-pulse">Mesh Operational</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20">
                <AnimatePresence>
                    {flags?.map((flag: any, idx: number) => (
                        <motion.div
                            key={flag.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className={cn(
                                "bg-background/20 backdrop-blur-3xl border-white/5 rounded-[2.5rem] p-4 shadow-2xl transition-all duration-500 overflow-hidden relative group",
                                flag.is_enabled ? "border-primary/20 ring-1 ring-primary/10" : "border-white/5 grayscale-[0.5] opacity-80"
                            )}>
                                <div className={cn(
                                    "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full pointer-events-none transition-all duration-1000",
                                    flag.is_enabled ? "bg-primary/10 opacity-100" : "bg-white/0 opacity-0"
                                )} />
                                
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={cn(
                                            "inline-flex p-3 rounded-2xl border backdrop-blur-md transition-all duration-500 shadow-lg",
                                            flag.is_enabled ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-muted-foreground/60"
                                        )}>
                                            {flag.is_enabled ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                        </div>
                                        <Switch 
                                            checked={flag.is_enabled}
                                            onCheckedChange={(val) => mutation.mutate({ id: flag.id, is_enabled: val })}
                                            className="data-[state=checked]:bg-primary scale-125"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-black font-heading tracking-tight flex items-center gap-2 uppercase">
                                            {flag.id.replaceAll('_', ' ')}
                                            {flag.is_enabled && <Sparkles className="w-4 h-4 text-primary animate-pulse" />}
                                        </CardTitle>
                                        <CardDescription className="text-secondary-foreground/60 font-bold min-h-[40px]">
                                            {flag.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-4">
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                                        <span className="flex items-center gap-1">
                                            <Zap className="w-3 h-3" />
                                            Runtime Node
                                        </span>
                                        <span>/</span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Edge Optimized
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <div className="col-span-full flex flex-col items-center justify-center p-24 space-y-4 opacity-40">
                         <RefreshCcw className="w-12 h-12 animate-spin text-primary" />
                         <p className="font-black text-muted-foreground uppercase tracking-widest">Hydrating feature protocols...</p>
                    </div>
                )}
            </div>

            {/* Warning Message */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative z-20 p-8 bg-rose-500/10 border border-rose-500/20 rounded-[2.5rem] backdrop-blur-3xl overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/40" />
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-rose-500/20 rounded-2xl shadow-xl shadow-rose-500/20">
                        <ShieldAlert className="w-8 h-8 text-rose-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-rose-400 font-heading tracking-tight uppercase">Operational Warning</h3>
                        <p className="text-sm font-bold text-rose-300 opacity-80 leading-relaxed">
                            Alterations to global feature protocols can impact mission-critical services for all network participants. Exercise extreme caution when modifying live environment routes.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
