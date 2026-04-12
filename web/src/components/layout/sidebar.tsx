"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
    LayoutDashboard,
    User,
    Briefcase,
    Bookmark,
    Settings,
    LogOut,
    Building2,
    Users,
    Zap,
    Code,
    Brain,
    Boxes,
    History,
    ShieldAlert
} from "lucide-react"

import { useAuth } from "@/context/auth-context"

interface SidebarProps {
    role: "user" | "company" | "admin"
    className?: string
    variant?: "default" | "mobile"
}

export function Sidebar({ role, className, variant = "default" }: SidebarProps) {
    const pathname = usePathname()
    const { logout } = useAuth()

    const userLinks = [
        { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/user/profile", label: "My Profile", icon: User },
        { href: "/user/applications", label: "Applied Jobs", icon: Briefcase },
        { href: "/user/saved", label: "Saved Jobs", icon: Bookmark },
    ]

    const companyLinks = [
        { href: "/company/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/company/jobs", label: "Manage Jobs", icon: Briefcase },
        { href: "/company/applicants", label: "Applicants", icon: Users },
        { href: "/company/profile", label: "Company Profile", icon: Building2 },
    ]

    const adminLinks = [
        { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/users", label: "Manage Users", icon: Users },
        { href: "/admin/companies", label: "Partner Matrix", icon: Building2 },
        { href: "/admin/reports", label: "Moderation Queue", icon: ShieldAlert },
        { href: "/admin/schema", label: "Schema Builder", icon: Code },
        { href: "/admin/taxonomy", label: "Taxonomy Manager", icon: Boxes },
        { href: "/admin/ai-config", label: "AI & Reputation", icon: Brain },
        { href: "/admin/blockchain", label: "Digital Identity", icon: Zap },
        { href: "/admin/features", label: "Feature Flags", icon: Zap },
        { href: "/admin/subscriptions", label: "SaaS Plans", icon: Building2 },
        { href: "/admin/logs", label: "Audit Stream", icon: History },
        { href: "/admin/settings", label: "System Protocol", icon: Settings },
    ]


    const links = role === "company" ? companyLinks : role === "admin" ? adminLinks : userLinks

    return (
        <aside className={cn(
            variant === "default" 
                ? "w-64 bg-background/60 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen sticky top-0 shrink-0 z-50"
                : "w-full flex flex-col h-full bg-transparent border-none",
            "before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/5 before:to-transparent before:pointer-events-none",
            className
        )}>
            {/* Ambient Background Glows - Only in default */}
            {variant === "default" && (
                <>
                    <div className="absolute top-0 -left-20 w-40 h-40 bg-primary/10 blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-20 -right-20 w-40 h-40 bg-primary/5 blur-[80px] pointer-events-none" />
                </>
            )}

            {variant === "default" && (
                <div className="p-8 relative">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <motion.div 
                            className="absolute -inset-2 bg-primary/25 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                        <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-2.5 rounded-xl border border-primary/30 backdrop-blur-md relative shadow-lg shadow-primary/5">
                            <Zap className="w-6 h-6 text-primary fill-primary/10 group-hover:fill-primary/20 transition-colors" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold font-heading tracking-tight block bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70 group-hover:from-primary group-hover:to-primary/80 transition-all duration-500">
                            Best Hiring Tool
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-primary/60 font-bold">Talent Engine</span>
                    </div>
                </Link>
            </div>
            )}

            <nav className={cn(
                "flex-1 space-y-2 overflow-y-auto custom-scrollbar relative",
                variant === "default" ? "px-4 py-4" : "px-0 py-2"
            )}>
                {links.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link key={link.href} href={link.href} className="block relative group/item">
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-4 relative z-10 transition-all duration-500 rounded-xl overflow-hidden px-4 h-14",
                                    isActive 
                                        ? "text-primary bg-primary/5 border border-primary/10 shadow-sm" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-lg transition-all duration-500",
                                    isActive ? "bg-primary/10" : "bg-transparent group-hover/item:bg-white/5"
                                )}>
                                    <link.icon className={cn(
                                        "w-5 h-5 transition-all duration-500 group-hover/item:scale-110",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover/item:text-foreground"
                                    )} />
                                </div>
                                
                                <span className={cn(
                                    "text-sm font-medium tracking-wide transition-colors",
                                    isActive ? "font-semibold" : "font-normal"
                                )}>
                                    {link.label}
                                </span>
                                
                                {isActive && (
                                    <>
                                        <motion.div
                                            layoutId="sidebar-active-glow"
                                            className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full blur-[2px]"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <motion.div
                                            layoutId="sidebar-active-bg"
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

            {variant === "default" && (
                <div className="p-6 mt-auto border-t border-white/5 space-y-4 bg-gradient-to-b from-transparent to-primary/5 backdrop-blur-md">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 shadow-inner">
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-3 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all h-11 px-4 rounded-xl group" 
                            onClick={logout}
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm">Sign Out</span>
                        </Button>
                    </div>
                </div>
            )}
        </aside>
    )
}
