"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    User,
    Briefcase,
    Bookmark,
    Settings,
    LogOut,
    Building2,
    Users
} from "lucide-react"
import { useAuth } from "@/context/auth-context"

interface SidebarProps {
    role: "user" | "company" | "admin"
    className?: string
}

export function Sidebar({ role, className }: SidebarProps) {
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
        { href: "/admin/jobs", label: "Manage Jobs", icon: Briefcase },
    ]

    const links = role === "company" ? companyLinks : role === "admin" ? adminLinks : userLinks

    return (
        <aside className={cn("w-64 bg-background border-r flex flex-col h-screen sticky top-0 shrink-0", className)}>
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold font-heading">Skillsutra</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => (
                    <Link key={link.href} href={link.href}>
                        <Button
                            variant={pathname === link.href ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-3 mb-1",
                                pathname === link.href && "bg-secondary font-medium"
                            )}
                        >
                            <link.icon className="w-4 h-4" />
                            {link.label}
                        </Button>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t space-y-2">
                <Link href="/settings">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <Settings className="w-4 h-4" />
                        Settings
                    </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                    Log Out
                </Button>
            </div>
        </aside>
    )
}
