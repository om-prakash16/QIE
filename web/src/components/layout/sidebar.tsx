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
    ShieldAlert,
    Fingerprint,
    FileText,
    BarChart3,
    Flag,
    Tags,
    Globe,
    Cpu,
    Activity,
    ChevronRight,
    CreditCard,
} from "lucide-react"

import { useAuth } from "@/context/auth-context"

interface SidebarProps {
    role: "user" | "company" | "admin"
    className?: string
    variant?: "default" | "mobile"
}

const adminNavGroups = [
    {
        label: "Overview",
        links: [
            { href: "/admin", label: "Global Surveillance", icon: LayoutDashboard, exact: true },
            { href: "/admin/logs", label: "Audit Stream", icon: History },
            { href: "/admin/analytics", label: "Deep Analytics", icon: BarChart3 },
        ]
    },
    {
        label: "Entity Governance",
        links: [
            { href: "/admin/users", label: "Entity Registry", icon: Users },
            { href: "/admin/companies", label: "Partner Matrix", icon: Building2 },
            { href: "/admin/reports", label: "Moderation Queue", icon: Flag },
        ]
    },
    {
        label: "Content & Schema",
        links: [
            { href: "/admin/cms", label: "Content Orchestrator", icon: Globe },
            { href: "/admin/schema", label: "Meta-Schema Engine", icon: Code },
            { href: "/admin/taxonomy", label: "Taxonomy Manager", icon: Tags },
        ]
    },
    {
        label: "Intelligence",
        links: [
            { href: "/admin/ai-config", label: "Resonance Tuning", icon: Brain },
            { href: "/admin/ai-logs", label: "AI Evaluation Logs", icon: Activity },
            { href: "/admin/jobs", label: "Job Oversight", icon: Briefcase },
            { href: "/admin/applications", label: "Applications", icon: FileText },
        ]
    },
    {
        label: "Infrastructure",
        links: [
            { href: "/admin/blockchain", label: "Blockchain Ledger", icon: Fingerprint },
            { href: "/admin/features", label: "Feature Flags", icon: Zap },
            { href: "/admin/subscriptions", label: "SaaS Plans", icon: CreditCard },
            { href: "/admin/settings", label: "System Protocols", icon: Settings },
        ]
    },
]

const userLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/edit", label: "My Profile", icon: User },
    { href: "/applications", label: "Applied Jobs", icon: Briefcase },
    { href: "/dashboard/jobs", label: "Job Matches", icon: Brain },
    { href: "/dashboard/saved", label: "Saved Jobs", icon: Bookmark },
    { href: "/dashboard/skills", label: "Skills & NFTs", icon: Zap },
    { href: "/dashboard/nfts", label: "NFT Portfolio", icon: Fingerprint },
    { href: "/dashboard/career", label: "Career Planning", icon: BarChart3 },
    { href: "/dashboard/interview", label: "Interview Prep", icon: Cpu },
    { href: "/dashboard/community", label: "Community", icon: Users },
]

const companyLinks = [
    { href: "/company/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/company/jobs", label: "Manage Jobs", icon: Briefcase },
    { href: "/company/applicants", label: "Applicants", icon: Users },
    { href: "/company/api", label: "Developer API", icon: Code },
    { href: "/company/profile", label: "Company Profile", icon: Building2 },
]

