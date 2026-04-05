"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Zap, 
    Search, 
    ShieldCheck, 
    Globe, 
    Loader2, 
    ChevronRight, 
    Activity,
    Info,
    AlertCircle,
    Target,
    BarChart3
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const BACKEND_URL = "http://localhost:8000"

export default function ColosseumAnalysis() {
    const [query, setQuery] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [status, setStatus] = useState<any>(null)
    const [results, setResults] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        checkStatus()
    }, [])

    const checkStatus = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/v1/colosseum/status`)
            const data = await res.json()
            setStatus(data)
        } catch (err) {
            console.error("Colosseum check failed", err)
        }
    }

    const runAnalysis = async () => {
        if (!query.trim()) return
        setIsAnalyzing(true)
        setError(null)
        try {
            const res = await fetch(`${BACKEND_URL}/api/v1/colosseum/query`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || "Analysis failed")
            setResults(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <Card className="bg-background/20 backdrop-blur-3xl border-white/10 shadow-2xl relative overflow-hidden group rounded-3xl min-h-[600px] flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <CardHeader className="border-b border-white/5 bg-white/2 p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5">
                            <Target className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black font-heading tracking-tighter flex items-center gap-2">
                                Colosseum Copilot
                                <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-black bg-primary/10 border-primary/20 text-primary">Beta</Badge>
                            </CardTitle>
                            <CardDescription className="text-xs font-semibold text-primary/60 uppercase tracking-widest mt-1">Solana Startup Intelligence</CardDescription>
                        </div>
                    </div>
                    {status?.authenticated ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-emerald-500/80">Authenticated</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-[10px] font-black uppercase text-amber-500/80">Connecting...</span>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-8 flex-1 flex flex-col gap-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Project Idea / Query</label>
                        <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-wider">Search 5,400+ Hackathon Entries</span>
                    </div>
                    <div className="relative group/input">
                        <Textarea 
                            placeholder="Describe your Solana project or ask about market trends..."
                            className="bg-white/5 border-white/5 rounded-2xl py-6 px-6 min-h-[120px] focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/30 resize-none shadow-inner text-lg"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <div className="absolute top-4 right-4 group-hover/input:scale-110 transition-transform">
                            <Info className="w-5 h-5 text-primary/20" />
                        </div>
                    </div>
                    <Button 
                        disabled={isAnalyzing || !query.trim()}
                        onClick={runAnalysis}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-14 shadow-[0_15px_30px_-10px_rgba(var(--primary),0.4)] font-black tracking-tight text-lg group"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                <span className="animate-pulse tracking-widest uppercase text-sm">Parsing Ecosystem Data...</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                                Execute Strategic Analysis
                            </>
                        )}
                    </Button>
                </div>

                <div className="flex-1 min-h-[300px] bg-white/2 rounded-3xl border border-white/5 overflow-hidden flex flex-col relative">
                    <ScrollArea className="flex-1 p-6">
                        <AnimatePresence mode="wait">
                            {results ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <h3 className="font-black text-foreground tracking-tight italic">Analysis Report</h3>
                                    </div>
                                    <div className="prose prose-invert prose-sm max-w-none text-muted-foreground/90 leading-relaxed font-medium">
                                        {/* Assuming answer comes back as string from conversational mode */}
                                        {results.answer || results.output || JSON.stringify(results, null, 2)}
                                    </div>
                                    {results.sources && (
                                        <div className="mt-8 pt-6 border-t border-white/5">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-4 flex items-center gap-2">
                                                <Globe className="w-3 h-3" />
                                                Citations & References
                                            </p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {results.sources.map((s: any, idx: number) => (
                                                    <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 text-[11px] font-bold text-muted-foreground hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between group/source">
                                                        <span className="truncate pr-2">{s.title || s.name || `Source ${idx + 1}`}</span>
                                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover/source:opacity-100 transition-opacity" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : isAnalyzing ? (
                                <div className="space-y-6">
                                    <Skeleton className="h-4 w-3/4 opacity-20" />
                                    <Skeleton className="h-4 w-full opacity-10" />
                                    <Skeleton className="h-4 w-5/6 opacity-20" />
                                    <Skeleton className="h-4 w-2/3 opacity-10" />
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <AlertCircle className="w-12 h-12 text-rose-500/50 mb-4" />
                                    <p className="text-sm font-bold text-rose-400/80 mb-2">Request Failed</p>
                                    <p className="text-xs text-muted-foreground/60 max-w-xs">{error}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                                    <Activity className="w-16 h-16 text-primary/30 mb-4" />
                                    <p className="text-sm font-black text-foreground/40 uppercase tracking-widest">Awaiting Command</p>
                                    <p className="text-xs text-muted-foreground/40 mt-2">Enter your project context above to start</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}

function Skeleton({ className }: { className: string }) {
    return <div className={`animate-pulse rounded bg-foreground/20 ${className}`} />
}
