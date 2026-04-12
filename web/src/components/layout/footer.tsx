"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Linkedin, Briefcase, Mail, ArrowRight, Zap, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useCMS } from "@/context/cms-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer({ forceVisible }: { forceVisible?: boolean }) {
    const pathname = usePathname()
    const { getVal, getJson } = useCMS()
    const isDashboard = ["/user", "/admin", "/company"].some(prefix => pathname?.startsWith(prefix))

    if (isDashboard && !forceVisible) return null

    const siteName = getVal("global", "site_name", "SkillProof AI")
    const copyright = getVal("global", "copyright", `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`)
    
    // Professional Fallback Columns if CMS is empty
    const defaultColumns = [
        {
            title: "Platform",
            links: [
                { label: "Job Board", href: "/jobs" },
                { label: "Partner Matrix", href: "/companies" },
                { label: "Features", href: "/#features" },
                { label: "Pricing", href: "/pricing" }
            ]
        },
        {
            title: "Resources",
            links: [
                { label: "Documentation", href: "/docs" },
                { label: "Skill Assessment", href: "/assessments" },
                { label: "Career Roadmap", href: "/user/roadmap" },
                { label: "Help Center", href: "/support" }
            ]
        },
        {
            title: "Company",
            links: [
                { label: "About Us", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" }
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
                { label: "Security", href: "/security" }
            ]
        }
    ]

    const columns = getJson("footer", "columns") || defaultColumns
    const socialLinks = getJson("footer", "social_links") || [
        { platform: "twitter", url: "#" },
        { platform: "linkedin", url: "#" },
        { platform: "github", url: "#" },
        { platform: "instagram", url: "#" }
    ]

    return (
        <footer className="relative bg-background pt-24 pb-12 overflow-hidden border-t border-primary/10">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Tier 1: Brand & Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">
                    <div className="space-y-6 max-w-md">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-lg shadow-primary/5 transition-transform group-hover:scale-110">
                                <Zap className="w-6 h-6 text-primary fill-primary/10" />
                            </div>
                            <span className="text-2xl font-bold font-heading tracking-tight">{siteName}</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            {getVal("global", "footer_tagline", "The enterprise-grade infrastructure for global hiring and verified professional identities.")}
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social: any) => (
                                <motion.a
                                    key={social.platform}
                                    href={social.url}
                                    whileHover={{ y: -4, scale: 1.1 }}
                                    className="w-10 h-10 rounded-full bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                                >
                                    {social.platform === "twitter" && <Twitter className="w-4 h-4" />}
                                    {social.platform === "facebook" && <Facebook className="w-4 h-4" />}
                                    {social.platform === "instagram" && <Instagram className="w-4 h-4" />}
                                    {social.platform === "linkedin" && <Linkedin className="w-4 h-4" />}
                                    {social.platform === "github" && (
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    )}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:pl-12">
                        <div className="bg-muted/30 backdrop-blur-xl border border-primary/10 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Mail className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 relative z-10">Stay ahead of the curve</h3>
                            <p className="text-muted-foreground mb-6 relative z-10">Get the latest platform updates, hiring trends, and career tips delivered to your inbox.</p>
                            <form className="flex flex-col sm:flex-row gap-3 relative z-10" onSubmit={(e) => e.preventDefault()}>
                                <Input 
                                    placeholder="Enter your email" 
                                    className="bg-background/50 border-border focus:ring-primary h-12 rounded-xl"
                                />
                                <Button className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-semibold group">
                                    Subscribe
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>
                            <p className="text-[10px] text-muted-foreground mt-4 uppercase tracking-widest font-bold">No spam. Just high-signal insights.</p>
                        </div>
                    </div>
                </div>

                {/* Tier 2: Navigation Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-y border-border/50">
                    {columns.map((col: any) => (
                        <div key={col.title} className="space-y-6">
                            <h4 className="font-bold text-foreground tracking-tight uppercase text-xs opacity-50">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map((link: any) => (
                                    <li key={link.href}>
                                        <Link 
                                            href={link.href} 
                                            className="text-muted-foreground hover:text-primary transition-all duration-300 flex items-center group/link text-sm"
                                        >
                                            <span className="bg-primary/0 group-hover/link:bg-primary/10 h-1 w-0 group-hover/link:w-2 mr-0 group-hover/link:mr-2 rounded-full transition-all duration-300" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Tier 3: Bottom Bar */}
                <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-sm text-muted-foreground">
                            {copyright}
                        </p>
                        <div className="flex items-center gap-2 px-3 py-1 transparent bg-success/5 border border-success/20 rounded-full">
                            <motion.div 
                                className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">All Systems Operational</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="opacity-50">Powered by</span>
                            <span className="font-bold tracking-tighter flex items-center gap-1 text-foreground">
                                <Zap className="w-3 h-3 text-primary fill-primary" />
                                SkillProof AI Core
                            </span>
                        </div>
                        <div className="flex gap-4">
                            {/* Additional utility links or mini-socials if needed */}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
