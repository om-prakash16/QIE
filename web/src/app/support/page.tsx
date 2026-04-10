"use client"

import {
    Search,
    UserCircle,
    Briefcase,
    CreditCard,
    Settings,
} from "lucide-react"
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SupportCard } from "@/components/features/support/SupportCard"
import { FAQAccordion } from "@/components/features/support/FAQAccordion"
import { ContactSupportForm } from "@/components/features/support/ContactSupportForm"

// --- Mock Data ---
const QUICK_LINKS = [
    { icon: UserCircle, title: "Account & Profile", desc: "Login issues, profile updates, password reset" },
    { icon: Briefcase, title: "Jobs & Applications", desc: "Application status, saving jobs, resume help" },
    { icon: CreditCard, title: "Billing & Plans", desc: "Invoices, subscription management, refunds" },
    { icon: Settings, title: "Technical Support", desc: "Bug reports, error messages, platform issues" },
]

const FAQS = [
    {
        question: "How do I apply for a job?",
        answer: "Simply browse through our job listings, click on a job card to view details, and hit the 'Apply Now' button. You'll need to be logged in with a complete profile."
    },
    {
        question: "Can I update my application after submitting?",
        answer: "Once an application is submitted, it cannot be edited. However, you can update your profile usage data, and recruiters will see the latest version when they view your profile."
    },
    {
        question: "Is Best Hiring Tool free for job seekers?",
        answer: "Yes! Creating a profile, searching for jobs, and applying is 100% free for all candidates. We only charge companies for premium hiring tools."
    },
    {
        question: "How do I delete my account?",
        answer: "You can request account deletion from your Profile Settings page. Please note this action is irreversible and all your data will be removed."
    },
    {
        question: "How can I contact support?",
        answer: "You can reach us via the contact form on this page, or email us directly at support@the-best-hiring-tool.com. Our typical response time is 24 hours."
    },
]

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-muted/5 flex flex-col pt-16">

            {/* Header */}
            <div className="bg-background border-b pt-12 pb-16 px-4 text-center">
                <div className="container mx-auto max-w-4xl space-y-6">
                    <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/20">Help Center</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading track-tight text-foreground">
                        How can we help you?
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Browse commonly asked questions or get in touch with our team.
                    </p>

                    <div className="relative max-w-lg mx-auto pt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for answers..."
                            className="pl-12 h-12 rounded-full shadow-sm bg-background border-muted-foreground/20 text-base"
                        />
                    </div>
                </div>
            </div>

            <main className="container mx-auto max-w-6xl px-4 py-12 space-y-20">

                {/* Quick Help Cards */}
                <section>
                    <h2 className="text-2xl font-bold mb-8 text-center">Common Topics</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {QUICK_LINKS.map((link, i) => (
                            <SupportCard
                                key={i}
                                icon={link.icon}
                                title={link.title}
                                description={link.desc}
                            />
                        ))}
                    </div>
                </section>

                {/* FAQs */}
                <section className="max-w-3xl mx-auto w-full">
                    <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                    <FAQAccordion items={FAQS} />
                </section>

                {/* Contact Form */}
                <ContactSupportForm />

                {/* CTA Section */}
                <section className="text-center py-8">
                    <h2 className="text-2xl font-bold mb-6">Still looking for the right path?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="px-8" asChild>
                            <Link href="/jobs">Browse Jobs</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="px-8" asChild>
                            <Link href="/career-advice">Career Advice</Link>
                        </Button>
                    </div>
                </section>

            </main>
        </div>
    )
}
