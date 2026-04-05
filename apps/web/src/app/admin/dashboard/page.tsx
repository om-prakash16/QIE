"use client"

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Loader2, 
    ArrowUpRight, 
    Activity, 
    ShieldCheck, 
    Globe, 
    Search,
    Monitor,
    MoreHorizontal,
    Zap,
    Users
} from "lucide-react"
import { QuickStats, PlatformActivityChart } from "@/components/features/admin/admin-charts"
import ColosseumAnalysis from "@/components/features/admin/colosseum-analysis"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["adminStats"],
        queryFn: async () => {
            const [
                { count: totalUsers },
                { count: totalCompanies },
                { count: activeJobs },
                { data: recentUsers }
            ] = await Promise.all([
                supabase.from('users').select('*', { count: 'exact', head: true }).neq('role', 'company').neq('role', 'admin'),
                supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'company'),
                supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
                supabase.from('users').select('*').order('created_at', { ascending: false }).limit(5)
            ])

            return {
                totalUsers: totalUsers || 0,
                totalCompanies: totalCompanies || 0,
                activeJobs: activeJobs || 0,
                recentUsers: recentUsers || []
            }
        }
    })

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
        <div className="space-y-12 pb-24 max-w-[1600px] mx-auto overflow-visible relative">
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
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 mb-1">Nexus Command</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-foreground">
                                Platform Overview
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground bg-white/5 px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-sm w-fit group cursor-default hover:border-primary/20 transition-colors">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500/80">System operational</span>
                        <div className="h-3 w-px bg-white/10 mx-1" />
                        <span className="text-[11px] font-bold text-muted-foreground/60">Node: 0xSkillsutra.Alpha</span>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center gap-4"
                >
                    <Button variant="outline" className="bg-background/20 backdrop-blur-xl border-white/10 rounded-2xl px-8 h-14 hover:bg-white/5 shadow-xl transition-all duration-300 group">
                        <Globe className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-1000" />
                        <span className="font-bold tracking-tight">Intelligence Logs</span>
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-10 h-14 shadow-[0_15px_30px_-10px_rgba(var(--primary),0.4)] border-t border-white/20 font-black tracking-tight text-lg group overflow-hidden relative">
                        <span className="relative z-10">Deploy Asset</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Button>
                </motion.div>
            </header>

            <QuickStats stats={stats} />

            <div className="grid grid-cols-1 xl:grid-cols-6 gap-10">
                <div className="xl:col-span-4 min-h-[500px]">
                    <PlatformActivityChart />
                </div>

                <div className="xl:col-span-2">
                    <Card className="bg-background/20 backdrop-blur-2xl border-white/10 h-full relative group overflow-hidden flex flex-col shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />
                        
                        <CardHeader className="flex flex-row items-center justify-between pb-8 relative z-10">
                            <div>
                                <CardTitle className="text-xl font-black font-heading tracking-tight">Neural Feed</CardTitle>
                                <CardDescription className="text-xs font-semibold text-primary/60 uppercase tracking-widest mt-1">Real-time awareness</CardDescription>
                            </div>
                            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 rotate-12">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-2 flex-1 relative z-10">
                            {[
                                { event: "Talent Protocol Sync", time: "2m", detail: "Global database update complete.", icon: ShieldCheck, color: "text-blue-400" },
                                { event: "Network Expansion", time: "15m", detail: "New partner node established.", icon: Globe, color: "text-emerald-400" },
                                { event: "Inertia Analysis", time: "45m", detail: "AI job matching optimization finished.", icon: Activity, color: "text-rose-400" },
                                { event: "Chain Verification", time: "2h", detail: "SBT metadata proof locked.", icon: Zap, color: "text-amber-400" },
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="flex gap-5 group/item cursor-default"
                                >
                                    <div className="relative flex flex-col items-center">
                                        <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 transition-all duration-500 group-hover/item:scale-110 shadow-lg group-hover/item:bg-primary/10 group-hover/item:border-primary/20`}>
                                            <item.icon className={`w-4 h-4 ${item.color}`} />
                                        </div>
                                        {i < 3 && <div className="w-px h-full bg-gradient-to-b from-white/10 to-transparent mt-2" />}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-sm font-black text-foreground/90 group-hover/item:text-primary transition-colors">{item.event}</p>
                                            <span className="text-[10px] text-muted-foreground/50 font-black uppercase tracking-tighter">{item.time}</span>
                                        </div>
                                        <p className="text-[12px] text-muted-foreground/70 font-medium leading-relaxed group-hover/item:text-muted-foreground transition-colors">{item.detail}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </CardContent>
                        <div className="p-6 pt-0 mt-auto relative z-10">
                            <Button variant="ghost" className="w-full text-xs font-black text-primary/70 hover:text-primary bg-primary/5 hover:bg-primary/10 rounded-xl h-11 border border-primary/10 group transition-all">
                                OPEN INTELLIGENCE HUB
                                <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            <ColosseumAnalysis />

            <Card className="bg-background/20 backdrop-blur-3xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden relative group rounded-3xl">
                {/* Accent line at the top */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 p-8 border-b border-white/5 bg-white/2">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Users className="w-5 h-5 text-primary" />
                            <CardTitle className="text-2xl font-black font-heading tracking-tighter">Identity Management</CardTitle>
                        </div>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-8">Advanced protocol orchestration</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group/search">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 transition-colors group-hover/search:text-primary" />
                            <input 
                                className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder:text-muted-foreground/30 shadow-inner" 
                                placeholder="Locate entity by name or hash..."
                            />
                        </div>
                        <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 shadow-lg">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-white/5 hover:bg-transparent bg-white/2">
                                <TableHead className="font-black text-muted-foreground/50 py-6 pl-8 uppercase tracking-widest text-[10px]">Matrix Identity</TableHead>
                                <TableHead className="font-black text-muted-foreground/50 uppercase tracking-widest text-[10px]">Access Point</TableHead>
                                <TableHead className="font-black text-muted-foreground/50 uppercase tracking-widest text-[10px]">Classification</TableHead>
                                <TableHead className="font-black text-muted-foreground/50 uppercase tracking-widest text-[10px]">Protocol Sync</TableHead>
                                <TableHead className="text-right font-black text-muted-foreground/50 pr-8 uppercase tracking-widest text-[10px]">System Access</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats?.recentUsers.map((u, i) => (
                                <motion.tr 
                                    key={u.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + (i * 0.08) }}
                                    className="border-b border-white/5 hover:bg-primary/5 group/row transition-all duration-300"
                                >
                                    <TableCell className="py-7 pl-8 font-medium">
                                        <div className="flex items-center gap-4">
                                            <div className="relative group/avatar">
                                                <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 border border-white/10 flex items-center justify-center font-black text-primary text-xl relative shadow-lg group-hover/row:rotate-3 transition-all duration-500">
                                                    {u.full_name?.charAt(0) || u.email.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-base text-foreground/90 tracking-tight group-hover/row:text-primary transition-colors">{u.full_name || 'Anonymous Entity'}</span>
                                                <span className="text-[10px] text-primary/60 font-black uppercase tracking-[0.1em]">{u.id.substring(0, 12)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-bold tracking-tight italic opacity-70 group-hover/row:opacity-100 transition-opacity">{u.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "rounded-xl px-4 py-1.5 border border-white/5 shadow-xl transition-all duration-500 font-black text-[10px] uppercase tracking-widest",
                                            u.role === 'company' 
                                                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover/row:bg-blue-500/20' 
                                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover/row:bg-emerald-500/20'
                                        )}>
                                            {u.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground/60 font-black text-xs uppercase tracking-tighter">
                                        {new Date(u.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Button variant="ghost" size="sm" className="bg-white/5 border border-white/5 rounded-xl font-black text-xs group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-300 h-11 px-6 shadow-lg">
                                            MODIFY PROTOCOL
                                            <ArrowUpRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </Button>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
