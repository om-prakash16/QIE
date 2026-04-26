"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Search, 
    Zap, 
    Briefcase, 
    Users, 
    Building2, 
    Command, 
    ArrowRight,
    Loader2,
    Settings,
    User,
    LayoutDashboard,
    PlusCircle,
    X,
    ShieldAlert
} from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api/api-client"
import { cn } from "@/lib/utils"

export function CommandSearch() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<{ jobs: any[], talent: any[], actions: any[] }>({
        jobs: [],
        talent: [],
        actions: []
    })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const toggle = useCallback(() => setIsOpen(o => !o), [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                toggle()
            }
            if (e.key === "Escape") {
                setIsOpen(false)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggle])

    // Mock/Static Actions
    const staticActions = [
        { id: '1', title: 'Mission Control', icon: <LayoutDashboard className="w-4 h-4"/>, href: '/user/dashboard', category: 'Navigation' },
        { id: '2', title: 'Post New Mission', icon: <PlusCircle className="w-4 h-4"/>, href: '/company/post-job', category: 'Actions' },
        { id: '3', title: 'Reputation Nexus', icon: <User className="w-4 h-4"/>, href: '/user/profile', category: 'Personnel' },
        { id: '4', title: 'System Settings', icon: <Settings className="w-4 h-4"/>, href: '/user/settings', category: 'Administration' },
        { id: '5', title: 'Admin Intelligence', icon: <ShieldAlert className="w-4 h-4"/>, href: '/admin', category: 'Administration' }
    ]

    const handleSearch = async (val: string) => {
        setQuery(val)
        if (val.length < 2) {
            setResults({ jobs: [], talent: [], actions: staticActions })
            return
        }

        setIsLoading(true)
        try {
            // Fetch jobs and potentially talent
            const [jobs] = await Promise.all([
                api.jobs.list()
            ])
            
            setResults({
                jobs: jobs.slice(0, 3) || [],
                talent: [], // Could implement talent search later
                actions: staticActions.filter(a => a.title.toLowerCase().includes(val.toLowerCase()))
            })
        } catch (e) {
            console.error("Search sync failed", e)
        } finally {
            setIsLoading(false)
        }
    }

    const navigate = (href: string) => {
        router.push(href)
        setIsOpen(false)
        setQuery("")
    }

    return (
        <>
            {/* Search Trigger (Hidden text mostly, just the icon usually) */}
            <button 
                onClick={toggle}
                className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-primary/40 transition-all text-muted-foreground group"
            >
                <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
                <span className="text-xs font-black uppercase tracking-widest">Search Nexus</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-1.5 font-mono text-[10px] font-medium opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            {/* Search Input Area */}
                            <div className="flex items-center gap-4 p-6 border-b border-white/5">
                                <Search className="w-6 h-6 text-primary animate-pulse" />
                                <input 
                                    autoFocus
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search mission parameters, personnel, or systems..."
                                    className="bg-transparent border-none focus:ring-0 w-full text-xl font-black italic tracking-tight text-white placeholder:text-white/20"
                                />
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-primary/40" />
                                ) : (
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20">⌘K</div>
                                )}
                            </div>

                            {/* Results Area */}
                            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                                {query.length === 0 && (
                                    <div className="p-4 mb-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Jump To</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {staticActions.map(action => (
                                                <button
                                                    key={action.id}
                                                    onClick={() => navigate(action.href)}
                                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-primary/30 transition-all text-left group"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        {action.icon}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black italic tracking-tight text-white">{action.title}</p>
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/20">{action.category}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {results.jobs.length > 0 && (
                                    <div className="space-y-2 mb-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 px-4">Detected Missions</p>
                                        {results.jobs.map(job => (
                                            <button
                                                key={job.id}
                                                onClick={() => navigate(`/jobs/${job.id}`)}
                                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.05] group transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Briefcase className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                                                    <span className="font-bold text-white/80 group-hover:text-white">{job.title}</span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-white/0 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {query.length > 0 && results.jobs.length === 0 && results.actions.length === 0 && !isLoading && (
                                    <div className="py-20 text-center">
                                        <Zap className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                        <p className="text-white/20 font-black italic uppercase tracking-widest">No matching parameters detected in Nexus.</p>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Status Bar */}
                            <div className="bg-white/[0.02] border-t border-white/5 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/30">
                                        <kbd className="border border-white/10 px-1 rounded bg-white/5">⏎</kbd> Select
                                    </div>
                                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/30">
                                        <kbd className="border border-white/10 px-1 rounded bg-white/5">ESC</kbd> Close
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary/40 italic">
                                    Strategic Discovery v1.0
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
