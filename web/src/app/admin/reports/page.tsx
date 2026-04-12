"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
    AlertTriangle, 
    ShieldAlert, 
    CheckCircle2, 
    XCircle, 
    Eye, 
    MessageSquare, 
    User, 
    Briefcase,
    Filter,
    Loader2,
    Flag,
    Terminal
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function ModerationCenter() {
    const [reports, setReports] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState("pending")

    useEffect(() => {
        fetchReports()
    }, [])

    const fetchReports = async () => {
        setIsLoading(true)
        try {
            if (api.staff.getReports) {
                const data = await api.staff.getReports?.(`status=${filter === 'all' ? '' : filter.toUpperCase()}`) || [];
                setReports(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            toast.error("Failed to load moderation queue.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAction = (id: string, action: 'dismiss' | 'block') => {
        toast.info(`Protocol ${action.toUpperCase()} executed for ${id}`)
        setReports(prev => prev.filter(r => r.id !== id))
    }

    const filteredReports = reports.filter(r => filter === "all" || r.status === filter)

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-rose-500/30 text-rose-500 bg-rose-500/5 px-4 font-black tracking-widest text-[9px] uppercase italic">
                            Platform Integrity Node
                        </Badge>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tighter text-white uppercase italic flex items-center gap-6">
                        Moderation <span className="text-rose-500">Center</span>
                        <ShieldAlert className="w-12 h-12 text-rose-500 animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-medium">
                        Heuristic monitoring of community reports, behavioral flags, and potential protocol violations. Govern with absolute authority to ensure ecosystem stability.
                    </p>
                </div>
                <div className="flex gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                    {["pending", "resolved", "all"].map((f) => (
                        <Button 
                            key={f} 
                            onClick={() => setFilter(f)}
                            variant="ghost" 
                            className={`h-12 px-6 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all ${filter === f ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-white/40 hover:text-white'}`}
                        >
                            {f} Queue
                        </Button>
                    ))}
                </div>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-rose-500/30 border-t-2 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
                <CardHeader className="bg-black/40 border-b border-white/10 relative z-10">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl flex items-center gap-3 italic font-black uppercase tracking-widest">
                            <Flag className="w-6 h-6 text-rose-500" /> Active Disruption Flags
                        </CardTitle>
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-mono">
                            {filteredReports.length} SIGNAL(S) DETECTED
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0 relative z-10">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-white/10 hover:bg-transparent uppercase font-black text-[10px] tracking-widest">
                                <TableHead className="px-8 h-14">Incident ID</TableHead>
                                <TableHead className="h-14">Violation Vector</TableHead>
                                <TableHead className="h-14">Target Entity</TableHead>
                                <TableHead className="h-14">Severity</TableHead>
                                <TableHead className="text-right px-8 h-14">Administrative Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-32 text-center text-white/20">
                                            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
                                            <span className="font-black italic uppercase tracking-widest text-xs">Scanning Platform Mesh...</span>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredReports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-32 text-center text-white/10 italic font-black tracking-widest uppercase text-xs">
                                            No disruptive signals detected in current scope.
                                        </TableCell>
                                    </TableRow>
                                ) : filteredReports.map((report, idx) => (
                                    <motion.tr 
                                        key={report.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                                    >
                                        <TableCell className="px-8 font-mono text-xs text-white/40">{report.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className={`w-4 h-4 ${report.severity === 'high' ? 'text-rose-500' : 'text-amber-500'}`} />
                                                <span className="font-black italic uppercase text-xs text-white/80">{report.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white tracking-tight">{report.target}</span>
                                                <span className="text-[10px] text-white/20 italic">Reporter: {report.reporter}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest ${report.severity === 'high' ? 'border-rose-500/30 text-rose-500 bg-rose-500/5' : 'border-amber-500/30 text-amber-500 bg-amber-500/5'}`}>
                                                {report.severity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right px-8">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/10 border border-emerald-500/10" onClick={() => handleAction(report.id, 'dismiss')}>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 border border-rose-500/10" onClick={() => handleAction(report.id, 'block')}>
                                                    <XCircle className="w-5 h-5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-white/20 hover:text-white hover:bg-white/10 border border-white/10">
                                                    <Eye className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* AI Watch Section */}
            <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                 <div className="absolute top-0 left-0 w-32 h-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
                 <div className="p-5 bg-indigo-500/20 rounded-3xl border border-indigo-500/30">
                     <Terminal className="w-10 h-10 text-indigo-400" />
                 </div>
                 <div className="space-y-2 flex-1 relative z-10">
                     <h3 className="text-xl font-black italic uppercase italic text-indigo-400">Heuristic Spam Protocol Active</h3>
                     <p className="text-xs text-indigo-300/60 font-medium italic">Spam and fraud vectors are automatically neutralized by the AI layer. Manual review is only triggered for high-entropy violations or user appeals. Currently monitoring 1,240 active nodes.</p>
                 </div>
                 <Button className="bg-indigo-500 hover:bg-indigo-400 text-white font-black tracking-widest uppercase px-10 h-14 rounded-2xl shadow-xl shadow-indigo-500/20">
                     View AI Metrics
                 </Button>
            </div>
        </div>
    )
}
