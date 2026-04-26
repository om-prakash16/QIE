"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Briefcase, ShieldCheck, User, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/verify", label: "Verify", icon: ShieldCheck },
    { href: "/talent", label: "Talent", icon: Search },
    { href: "/user/profile", label: "Profile", icon: User },
]

export function MobileNav() {
    const pathname = usePathname()

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md h-16 glass rounded-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl flex items-center justify-around px-4 border border-t-white/20">
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
                
                return (
                    <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center w-12 h-12 group">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={cn(
                                "p-2 rounded-xl transition-all duration-300",
                                isActive 
                                    ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
                                    : "text-muted-foreground/60 hover:text-white"
                            )}
                        >
                            <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5]" : "stroke-[1.5]")} />
                        </motion.div>
                        {isActive && (
                            <motion.div 
                                layoutId="mobile-nav-active"
                                className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                            />
                        )}
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-tighter mt-1 transition-all",
                            isActive ? "text-primary opacity-100" : "opacity-0"
                        )}>
                            {item.label}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}
