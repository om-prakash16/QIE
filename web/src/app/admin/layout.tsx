"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/auth/login")
            } else if (user.role !== "admin") {
                router.push("/user/dashboard")
            }
        }
    }, [user, isLoading, router])

    if (isLoading || !user || user.role !== "admin") {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-[#020617] text-white overflow-hidden relative">
                {/* Background Glows */}
                <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <div className="absolute inset-0 bg-primary/30 blur-[120px] rounded-full" />
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 relative backdrop-blur-3xl shadow-2xl shadow-black/50 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                        <motion.div
                            animate={{ 
                                rotate: [0, 360],
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-12 -right-12 w-24 h-24 bg-primary/20 blur-2xl rounded-full"
                        />
                        <Zap className="h-16 w-16 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mt-12 flex flex-col items-center gap-4 relative z-10"
                >
                    <div className="flex flex-col items-center">
                        <p className="text-2xl font-black font-heading tracking-[0.6em] uppercase text-white/90 mb-1">Nexus Admin</p>
                        <p className="text-[10px] font-black tracking-[0.8em] uppercase text-primary/60 ml-2">Secure Terminal Access</p>
                    </div>
                    
                    <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                        <div className="relative h-4 w-4">
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                            <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                        <span className="text-[11px] font-black text-white/40 uppercase tracking-widest animate-pulse">Syncing matrix protocols...</span>
                    </div>
                </motion.div>
                
                {/* Decorative border elements */}
                <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-white/5 rounded-tl-3xl" />
                <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-white/5 rounded-br-3xl" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-[#030712] text-slate-50 selection:bg-primary/40 overflow-hidden">
            {/* Advanced Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {/* Primary Mesh Glow */}
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/[0.07] blur-[160px] rounded-full animate-pulse" />
                
                {/* Secondary Accent Glow */}
                <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-blue-500/[0.03] blur-[140px] rounded-full" />
                
                {/* Tertiary Corner Glow */}
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-emerald-500/[0.04] blur-[180px] rounded-full" />
                
                {/* Subtle Grain Texture Overly */}
                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                {/* Interactive Light Follow (Conceptual/Static) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient(circle,transparent_0%,#030712_100%) opacity-40" />
            </div>

            <Sidebar role="admin" />
            
            <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth custom-scrollbar z-10">
                {/* Top dynamic header blur mask */}
                <div className="sticky top-0 w-full h-12 bg-gradient-to-b from-[#030712] to-transparent z-30 pointer-events-none opacity-80" />
                
                <div className="w-full px-6 py-6 md:px-16 md:py-16 max-w-[1900px] mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 1.02 }}
                            transition={{ 
                                duration: 1, 
                                ease: [0.22, 1, 0.36, 1],
                                opacity: { duration: 0.8 }
                            }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom dynamic fade mask */}
                <div className="sticky bottom-0 w-full h-12 bg-gradient-to-t from-[#030712] to-transparent z-30 pointer-events-none opacity-60" />
            </main>
        </div>
    )
}
