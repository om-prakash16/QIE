"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Linkedin, Briefcase } from "lucide-react"

export function Footer({ forceVisible }: { forceVisible?: boolean }) {
    const pathname = usePathname()
    const isDashboard = ["/user", "/admin", "/company"].some(prefix => pathname?.startsWith(prefix))

    if (isDashboard && !forceVisible) return null

    return (
        <footer className="bg-muted/30 border-t pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-lg font-bold font-heading">Skill<span className="text-primary">sutra</span></span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Connecting top talent with world-class companies. Find your dream job or hire the best professionals today.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Candidates</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/jobs" className="hover:text-primary">Find Jobs</Link></li>
                            <li><Link href="/companies" className="hover:text-primary">Browse Companies</Link></li>
                            <li><Link href="/salary" className="hover:text-primary">Salary Tools</Link></li>
                            <li><Link href="/career-advice" className="hover:text-primary">Career Advice</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Employers</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/post-job" className="hover:text-primary">Post a Job</Link></li>
                            <li><Link href="/talent" className="hover:text-primary">Search Talent</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary">Pricing Plans</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link href="/support" className="hover:text-primary">Help Center</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Skillsutra. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="w-5 h-5" /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="w-5 h-5" /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="w-5 h-5" /></Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
