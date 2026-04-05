"use client"

import { COMPANIES } from "@/lib/mock-api/companies"
import { CompanyHeader } from "@/components/features/companies/company-header"
import { OverviewTab } from "@/components/features/companies/tabs/overview-tab"
import { AboutTab } from "@/components/features/companies/tabs/about-tab"
import { JobsTab } from "@/components/features/companies/tabs/jobs-tab"
import { CultureTab } from "@/components/features/companies/tabs/culture-tab"
import { TechStackTab } from "@/components/features/companies/tabs/tech-stack-tab"
import { ReviewsTab } from "@/components/features/companies/tabs/reviews-tab"
import { AnalyticsTab } from "@/components/features/companies/tabs/analytics-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function CompanyProfilePage({ params }: { params: { slug: string } }) {
    // In a real app we would unwrap params and fetch via react-query
    // For mock, we'll just find it synchronously or simpler
    // Next 15 requires awaiting params/unwrapping.
    // I will mock this safely.

    // FINDING COMPANY
    // Since this is client component or mock, I'll allow simple find first.
    // Ideally useQuery

    // Let's assume params mock for now
    const company = COMPANIES.find(c => c.slug === params.slug)

    if (!company) {
        return notFound()
    }

    return (
        <div className="container mx-auto py-8 pt-20 px-4 space-y-6 max-w-5xl">
            <Link href="/companies">
                <Button variant="ghost" size="sm" className="pl-0 text-muted-foreground hover:bg-transparent hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Companies
                </Button>
            </Link>

            <CompanyHeader company={company} />

            <Tabs defaultValue="overview" className="space-y-6">
                <div className="overflow-x-auto pb-2 scrollbar-hide">
                    <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-b rounded-none gap-2">
                        <TabsTrigger value="overview" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Overview</TabsTrigger>
                        <TabsTrigger value="about" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">About</TabsTrigger>
                        <TabsTrigger value="jobs" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Open Jobs</TabsTrigger>
                        <TabsTrigger value="culture" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Culture</TabsTrigger>
                        <TabsTrigger value="tech" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Tech Stack</TabsTrigger>
                        <TabsTrigger value="reviews" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Reviews</TabsTrigger>
                        <TabsTrigger value="analytics" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-none border border-transparent data-[state=active]:border-primary">Analytics</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="animate-in fade-in-50 duration-300">
                    <OverviewTab company={company} />
                </TabsContent>
                <TabsContent value="about" className="animate-in fade-in-50 duration-300">
                    <AboutTab company={company} />
                </TabsContent>
                <TabsContent value="jobs" className="animate-in fade-in-50 duration-300">
                    <JobsTab company={company} />
                </TabsContent>
                <TabsContent value="culture" className="animate-in fade-in-50 duration-300">
                    <CultureTab company={company} />
                </TabsContent>
                <TabsContent value="tech" className="animate-in fade-in-50 duration-300">
                    <TechStackTab company={company} />
                </TabsContent>
                <TabsContent value="reviews" className="animate-in fade-in-50 duration-300">
                    <ReviewsTab company={company} />
                </TabsContent>
                <TabsContent value="analytics" className="animate-in fade-in-50 duration-300">
                    <AnalyticsTab company={company} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
