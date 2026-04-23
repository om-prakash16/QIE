"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Activity, 
    Zap, 
    ShieldCheck, 
    ShieldAlert, 
    UserPlus, 
    Briefcase, 
    ArrowRight,
    Loader2,
    Clock,
    Search,
    Satellite,
    Terminal,
    Hash
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api/api-client"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

export default function MissionLogPage() {
    const { user } = useAuth()
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("")

    useEffect(() => {
        if (user) fetchActivity()
    }, [user])

    const fetchActivity = async () => {
        setLoading(true)
        try {
            const data = await api.activity.user(50)
            setEvents(data || [])
        } catch (e) {
            console.error("Telemetry sync failure", e)
        } finally {
            setLoading(false)
        }
    }

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'registration': return <UserPlus className="w-5 h-5 text-primary" />
            case 'job_apply': return <Briefcase className="w-5 h-5 text-emerald-500" />
            case 'identity_verified': return <ShieldCheck className="w-5 h-5 text-emerald-500" />
            case 'identity_rejected': return <ShieldAlert className="w-5 h-5 text-rose-500" />
            case 'assessment_submit': return <Zap className="w-5 h-5 text-amber-500" />
            default: return <Satellite className="w-5 h-5 text-white/40" />
        }
    }

    const filteredEvents = events.filter(e => 
        e.description?.toLowerCase().includes(filter.toLowerCase()) || 
        e.event_type?.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Telemetry Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary tracking-widest uppercase font-black text-[10px] px-4 py-1">
                        Operational Telemetry: Mission Log
                    </Badge>
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
                        Activity <span className="text-primary text-opacity-80">Ledger.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl font-medium">
                        Real-time visualization of your platform interactions, trust milestones, and decentralized verification events.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <Input 
                            placeholder="Filter signals..." 
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="bg-transparent border-none pl-10 h-10 w-48 text-xs font-mono"
                        />
                    </div>
                    <Button onClick={fetchActivity} variant="ghost" size="icon" className="h-10 w-10 text-white/40 hover:text-white">
                        <Activity className={cn("w-5 h-5", loading && "animate-pulse")} />
                    </Button>
                </div>
            </div>

            {/* Event Timeline */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-white/5 to-transparent" />

                <div className="space-y-8">
                    {loading ? (
                        [1,2,3,4].map(i => (
                            <div key={i} className="flex gap-8 items-start opacity-20 animate-pulse pl-4">
                                <div className="w-8 h-8 rounded-full bg-white/20 shrink-0 mt-1" />
                                <div className="space-y-2 flex-1 pt-2">
                                    <div className="h-4 w-48 bg-white/20 rounded" />
                                    <div className="h-3 w-32 bg-white/10 rounded" />
                                </div>
                            </div>
                        ))
                    ) : filteredEvents.length === 0 ? (
                        <div className="py-24 text-center space-y-4">
                            <Terminal className="w-12 h-12 text-white/5 mx-auto" />
                            <p className="text-white/20 font-black italic uppercase tracking-widest text-xs font-mono">
                                {filter ? "No signals detected matching current search vector." : "No operational activity recorded in history."}
                            </p>
                        </div>
                    ) : (
                        filteredEvents.map((event, idx) => (
                            <motion.div 
                                key={event.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex gap-8 items-start group pl-4"
                            >
                                <div className="relative z-10 w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center group-hover:border-primary/40 transition-colors shrink-0 mt-1 shadow-2xl">
                                    <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                                </div>
                                <div className="flex-1 space-y-1 pt-0.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-white/20">
                                                [{new Date(event.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                                            </span>
                                            <Badge variant="ghost" className="bg-white/5 text-[9px] font-black uppercase tracking-widest px-2 py-0 h-5 border-none text-white/40 group-hover:text-primary transition-colors">
                                                {event.event_type}
                                            </Badge>
                                        </div>
                                        <span className="text-[9px] font-mono text-white/10 italic">#TX-{event.id.slice(0, 8)}</span>
                                    </div>
                                    <p className="text-white font-medium text-lg tracking-tight group-hover:translate-x-1 transition-transform inline-flex items-center gap-3">
                                        {getEventIcon(event.event_type)}
                                        {event.description}
                                    </p>
                                    <div className="flex items-center gap-6 pt-1">
                                        <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5 italic">
                                            <Clock className="w-3 h-3" /> {new Date(event.created_at).toLocaleDateString()}
                                        </p>
                                        {event.metadata?.tx_hash && (
                                            <p className="text-[10px] font-mono text-primary/40 flex items-center gap-1.5">
                                                <Hash className="w-3 h-3" /> {event.metadata.tx_hash.slice(0,12)}...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Footer Insights */}
            <div className="pt-20 grid grid-cols-1 md:grid-cols-2 gap-8 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                <Card className="bg-white/5 border-white/5 backdrop-blur-sm p-8 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-4 h-12">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                             <Satellite className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-black italic uppercase tracking-widest">Global Sync</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                        Every interaction on the platform is mirrored in our centralized activity ledger. High-value trust events are additionally hashed to the Solana blockchain for immutable proof.
                    </p>
                </Card>
                <Card className="bg-white/5 border-white/5 backdrop-blur-sm p-8 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-4 h-12">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl">
                             <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-black italic uppercase tracking-widest text-emerald-500">Reputation Nexus</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                        Your activity log contributes to your overall Personnel Resonance. Maintaining a consistent record of verified skills and applications increases your ranking in recruiter searches.
                    </p>
                </Card>
            </div>
        </div>
    )
}
