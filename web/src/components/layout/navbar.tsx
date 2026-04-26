"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useScrolled } from "@/hooks/use-scrolled"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Briefcase, Building2, User, ShieldCheck } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Sidebar } from "@/components/layout/sidebar"
import { NotificationBell } from "@/components/notifications/NotificationBell"
import { useCMS } from "@/context/cms-context"
import { CommandSearch } from "@/components/layout/command-search"

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
) as React.FC<any>;
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
    const { user, logout } = useAuth()
    const { getVal, getJson } = useCMS()
    const scrolled = useScrolled()
    const pathname = usePathname()

    const navLinks = getJson("navbar", "links") || [
        { href: "/verify", label: "Verify Resume" },
        { href: "/jobs", label: "Find Jobs" },
        { href: "/companies", label: "Companies" },
        { href: "/talent", label: "Talent" },
    ]

    const siteName = "Best Hiring Tool"

    const isDashboard = pathname?.startsWith("/user") || pathname?.startsWith("/company") || pathname?.startsWith("/admin")

    return (
        <header
            className={cn(
                "fixed top-0 right-0 z-50 transition-all duration-500",
                scrolled
                    ? "glass shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/10"
                    : "bg-transparent",
                isDashboard ? "left-0 lg:left-64" : "left-0"
            )}
        >
            <div className="container mx-auto flex items-center justify-between h-20 px-4 md:px-8 gap-4">

                {/* Logo - Hide on Dashboard as Sidebar has logo */}
                {!isDashboard && (
                    <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
                        <div className="bg-primary/20 p-1.5 md:p-2 rounded-xl md:rounded-2xl group-hover:bg-primary/30 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] backdrop-blur-md border border-primary/20 shrink-0">
                            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-primary fill-primary/10" />
                        </div>
                        <span className="text-lg md:text-2xl font-black font-heading tracking-tighter text-gradient leading-none">
                            {siteName}
                        </span>
                    </Link>
                )}

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link: any) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-[10px] font-black uppercase tracking-widest transition-colors hover:text-primary relative py-2",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            href="/user/profile"
                            className={cn(
                                "text-[10px] font-black uppercase tracking-widest transition-colors hover:text-primary relative py-2",
                                pathname?.startsWith("/user/profile") ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            My Profile
                            {pathname?.startsWith("/user/profile") && (
                                <motion.div
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    )}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <CommandSearch />
                    <ThemeToggle />
                    <NotificationBell />
                    <WalletMultiButton style={{ height: '36px', padding: '0 16px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '8px' }} />
                    {!user ? (
                        <>
                            <Link href="/auth/login">
                                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button size="sm" variant="premium" className="text-[10px] font-black uppercase tracking-widest">Register</Button>
                            </Link>
                            <div className="w-px h-6 bg-border mx-2" />
                            <Link href="/post-job">
                                <Button variant="outline" size="sm" className="hidden lg:flex text-[10px] font-black uppercase tracking-widest hover:bg-primary/5">
                                    Post a Job
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href={user.role === 'admin' ? "/admin" : user.role === 'company' ? "/company/dashboard" : "/user/dashboard"} className="hidden lg:block">
                                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest">Dashboard</Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-primary/20 p-0 overflow-hidden">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary">{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link href={user.role === 'admin' ? "/admin" : user.role === 'company' ? "/company/dashboard" : "/user/dashboard"}>
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={user.role === 'admin' ? "/admin/profile" : user.role === 'company' ? "/company/profile" : "/user/profile"}>
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={user.role === 'admin' ? "/admin/settings" : user.role === 'company' ? "/company/dashboard" : "/user/settings"}>
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer font-medium">
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <NotificationBell />
                    <WalletMultiButton style={{ height: '36px', padding: '0 12px', fontSize: '12px', borderRadius: '8px' }} />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] px-6">
                            <div className="flex flex-col gap-8 mt-10">
                                {/* Dashboard Links (if applicable) */}
                                {isDashboard && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2">Dashboard</p>
                                        <Sidebar 
                                            variant="mobile"
                                            role={pathname?.startsWith("/company") ? "company" : pathname?.startsWith("/admin") ? "admin" : "user"} 
                                        />
                                        <div className="h-px bg-border my-4" />
                                    </div>
                                )}

                                {/* Site Links */}
                                <div className="flex flex-col gap-4">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2">Platform</p>
                                    {navLinks.map((link: any) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "text-lg font-semibold transition-colors hover:text-primary",
                                                pathname === link.href ? "text-primary" : "text-foreground"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {!user ? (
                                    <div className="flex flex-col gap-3 mt-4">
                                        <Link href="/auth/login" className="w-full">
                                            <Button className="w-full" variant="outline">Log In</Button>
                                        </Link>
                                        <Link href="/auth/register" className="w-full">
                                            <Button className="w-full">Register</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3 mt-4">
                                        <Link href={user.role === 'admin' ? "/admin" : user.role === 'company' ? "/company/dashboard" : "/user/dashboard"} className="w-full">
                                            <Button className="w-full" variant="outline">Dashboard</Button>
                                        </Link>
                                        <Button className="w-full" variant="destructive" onClick={logout}>Sign Out</Button>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
