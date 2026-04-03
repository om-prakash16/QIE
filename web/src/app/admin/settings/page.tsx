"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"
import { 
    Settings, 
    Shield, 
    Globe, 
    Bell, 
    Lock, 
    Save, 
    Zap,
    Cpu,
    Database,
    Network,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function AdminSettingsPage() {
    const queryClient = useQueryClient()
    
    const { data: dbSettings, isLoading } = useQuery({
        queryKey: ["platformSettings"],
        queryFn: async () => {
            const { data, error } = await supabase.from('platform_settings').select('*')
            if (error) throw error
            
            // Convert array to object
            const settingsObj: any = {}
            data.forEach(s => {
                settingsObj[s.key] = s.value
            })
            return settingsObj
        }
    })

    const mutation = useMutation({
        mutationFn: async (newSettings: any) => {
            const updates = Object.entries(newSettings).map(([key, value]) => ({
                key,
                value,
                updated_at: new Error().toISOString() // or use current timestamp
            }))

            // For each key, upsert
            for (const update of updates) {
                const { error } = await supabase
                    .from('platform_settings')
                    .upsert({ key: update.key, value: update.value })
                if (error) throw error
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["platformSettings"] })
            toast.success("Identity protocols updated and synced to mesh.")
        },
        onError: (err: any) => {
            toast.error(`Sync failure: ${err.message}`)
        }
    })

    const [localSettings, setLocalSettings] = useState<any>({})

    useEffect(() => {
        if (dbSettings) {
            setLocalSettings({
                maintenance_mode: dbSettings.maintenance_mode ?? false,
                ai_moderation_enabled: dbSettings.ai_moderation_enabled ?? true,
                allow_new_registrations: dbSettings.allow_new_registrations ?? true,
                enforce_2fa: dbSettings.enforce_2fa ?? false,
                public_telemetry: dbSettings.public_telemetry ?? true,
                email_notifications: dbSettings.email_notifications ?? true
            })
        }
    }, [dbSettings])

    const handleSave = () => {
        mutation.mutate(localSettings)
    }

    const sections = [
        {
            title: "Core Protocols",
            icon: Cpu,
            color: "text-primary",
            items: [
                { id: "maintenance_mode", label: "Maintenance Mode", desc: "Suspend all platform operations for node upgrades.", field: "switch" },
                { id: "ai_moderation_enabled", label: "Neural Moderation", desc: "Enable AI-driven resume and job verification.", field: "switch" },
            ]
        },
        {
            title: "Access Management",
            icon: Network,
            color: "text-blue-400",
            items: [
                { id: "allow_new_registrations", label: "Identity Provisioning", desc: "Allow new entities to register on the network.", field: "switch" },
                { id: "enforce_2fa", label: "Binary Verification", desc: "Enforce multi-factor authentication for all nodes.", field: "switch" },
            ]
        },
        {
            title: "Telemetry & Sync",
            icon: Database,
            color: "text-emerald-400",
            items: [
                { id: "public_telemetry", label: "Public Mesh Data", desc: "Share anonymized platform metrics with the ecosystem.", field: "switch" },
                { id: "email_notifications", label: "Signal Broadcast", desc: "Receive real-time alerts for critical system events.", field: "switch" },
            ]
        }
    ]

    if (isLoading) {
        return (
            <div className="flex h-[70vh] w-full items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-24 max-w-[1200px] mx-auto relative">
             {/* Background Accent Glow */}
             <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                            <Settings className="w-6 h-6 text-primary" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 mb-1">Configuration Node</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-foreground">
                                System Protocol
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Button 
                        onClick={handleSave}
                        disabled={mutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-10 h-14 shadow-2xl border-t border-white/20 font-black tracking-tight text-lg group overflow-hidden relative"
                    >
                        {mutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-3" />
                        ) : (
                            <Save className="w-5 h-5 mr-3" />
                        )}
                        <span className="relative z-10">{mutation.isPending ? "Syncing..." : "Sync Protocols"}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Button>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 gap-12 relative z-20">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (idx * 0.1) }}
                        className="bg-background/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl"
                    >
                        <div className={cn("absolute -top-24 -right-24 w-64 h-64 blur-[100px] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-1000 bg-primary")} />
                        
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                            <div className={cn("p-2.5 rounded-xl bg-white/5 border border-white/5", section.color)}>
                                <section.icon className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black font-heading tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
                                {section.title}
                            </h2>
                        </div>

                        <div className="space-y-10">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-6 group/item">
                                    <div className="space-y-1.5 flex-1 max-w-2xl">
                                        <Label htmlFor={item.id} className="text-base font-black text-foreground/90 group-hover/item:text-primary transition-colors cursor-pointer capitalize">
                                            {item.label}
                                        </Label>
                                        <p className="text-sm font-medium text-muted-foreground/60 leading-relaxed group-hover/item:text-muted-foreground transition-colors">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <Switch 
                                            id={item.id} 
                                            checked={localSettings[item.id] ?? false} 
                                            onCheckedChange={(val) => setLocalSettings((prev: any) => ({ ...prev, [item.id]: val }))}
                                            className="data-[state=checked]:bg-primary shadow-lg scale-125"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center pt-8">
                <div className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center gap-4 group cursor-default hover:border-primary/20 transition-all">
                    <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)] animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-primary/60 transition-colors">Integrity Check: SECURE</span>
                    <div className="h-4 w-px bg-white/10 mx-2" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-primary/60 transition-colors">Version: 1.0.Nexus</span>
                </div>
            </div>
        </div>
    )
}