export function Sidebar({ role, className, variant = "default" }: SidebarProps) {
    const pathname = usePathname()
    const { logout, user } = useAuth()

    const isActiveLink = (href: string, exact = false) => {
        if (exact) return pathname === href
        return pathname === href || pathname.startsWith(href + "/")
    }

    const accentColor = role === "admin" ? "rose" : "primary"
    const accentClass = role === "admin" ? "text-rose-400" : "text-primary"
    const accentBg = role === "admin" ? "bg-rose-500/15 border-rose-500/20" : "bg-primary/10 border-primary/20"
    const accentGlow = role === "admin" ? "bg-rose-500/10" : "bg-primary/10"

    const renderAdminNav = () => (
        <nav className={cn(
            "flex-1 overflow-y-auto custom-scrollbar",
            variant === "default" ? "px-3 py-2" : "px-0 py-2"
        )}>
            {adminNavGroups.map((group) => (
                <div key={group.label} className="mb-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20 px-2 mb-1.5 mt-2">
                        {group.label}
                    </p>
                    <div className="space-y-0.5">
                        {group.links.map((link) => {
                            const isActive = isActiveLink(link.href, (link as any).exact)
                            return (
                                <Link key={link.href} href={link.href} className="block relative group/item">
                                    <div className={cn(
                                        "flex items-center gap-3 px-3 h-9 rounded-lg transition-all duration-200 relative overflow-hidden",
                                        isActive
                                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/15"
                                            : "text-white/40 hover:text-white/80 hover:bg-white/5"
                                    )}>
                                        {isActive && (
                                            <motion.div
                                                layoutId="admin-active-bar"
                                                className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-rose-500 rounded-r-full"
                                                transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                                            />
                                        )}
                                        <link.icon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-rose-400" : "group-hover/item:text-white/70")} />
                                        <span className={cn("text-[11px] font-semibold truncate", isActive ? "text-rose-300" : "")}>{link.label}</span>
                                        {isActive && <ChevronRight className="w-3 h-3 ml-auto shrink-0 text-rose-500/40" />}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            ))}
        </nav>
    )

    const renderSimpleNav = () => {
        const links = role === "company" ? companyLinks : userLinks
        return (
            <nav className={cn(
                "flex-1 space-y-0.5 overflow-y-auto custom-scrollbar",
                variant === "default" ? "px-3 py-3" : "px-0 py-2"
            )}>
                {links.map((link) => {
                    const isActive = isActiveLink(link.href, (link as any).exact)
                    return (
                        <Link key={link.href} href={link.href} className="block relative group/item">
                            <div className={cn(
                                "flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-200 relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/15"
                                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                            )}>
                                {isActive && (
                                    <motion.div
                                        layoutId="user-active-bar"
                                        className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-r-full"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                                    />
                                )}
                                <link.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "")} />
                                <span className={cn("text-xs font-medium", isActive ? "font-semibold text-primary" : "")}>{link.label}</span>
                            </div>
                        </Link>
                    )
                })}
            </nav>
        )
    }

    return (
        <aside className={cn(
            variant === "default"
                ? "w-52 flex flex-col h-screen sticky top-0 shrink-0 z-50 bg-black/70 backdrop-blur-2xl border-r border-white/[0.06]"
                : "w-full flex flex-col h-full bg-transparent border-none",
            className
        )}>
            {/* Ambient glow */}
            {variant === "default" && (
                <div className={cn("absolute top-0 -left-20 w-40 h-40 blur-[100px] pointer-events-none", accentGlow)} />
            )}

            {/* Logo */}
            {variant === "default" && (
                <div className="px-4 pt-5 pb-4 border-b border-white/[0.06] shrink-0">
                    <Link href="/" className="flex items-center gap-2.5 group mb-3">
                        <div className={cn("p-2 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 group-hover:scale-105",
                            role === "admin" ? "bg-rose-500/20 border-rose-500/30" : "bg-primary/20 border-primary/30"
                        )}>
                            <Zap className={cn("w-4 h-4", role === "admin" ? "text-rose-400" : "text-primary")} />
                        </div>
                        <div>
                            <p className="text-sm font-black tracking-tight text-white leading-none">Best Hiring Tool</p>
                            <p className={cn("text-[8px] uppercase tracking-[0.3em] font-bold leading-tight mt-0.5",
                                role === "admin" ? "text-rose-500/60" : "text-primary/60"
                            )}>
                                {role === "admin" ? "Admin Terminal" : role === "company" ? "Recruiter Hub" : "Talent Engine"}
                            </p>
                        </div>
                    </Link>

                    {role === "admin" && (
                        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400/70">All Systems Operational</span>
                        </div>
                    )}
                </div>
            )}

            {/* Navigation */}
            {role === "admin" ? renderAdminNav() : renderSimpleNav()}

            {/* Footer */}
            {variant === "default" && (
                <div className="p-3 border-t border-white/[0.06] space-y-1.5 shrink-0">
                    {user && (
                        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white/5 border border-white/5 mb-2">
                            <div className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0",
                                role === "admin" ? "bg-rose-500/20 text-rose-400" : "bg-primary/20 text-primary"
                            )}>
                                {(user.name || user.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold truncate text-white/80">{user.name || user.name || "User"}</p>
                                <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold">{user.role || role}</p>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-all h-9 px-3 rounded-xl group text-xs font-medium"
                        onClick={logout}
                    >
                        <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        Sign Out
                    </Button>
                </div>
            )}
        </aside>
    )
}
