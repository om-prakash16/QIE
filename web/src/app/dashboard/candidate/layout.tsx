"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
    LayoutDashboard,
    UserPen,
    Briefcase,
    ClipboardList,
    Shield,
    FolderGit2,
    Trophy,
    Gem,
    Sparkles,
    Settings,
    LogOut,
    Zap,
    Zap,
    Brain,
    Users,
    Route,
    Gamepad2,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"

const candidateLinks = [
    { href: "/dashboard/candidate", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/candidate/edit", label: "Edit Profile", icon: UserPen },
    { href: "/dashboard/candidate/jobs", label: "Job Matches", icon: Briefcase },
    { href: "/dashboard/candidate/applications", label: "Applications", icon: ClipboardList },
    { href: "/dashboard/candidate/skills", label: "Skill Verify", icon: Shield },
    { href: "/dashboard/candidate/portfolio", label: "Portfolio", icon: FolderGit2 },
    { href: "/dashboard/candidate/reputation", label: "Reputation", icon: Trophy },
    { href: "/dashboard/candidate/nfts", label: "NFT Credentials", icon: Gem },
    { href: "/dashboard/candidate/insights", label: "AI Insights", icon: Brain },
    { href: "/dashboard/candidate/career", label: "Career Roadmap", icon: Route },
    { href: "/dashboard/candidate/interview", label: "Interview Prep", icon: Gamepad2 },
    { href: "/dashboard/candidate/community", label: "Community", icon: Users },
    { href: "/dashboard/candidate/settings", label: "Settings", icon: Settings },
]

export default function CandidateDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { logout, user } = useAuth()

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className={cn(
                "w-72 bg-background/60 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen sticky top-0 shrink-0 z-50",
                "before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/5 before:to-transparent before:pointer-events-none"
            )}>
                {/* Ambient Glows */}
                <div className="absolute top-0 -left-20 w-40 h-40 bg-primary/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-20 -right-20 w-40 h-40 bg-primary/5 blur-[80px] pointer-events-none" />

                {/* Brand */}
                <div className="p-8 relative">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <motion.div
                                className="absolute -inset-2 bg-primary/25 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-2.5 rounded-xl border border-primary/30 backdrop-blur-md relative shadow-lg shadow-primary/5">
                                <Zap className="w-6 h-6 text-primary fill-primary/10" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:from-primary group-hover:to-primary/80 transition-all duration-500">
                                Best Hiring Tool
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-primary/60 font-bold">User Panel</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                    {candidateLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link key={link.href} href={link.href} className="block relative group/item">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3.5 relative z-10 transition-all duration-500 rounded-xl overflow-hidden px-4 h-12",
                                        isActive
                                            ? "text-primary bg-primary/5 border border-primary/10 shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    )}
                                >
                                    <div className={cn(
                                        "p-1.5 rounded-lg transition-all duration-500",
                                        isActive ? "bg-primary/10" : "bg-transparent group-hover/item:bg-white/5"
                                    )}>
                                        <link.icon className={cn(
                                            "w-4 h-4 transition-all duration-500 group-hover/item:scale-110",
                                            isActive ? "text-primary" : "text-muted-foreground group-hover/item:text-foreground"
                                        )} />
                                    </div>
                                    <span className={cn(
                                        "text-sm tracking-wide transition-colors",
                                        isActive ? "font-semibold" : "font-normal"
                                    )}>
                                        {link.label}
                                    </span>
                                    {isActive && (
                                        <>
                                            <motion.div
                                                layoutId="candidate-sidebar-glow"
                                                className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full blur-[2px]"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            <motion.div
                                                layoutId="candidate-sidebar-bg"
                                                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </>
                                    )}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Info + Logout */}
                <div className="p-6 mt-auto border-t border-white/5 space-y-3 bg-gradient-to-b from-transparent to-primary/5">
                    {user && (
                        <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-sm font-semibold truncate">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono truncate">{user.wallet_address?.slice(0, 12)}...</p>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive/80 hover:text-destructive hover:bg-destructive/10 h-11 px-4 rounded-xl group"
                        onClick={logout}
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Sign Out</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-screen">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
