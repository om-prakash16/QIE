"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { JobFilters } from "@/components/features/jobs/job-filters"
import { JobCard } from "@/components/shared/job-card"
import { JOBS, CATEGORIES } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MapPin, Grid, List as ListIcon, Filter, X } from "lucide-react"

export default function JobsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [view, setView] = useState<"grid" | "list">("list")
    const [searchQuery, setSearchQuery] = useState("")
    const [locationQuery, setLocationQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    // Read category from URL on mount and when URL changes
    useEffect(() => {
        const categoryParam = searchParams.get("category")
        setActiveCategory(categoryParam)
    }, [searchParams])

    const clearCategory = () => {
        setActiveCategory(null)
        router.push("/jobs")
    }

    // Filters State
    const [filters, setFilters] = useState({
        type: [] as string[],
        workMode: [] as string[],
        experience: [] as string[],
        salary: [] as string[],
        companyType: [] as string[],
        location: [] as string[],
        education: [] as string[],
        postedDate: [] as string[]
    })

    // Filter Logic
    const filteredJobs = useMemo(() => {
        return JOBS.filter(job => {
            // 0. Category Filter
            if (activeCategory) {
                if (job.category.toLowerCase() !== activeCategory.toLowerCase()) return false
            }

            // 1. Search Query
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                const matchesSearch =
                    job.title.toLowerCase().includes(query) ||
                    job.company.toLowerCase().includes(query) ||
                    job.tags.some(tag => tag.toLowerCase().includes(query))
                if (!matchesSearch) return false
            }

            // 2. Location Query (Input)
            if (locationQuery) {
                if (!job.location.toLowerCase().includes(locationQuery.toLowerCase())) return false
            }

            // 3. Job Type (Filter)
            if (filters.type.length > 0) {
                if (!filters.type.includes(job.type)) return false
            }

            // 4. Work Mode
            if (filters.workMode.length > 0) {
                const jobLocationLower = job.location.toLowerCase()
                const matchesMode = filters.workMode.some(mode => {
                    if (mode === "Remote") return jobLocationLower.includes("remote")
                    if (mode === "Hybrid") return jobLocationLower.includes("hybrid")
                    if (mode === "On-site") return !jobLocationLower.includes("remote") && !jobLocationLower.includes("hybrid")
                    return false
                })
                if (!matchesMode) return false
            }

            // 5. Experience Level
            if (filters.experience.length > 0) {
                // Heuristic matching against job.experience (e.g. "0 - 2 years") or title
                const matchesExp = filters.experience.some(exp => {
                    const expLower = exp.toLowerCase()
                    const jobExp = job.experience?.toLowerCase() || ""
                    const title = job.title.toLowerCase()

                    if (expLower.includes("fresher")) return jobExp.includes("0") || jobExp.includes("fresh") || title.includes("intern")
                    if (expLower.includes("junior")) return jobExp.includes("1-") || jobExp.includes("2-") || title.includes("junior")
                    if (expLower.includes("mid")) return jobExp.includes("3-") || jobExp.includes("4-") || jobExp.includes("5-")
                    if (expLower.includes("senior")) return jobExp.includes("5+") || jobExp.includes("6") || jobExp.includes("7") || title.includes("senior")
                    if (expLower.includes("lead")) return jobExp.includes("10") || jobExp.includes("12") || title.includes("lead") || title.includes("manager")

                    return false
                })
                if (!matchesExp) return false
            }

            // 6. Salary (Heuristic)
            if (filters.salary.length > 0) {
                // Parse filter ranges
                const matchesSalary = filters.salary.some(range => {
                    const jobSalary = job.salary.toLowerCase()
                    if (jobSalary.includes("not disclosed")) return false // Unless specific filter for this?

                    // Simple logic for LPA
                    if (range.includes("LPA")) {
                        // Extract min/max from range e.g. "3-6 LPA"
                        const parts = range.match(/(\d+)/g)
                        if (!parts) return false
                        const min = parseInt(parts[0])
                        const max = parts[1] ? parseInt(parts[1]) : 999

                        // Extract number from job salary if in Lakhs
                        // e.g. "₹20L - ₹35L"
                        const jobParts = jobSalary.match(/(\d+)/g)
                        if (!jobParts) return false

                        // If job in USD, treat as high value (e.g. > 20 LPA)
                        if (jobSalary.includes("$") || jobSalary.includes("usd")) return max >= 20

                        // Check numeric overlap
                        const jobVal = parseInt(jobParts[0])
                        return jobVal >= min && jobVal <= max
                    }
                    return true
                })
                if (!matchesSalary) return false
            }

            // 7. Posted Date
            if (filters.postedDate.length > 0) {
                const matchesDate = filters.postedDate.some(dateFilter => {
                    const posted = job.postedAt.toLowerCase()
                    if (dateFilter.includes("24 hours")) return posted.includes("hour") || posted.includes("just now")
                    if (dateFilter.includes("3 days")) return posted.includes("hour") || posted.includes("just now") || posted.includes("1 day") || posted.includes("2 days")
                    if (dateFilter.includes("7 days")) return !posted.includes("week") && !posted.includes("month")
                    if (dateFilter.includes("30 days")) return !posted.includes("month")
                    return true
                })
                if (!matchesDate) return false
            }

            // Other filters (education, companyType) ignored for mock data limit
            // Real implementation would check job.companyType, job.education

            return true
        })
    }, [searchQuery, locationQuery, filters, activeCategory])

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    // Reset page when filters change
    const paginatedJobs = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredJobs, currentPage])

    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)

    return (
        <div className="min-h-screen flex flex-col bg-muted/5 pt-16">

            {/* Page Header */}
            <div className="bg-background border-b py-12">
                <div className="container px-4 mx-auto text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold font-heading mb-3 tracking-tight">
                            {activeCategory ? `${activeCategory} Jobs` : "Find your next job"}
                        </h1>
                        <p className="text-muted-foreground text-lg mb-8">
                            {activeCategory
                                ? <>Showing all <span className="font-semibold text-foreground">{activeCategory}</span> positions</>
                                : <>Browse <span className="font-semibold text-foreground">{JOBS.length}+</span> open positions at top companies.</>
                            }
                        </p>

                        {/* Active Category Badge */}
                        {activeCategory && (
                            <div className="flex justify-center mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">
                                    Category: {activeCategory}
                                    <button
                                        onClick={clearCategory}
                                        className="ml-1 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Search Bar - Elevated */}
                        {/* Search Bar - Premium Pill Design */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center p-2 bg-background rounded-2xl md:rounded-full shadow-lg border border-border/40 max-w-4xl w-full mx-auto">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Job title, keywords, or company"
                                    className="pl-12 md:pl-14 h-12 md:h-14 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base rounded-xl md:rounded-full"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            <div className="h-px w-full md:w-px md:h-8 bg-border/50 my-2 md:my-0 md:mx-2" />
                            <div className="flex-1 relative group">
                                <MapPin className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="City, state, or zip"
                                    className="pl-12 md:pl-14 h-12 md:h-14 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base rounded-xl md:rounded-full"
                                    value={locationQuery}
                                    onChange={(e) => { setLocationQuery(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            <Button size="lg" className="w-full md:w-auto px-8 h-12 rounded-xl md:rounded-full md:ml-2 text-base font-medium shadow-md transition-all hover:shadow-lg">
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container px-4 mx-auto py-8 flex-1">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Mobile Filter Trigger */}
                    <div className="w-full lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                                <div className="h-full py-6 px-4">
                                    <JobFilters filters={filters} setFilters={(f) => { setFilters(f); setCurrentPage(1); }} />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Sidebar - Sticky */}
                    <aside className="w-full lg:w-72 shrink-0 hidden lg:block sticky top-24">
                        <div className="bg-background rounded-xl border border-border/50 p-6 shadow-sm">
                            <JobFilters filters={filters} setFilters={(f) => { setFilters(f); setCurrentPage(1); }} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 w-full min-w-0">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-semibold">Recommended Jobs</h2>
                                <p className="text-sm text-muted-foreground">Showing {filteredJobs.length} jobs based on your preferences</p>
                            </div>

                            <div className="flex items-center gap-2 bg-background p-1 rounded-lg border shadow-sm">
                                <Button
                                    variant="ghost" size="sm"
                                    className={`h-8 w-8 p-0 ${view === "list" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground"}`}
                                    onClick={() => setView("list")}
                                >
                                    <ListIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost" size="sm"
                                    className={`h-8 w-8 p-0 ${view === "grid" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground"}`}
                                    onClick={() => setView("grid")}
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {filteredJobs.length > 0 ? (
                            <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                                {paginatedJobs.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 text-muted-foreground bg-background rounded-xl border border-dashed">
                                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <h3 className="text-lg font-medium text-foreground mb-1">No jobs found</h3>
                                <p className="mb-6">Adjust your filters to see more results</p>
                                <Button variant="outline" onClick={() => setFilters({
                                    type: [],
                                    workMode: [],
                                    experience: [],
                                    salary: [],
                                    companyType: [],
                                    location: [],
                                    education: [],
                                    postedDate: []
                                })}>Clear All Filters</Button>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-3">
                                <Button
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="h-9 px-4"
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1 text-sm font-medium">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    disabled={currentPage === totalPages}
                                    onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="h-9 px-4"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
