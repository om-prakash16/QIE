"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useScrolled } from "@/hooks/use-scrolled"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Briefcase, Building2, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { Sidebar } from "@/components/layout/sidebar"

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
    const scrolled = useScrolled()
    const pathname = usePathname()

    const navLinks = [
        { href: "/jobs", label: "Find Jobs" },
        { href: "/companies", label: "Companies" },
        { href: "/talent", label: "Talent" },
        { href: "/salary", label: "Salary" },
        { href: "/career-advice", label: "Advice" },
        { href: "/pricing", label: "Pricing" },
        { href: "/support", label: "Support" },
    ]

    const isDashboard = pathname?.startsWith("/user") || pathname?.startsWith("/company") || pathname?.startsWith("/admin")

    return (
        <header
            className={cn(
                "fixed top-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
                    : "bg-transparent",
                isDashboard ? "left-0 md:left-64" : "left-0"
            )}
        >
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                {/* Mobile Dash Menu Trigger (Dashboard only) */}
                {isDashboard && (
                    <div className="lg:hidden mr-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64">
                                <Sidebar role={pathname?.startsWith("/company") ? "company" : pathname?.startsWith("/admin") ? "admin" : "user"} />
                            </SheetContent>
                        </Sheet>
                    </div>
                )}

                {/* Logo - Hide on Dashboard as Sidebar has logo */}
                {!isDashboard && (
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold font-heading tracking-tight">Skill<span className="text-primary">sutra</span></span>
                    </Link>
                )}

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary relative py-2",
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
                            href="/my-profile"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary relative py-2",
                                pathname === "/my-profile" ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            My Profile
                            {pathname === "/my-profile" && (
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
                    <ThemeToggle />
                    <WalletMultiButton style={{ height: '36px', padding: '0 16px', fontSize: '14px', borderRadius: '8px' }} />
                    {!user ? (
                        <>
                            <Link href="/auth/login">
                                <Button variant="ghost" size="sm">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button size="sm">Register</Button>
                            </Link>
                            <div className="w-px h-6 bg-border mx-2" />
                            <Link href="/post-job">
                                <Button variant="outline" size="sm" className="hidden lg:flex">
                                    Post a Job
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
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
                                        <Link href="/user/dashboard">
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/user/profile">
                                            My Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Settings
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <WalletMultiButton style={{ height: '36px', padding: '0 12px', fontSize: '12px', borderRadius: '8px' }} />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col gap-6 mt-10">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-lg font-medium"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {!user ? (
                                    <div className="flex flex-col gap-2 mt-4">
                                        <Link href="/auth/login"><Button className="w-full" variant="outline">Log In</Button></Link>
                                        <Link href="/auth/register"><Button className="w-full">Register</Button></Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 mt-4">
                                        <Link href="/user/profile"><Button className="w-full" variant="outline">My Profile</Button></Link>
                                        <Button className="w-full" onClick={logout}>Log Out</Button>
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
