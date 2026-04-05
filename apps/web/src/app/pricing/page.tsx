"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { PricingCard, PricingPlan } from "@/components/features/pricing/pricing-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, Minus, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const PLANS: PricingPlan[] = [
    {
        name: "Starter",
        description: "Essential tools for startups and occasional hiring needs.",
        monthlyPrice: 2999,
        yearlyPrice: 2399,
        bestFor: "Small Startups",
        features: [
            "5 Active Job Postings",
            "Basic Applicant Tracking",
            "Email Support",
            "Standard Talent Search",
            "Company Profile"
        ],
        ctaText: "Get Started",
        ctaLink: "/auth/register?plan=starter",
        ctaVariant: "outline"
    },
    {
        name: "Professional",
        description: "Powerhouse features for growing teams hiring regularly.",
        monthlyPrice: 7999,
        yearlyPrice: 6399,
        bestFor: "Growing Companies",
        isPopular: true,
        features: [
            "Unlimited Job Postings",
            "Advanced Candidate Filters",
            "Talent Marketplace Access",
            "Priority Email & Chat Support",
            "Branded Company Page",
            "Team Collaboration Tools"
        ],
        ctaText: "Start Free Trial",
        ctaLink: "/auth/register?plan=professional"
    },
    {
        name: "Enterprise",
        description: "Review feature usage and custom solutions for scale.",
        monthlyPrice: "Custom",
        yearlyPrice: "Custom",
        bestFor: "Large Organizations",
        features: [
            "Custom Job Volume",
            "Dedicated Account Manager",
            "Advanced Analytics & API",
            "ATS Integration",
            "SLA Support",
            "Custom Contracts"
        ],
        ctaText: "Contact Sales",
        ctaLink: "/contact",
        ctaVariant: "outline"
    }
]

// Feature Comparison
const COMPARISON_FEATURES = [
    { category: "Hiring", name: "Job Postings", starter: "5", pro: "Unlimited", ent: "Custom" },
    { category: "Hiring", name: "Talent Search", starter: "Basic", pro: "Advanced Filters", ent: "Full Access + AI" },
    { category: "Hiring", name: "Job Duration", starter: "30 Days", pro: "90 Days", ent: "Unlimited" },
    { category: "Branding", name: "Company Profile", starter: "Standard", pro: "Enhanced Branding", ent: "Whitelabel" },
    { category: "Support", name: "Response Time", starter: "48 Hours", pro: "24 Hours", ent: "< 4 Hours" },
    { category: "Support", name: "Account Manager", starter: false, pro: false, ent: true },
    { category: "Advanced", name: "ATS Integration", starter: false, pro: false, ent: true },
    { category: "Advanced", name: "Analytics", starter: "Basic", pro: "Advanced", ent: "Custom Reports" },
]

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(true)

    return (
        <div className="min-h-screen bg-muted/5 py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-20">

                {/* Header */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Choose the plan that perfectly fits your hiring needs. No hidden fees. Cancel anytime.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                            Monthly
                        </span>
                        <Switch
                            checked={isYearly}
                            onCheckedChange={setIsYearly}
                            aria-label="Toggle yearly billing"
                        />
                        <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                            Yearly
                        </span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">
                            Save 20%
                        </Badge>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start">
                    {PLANS.map((plan) => (
                        <PricingCard key={plan.name} plan={plan} isYearly={isYearly} />
                    ))}
                </div>

                {/* Comparison Table */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold font-heading">Compare Features</h2>
                    </div>

                    <div className="bg-background rounded-xl border overflow-hidden shadow-sm">
                        <TooltipProvider>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-[30%] pl-6">Feature</TableHead>
                                        <TableHead className="w-[23%] text-center">Starter</TableHead>
                                        <TableHead className="w-[23%] text-center font-bold text-primary">Professional</TableHead>
                                        <TableHead className="w-[23%] text-center">Enterprise</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {COMPARISON_FEATURES.map((feat, i) => (
                                        <TableRow key={i} className="hover:bg-muted/5">
                                            <TableCell className="font-medium pl-6 flex items-center gap-2">
                                                {feat.name}
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{feat.category} feature detail</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell className="text-center text-muted-foreground">
                                                {typeof feat.starter === "boolean" ? (
                                                    feat.starter ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <Minus className="w-5 h-5 mx-auto text-muted-foreground/30" />
                                                ) : feat.starter}
                                            </TableCell>
                                            <TableCell className="text-center font-medium bg-primary/5">
                                                {typeof feat.pro === "boolean" ? (
                                                    feat.pro ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <Minus className="w-5 h-5 mx-auto text-muted-foreground/30" />
                                                ) : feat.pro}
                                            </TableCell>
                                            <TableCell className="text-center text-muted-foreground">
                                                {typeof feat.ent === "boolean" ? (
                                                    feat.ent ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <Minus className="w-5 h-5 mx-auto text-muted-foreground/30" />
                                                ) : feat.ent}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TooltipProvider>
                    </div>
                </div>

                {/* FAQ or Trust signal could go here */}

            </div>
        </div>
    )
}
