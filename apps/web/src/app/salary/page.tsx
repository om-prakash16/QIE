"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getAggregatedInsights } from "@/lib/mock-api/salary"
import { SalaryFilters } from "@/components/features/salary/salary-filters"
import { SalaryStatCard } from "@/components/features/salary/salary-stat-card"
import { SalaryChart } from "@/components/features/salary/salary-chart"
import { SalaryTable } from "@/components/features/salary/salary-table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    Banknote,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Filter,
    SlidersHorizontal,
    DollarSign,
    Briefcase
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

function SalaryContent() {
    const searchParams = useSearchParams()

    // Parse filters
    const filters = {
        role: searchParams.get("role") || undefined,
        location: searchParams.get("location") || undefined,
        experience: searchParams.get("experience") || undefined,
        companyType: searchParams.get("companyType") || undefined,
    }

    const { data: insights, isLoading } = useQuery({
        queryKey: ["salary-insights", JSON.stringify(filters)],
        queryFn: () => getAggregatedInsights(filters),
        staleTime: 5000
    })

    const hasData = insights && insights.stats.count > 0

    return (
        <div className="min-h-screen bg-muted/5 flex flex-col pt-16">
            <div className="bg-background border-b pt-12 pb-8 px-4 sm:px-6 sticky top-16 z-20">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Salary Insights – 2025</h1>
                        <p className="text-muted-foreground">Explore estimated salaries by role, experience, and location</p>
                        <p className="text-xs text-muted-foreground/70 mt-1 max-w-3xl bg-amber-500/10 text-amber-600 dark:text-amber-500 p-2 rounded border border-amber-500/20">
                            <strong>Disclaimer:</strong> Salary data shown is an estimated 2025 market range based on aggregated publicly available reports. Actual salaries may vary depending on company, location, skills, and individual experience.
                        </p>
                    </div>
                </div>
            </div>

            <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 flex-1 flex flex-col lg:flex-row gap-8">
                {/* Mobile Filters */}
                <div className="lg:hidden w-full mb-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4" />
                                Filter Insights
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6">
                            <SalaryFilters />
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Sidebar Filters */}
                <aside className="hidden lg:block w-72 shrink-0 space-y-6 sticky top-48 h-fit">
                    <SalaryFilters />
                </aside>

                <div className="flex-1 w-full space-y-8 min-w-0">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {isLoading ? (
                            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
                        ) : hasData ? (
                            <>
                                <SalaryStatCard
                                    title="Average Salary"
                                    value={`₹${insights.stats.avg} LPA`}
                                    icon={Banknote}
                                    subtext="Based on current filters"
                                    sentiment="neutral"
                                />
                                <SalaryStatCard
                                    title="Median Salary"
                                    value={`₹${insights.stats.median} LPA`}
                                    icon={BarChart3}
                                    subtext="Midpoint of dataset"
                                />
                                <SalaryStatCard
                                    title="Minimum"
                                    value={`₹${insights.stats.min} LPA`}
                                    icon={TrendingDown}
                                    subtext="Lowest reported"
                                />
                                <SalaryStatCard
                                    title="Maximum"
                                    value={`₹${insights.stats.max} LPA`}
                                    icon={TrendingUp}
                                    subtext="Highest reported"
                                    sentiment="positive"
                                />
                            </>
                        ) : (
                            <div className="col-span-4 text-center py-8">No data available for these filters.</div>
                        )}
                    </div>

                    {/* Charts & Tables Section */}
                    {isLoading ? (
                        <Skeleton className="h-[400px] w-full" />
                    ) : hasData ? (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Salary Distribution</CardTitle>
                                    <CardDescription>Spread of salaries for selected criteria</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-0">
                                    <SalaryChart data={insights.distribution} />
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SalaryTable
                                    title="By Experience"
                                    data={insights.byExperience.map(i => ({
                                        label: i.range,
                                        avg: i.avg,
                                        subtext: `Range: ₹${i.min}-${i.max} LPA`
                                    }))}
                                />
                                <SalaryTable
                                    title="By Location"
                                    data={insights.byLocation.map(i => ({
                                        label: i.location,
                                        avg: i.avg
                                    }))}
                                />
                            </div>

                            {/* Insights & Tips */}
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-primary" />
                                        Salary Stats & Negotiation Tips
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground marker:text-primary">
                                        <li>Salaries in <strong>Product-based</strong> companies are typically 40% higher than Service-based roles.</li>
                                        <li><strong>Remote</strong> roles are seeing a 20% surge in base pay compared to non-metro locations.</li>
                                        <li><strong>Negotiation Tip:</strong> Always discuss total compensation (ESOPs, bonuses) rather than just base salary.</li>
                                        <li>Top skills like <strong>Next.js</strong> and <strong>AWS</strong> can command a premium of up to 30%.</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* CTA */}
                            <div className="flex flex-col items-center justify-center p-8 bg-background border rounded-lg shadow-sm text-center space-y-4">
                                <h2 className="text-xl font-bold">Ready to earn what you deserve?</h2>
                                <p className="text-muted-foreground max-w-lg">
                                    Browse thousands of active job listings that match your salary expectations and skill set.
                                </p>
                                <Link href="/jobs">
                                    <Button size="lg" className="px-8">
                                        Find Jobs Matching ₹{insights.stats.avg} LPA
                                    </Button>
                                </Link>
                            </div>
                        </>
                    ) : null}
                </div>
            </main>
        </div>
    )
}

export default function SalaryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Skeleton className="h-10 w-10 rounded-full" /></div>}>
            <SalaryContent />
        </Suspense>
    )
}
