"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Linkedin, Briefcase } from "lucide-react"
import { useCMS } from "@/context/cms-context"

export function Footer({ forceVisible }: { forceVisible?: boolean }) {
    const pathname = usePathname()
    const { getVal, getJson } = useCMS()
    const isDashboard = ["/user", "/admin", "/company"].some(prefix => pathname?.startsWith(prefix))

    if (isDashboard && !forceVisible) return null

    const siteName = getVal("global", "site_name", "Best Hiring Tool")
    const copyright = getVal("global", "copyright", `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`)
    const columns = getJson("footer", "columns") || []
    const socialLinks = getJson("footer", "social_links") || []

    return (
        <footer className="bg-muted/30 border-t pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-lg font-bold font-heading">{siteName}</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {getVal("hero", "subtitle", "Connecting top talent with world-class companies.")}
                        </p>
                    </div>

                    {columns.map((col: any) => (
                        <div key={col.title}>
                            <h3 className="font-semibold mb-4">{col.title}</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {col.links.map((link: any) => (
                                    <li key={link.href}><Link href={link.href} className="hover:text-primary">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        {copyright}
                    </p>
                    <div className="flex gap-4">
                        {socialLinks.map((social: any) => (
                            <Link key={social.platform} href={social.url} className="text-muted-foreground hover:text-primary">
                                {social.platform === "twitter" && (
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
                                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                    </svg>
                                )}
                                {social.platform === "facebook" && <Facebook className="w-5 h-5" />}
                                {social.platform === "instagram" && <Instagram className="w-5 h-5" />}
                                {social.platform === "linkedin" && <Linkedin className="w-5 h-5" />}
                                {social.platform === "github" && (
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
