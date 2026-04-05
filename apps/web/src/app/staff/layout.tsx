"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
    LayoutDashboard, 
    UserX, 
    Briefcase, 
    ShieldAlert, 
    MessageSquare, 
    Activity, 
    Terminal,
    ChevronRight,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
    { name: "Dashboard", href: "/staff", icon: LayoutDashboard },
    { name: "User Moderation", href: "/staff/users", icon: UserX },
    { name: "Jobs Moderation", href: "/staff/jobs", icon: Briefcase },
    { name: "Report Center", href: "/staff/reports", icon: ShieldAlert },
    { name: "Support Tickets", href: "/staff/tickets", icon: MessageSquare },
    { name: "NFT Monitoring", href: "/staff/nft-activity", icon: Activity },
    { name: "AI Metrics", href: "/staff/ai-logs", icon: Terminal },
]

export default function StaffLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 font-sans selection:text-primary">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full opacity-30" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* Sidebar */}
            <aside className="fixed top-0 left-0 bottom-0 w-72 bg-black/40 backdrop-blur-2xl border-r border-white/5 z-50 overflow-y-auto">
                <div className="p-8 pb-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-all duration-500 shadow-lg shadow-primary/10">
                            <ShieldAlert className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase font-heading">
                            Skill<span className="text-primary italic">Ops</span>
                        </span>
                    </Link>
                </div>

                <nav className="px-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                                    isActive 
                                        ? "bg-primary/10 text-primary" 
                                        : "text-white/40 hover:bg-white/5 hover:text-white/80"
                                )}
                            >
                                <div className="flex items-center gap-3.5 relative z-10">
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                        isActive ? "text-primary" : "text-inherit"
                                    )} />
                                    <span className="text-sm font-bold tracking-tight">{item.name}</span>
                                </div>
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-pill"
                                        className="w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50"
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="absolute bottom-6 left-4 right-4 group">
                    <button className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all duration-300 group">
                        <div className="w-8 h-8 rounded-lg bg-red-400/10 flex items-center justify-center group-hover:bg-red-400/20 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pl-72 pt-8 pr-12 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
