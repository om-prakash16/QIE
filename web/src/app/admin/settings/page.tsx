"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { 
    Settings, 
    Save, 
    Zap,
    Cpu,
    Database,
    Network,
    Loader2,
    HardDrive,
    Coins,
    Key,
    Lock,
    Globe,
    ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function AdminSettingsPage() {
    // In a real app, we'd fetch from 'platform_settings' table
    // For this demonstration, we'll use local state to show the UI richness
    const [localSettings, setLocalSettings] = useState<any>({
        maintenance_mode: false,
        ai_moderation_enabled: true,
        allow_new_registrations: true,
        max_upload_size: "10",
        platform_currency: "SOL",
        ai_cooldown_seconds: "30",
        openai_key_configured: true,
        solana_rpc_url: "https://api.mainnet-beta.solana.com"
    })

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Mock sync to db
            await new Promise(r => setTimeout(r, 1000));
            toast.success("Identity protocols updated and synced to mesh.");
        } catch (err) {
            toast.error(`Sync failure`);
        } finally {
            setIsSaving(false);
        }
    }

    const sections = [
        {
            title: "Core Protocols",
            icon: Cpu,
            color: "text-rose-500",
            items: [
                { id: "maintenance_mode", label: "Maintenance Mode", desc: "Suspend all platform operations for node upgrades.", field: "switch" },
                { id: "ai_moderation_enabled", label: "Neural Moderation", desc: "Enable AI-driven resume and job verification.", field: "switch" },
                { id: "allow_new_registrations", label: "Identity Provisioning", desc: "Allow new entities to register on the network.", field: "switch" },
            ]
        },
        {
            title: "Operational Limits",
            icon: HardDrive,
            color: "text-indigo-400",
            items: [
                { id: "max_upload_size", label: "Max Payload (MB)", desc: "Maximum file size for resume/portfolio uploads.", field: "input", type: "number" },
                { id: "ai_cooldown_seconds", label: "AI Cool-down (sec)", desc: "Throttle limit between sequential AI evaluations.", field: "input", type: "number" },
            ]
        },
        {
            title: "Economic Parameters",
            icon: Coins,
            color: "text-emerald-400",
            items: [
                { id: "platform_currency", label: "Base Currency", desc: "Primary token used for platform bounty settlements.", field: "select", options: ["SOL", "USDC", "BONK"] },
            ]
        },
        {
            title: "Encryption & API",
            icon: Key,
            color: "text-amber-400",
            items: [
                { id: "solana_rpc_url", label: "RPC Node URL", desc: "Connection endpoint for Solana blockchain synchronization.", field: "input", type: "text" },
                { id: "openai_key_configured", label: "LLM Provider Status", desc: "OpenAI API integration for semantic matching.", field: "status" },
            ]
        }
    ]

    return (
        <div className="space-y-12 pb-24 max-w-[1200px] mx-auto relative animate-in fade-in duration-700">
             {/* Background Accent Glow */}
             <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-20 border-b border-white/5 pb-10">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
                        <Settings className="w-8 h-8 text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black font-heading tracking-tighter text-white uppercase italic">
                            Platform <span className="text-rose-500">Settings</span>
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium mt-1 uppercase tracking-widest text-[10px]">Strategic Configuration Matrix</p>
                    </div>
                </div>

                <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-white text-black hover:bg-neutral-200 rounded-2xl px-12 h-16 shadow-2xl border-t border-white/20 font-black tracking-tighter text-lg active:scale-95 transition-all"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Save className="w-5 h-5 mr-3" />}
                    {isSaving ? "SYNCING..." : "SYNC PROTOCOLS"}
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl border-t-2"
                        style={{ borderTopColor: section.color === 'text-rose-500' ? '#f43f5e33' : section.color === 'text-indigo-400' ? '#818cf833' : section.color === 'text-emerald-400' ? '#34d39933' : '#fbbf2433' }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className={cn("p-2.5 rounded-xl bg-white/5 border border-white/10", section.color)}>
                                <section.icon className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black font-heading tracking-tight italic uppercase">
                                {section.title}
                            </h2>
                        </div>

                        <div className="space-y-8">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex flex-col gap-3 group/item">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label htmlFor={item.id} className="text-sm font-black text-white/90 uppercase tracking-widest cursor-pointer">
                                                {item.label}
                                            </Label>
                                            <p className="text-xs font-medium text-white/30 leading-relaxed italic">
                                                {item.desc}
                                            </p>
                                        </div>
                                        {item.field === "switch" && (
                                            <Switch 
                                                id={item.id} 
                                                checked={localSettings[item.id]} 
                                                onCheckedChange={(val) => setLocalSettings((prev: any) => ({ ...prev, [item.id]: val }))}
                                                className="data-[state=checked]:bg-rose-500"
                                            />
                                        )}
                                        {item.field === "status" && (
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-widest">Connected</Badge>
                                        )}
                                    </div>

                                    {(item.field === "input" || item.field === "select") && (
                                        <div className="flex items-center gap-4">
                                            {item.field === "input" && (
                                                <Input 
                                                    type={item.type}
                                                    value={localSettings[item.id]}
                                                    onChange={e => setLocalSettings({...localSettings, [item.id]: e.target.value})}
                                                    className="bg-black/40 border-white/10 h-12 text-white font-mono text-sm rounded-xl focus:border-rose-500/50 transition-all"
                                                />
                                            )}
                                            {item.field === "select" && (
                                                <Select value={localSettings[item.id]} onValueChange={v => setLocalSettings({...localSettings, [item.id]: v})}>
                                                    <SelectTrigger className="bg-black/40 border-white/10 h-12 text-white font-black uppercase tracking-widest text-[10px] rounded-xl">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-950 border-white/10 text-white">
                                                        {item.options?.map(opt => (
                                                            <SelectItem key={opt} value={opt} className="focus:bg-rose-500/20">{opt}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center pt-8">
                <div className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-4 group cursor-default shadow-2xl">
                    <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Network Integrity Pattern Match: 100%</span>
                    <div className="h-4 w-px bg-white/10 mx-4" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Node: SKILLPROOF_ADMIN_01</span>
                </div>
            </div>
        </div>
    )
}
