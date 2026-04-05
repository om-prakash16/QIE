"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { TalentFilters } from "@/components/features/talent/talent-filters"
import { TalentCard } from "@/components/features/talent/talent-card"
import { TalentSkeleton } from "@/components/features/talent/talent-skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { TALENT_DATA, Talent } from "@/lib/mock-api/talent"
import { USER_PROFILE } from "@/lib/mock-api/user-profile"

// --- Mock API Fetcher ---
interface FetchParams {
    query?: string
    role?: string[]
    skills?: string[]
    loc?: string[]
    exp?: string[]
    availability?: string[]
    page?: number
    limit?: number
}

const fetchTalent = async (params: FetchParams) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const currentUserAsTalent: Talent = {
        id: USER_PROFILE.id,
        name: `${USER_PROFILE.basic.firstName} ${USER_PROFILE.basic.lastName} (You)`,
        title: USER_PROFILE.basic.title,
        role: "Frontend", // Mapping from title ideally, mock fallback
        avatar: USER_PROFILE.basic.avatar,
        location: USER_PROFILE.basic.location,
        experience: "4 Years", // Mock calculation
        experienceLevel: USER_PROFILE.basic.experienceLevel,
        skills: USER_PROFILE.skills.map(s => s.name),
        availability: "Immediate",
        completion: USER_PROFILE.basic.completion,
        verified: true,
    }

    let data = [currentUserAsTalent, ...TALENT_DATA]

    // Filtering
    if (params.query) {
        const q = params.query.toLowerCase()
        data = data.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.title.toLowerCase().includes(q) ||
            t.role.toLowerCase().includes(q)
        )
    }

    if (params.role && params.role.length > 0) {
        data = data.filter(t => params.role?.some(r => t.role.toLowerCase().includes(r.toLowerCase())))
    }

    if (params.loc && params.loc.length > 0) {
        data = data.filter(t => params.loc?.some(l => t.location.toLowerCase().includes(l.toLowerCase())))
    }

    if (params.exp && params.exp.length > 0) {
        // Simple exact match (or contains) to mock level
        data = data.filter(t => params.exp?.some(e => t.experienceLevel.toLowerCase() === e.toLowerCase()))
    }

    if (params.availability && params.availability.length > 0) {
        data = data.filter(t => params.availability?.includes(t.availability))
    }

    if (params.skills && params.skills.length > 0) {
        data = data.filter(t =>
            params.skills?.some(s => t.skills.some(ts => ts.toLowerCase().includes(s.toLowerCase())))
        )
    }

    // Pagination
    const page = params.page || 1
    const limit = params.limit || 9
    const total = data.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedData = data.slice(startIndex, startIndex + limit)

    return {
        data: paginatedData,
        meta: { total, totalPages, page, limit }
    }
}

// --- Main Content Component ---
function TalentContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const page = Number(searchParams.get("page")) || 1
    const query = searchParams.get("query") || ""

    // Helper to update query
    const updateSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (term) params.set("query", term)
        else params.delete("query")
        params.set("page", "1") // reset page
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    // React Query
    const { data, isLoading, isError } = useQuery({
        queryKey: ["talent", searchParams.toString()],
        queryFn: () => fetchTalent({
            query: searchParams.get("query") || undefined,
            role: searchParams.get("role")?.split(",") || undefined,
            loc: searchParams.get("loc")?.split(",") || undefined,
            exp: searchParams.get("exp")?.split(",") || undefined,
            availability: searchParams.get("availability")?.split(",") || undefined,
            skills: searchParams.get("skills")?.split(",") || undefined,
            page: page,
            limit: 9
        }),
        staleTime: 5000 // Keep data fresh for 5s
    })

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", newPage.toString())
        router.push(`${pathname}?${params.toString()}`, { scroll: true })
    }

    return (
        <div className="min-h-screen bg-muted/5 flex flex-col pt-16">

            {/* Page Header */}
            <div className="bg-background border-b pt-12 pb-8 px-4 sm:px-6 sticky top-16 z-20">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">Discover Talent</h1>
                            <p className="text-muted-foreground mt-1">Connect with verified professionals ready for their next opportunity.</p>
                        </div>

                        {/* Search Input */}
                        <div className="w-full md:w-96 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, role, or skill..."
                                className="pl-9 h-11 bg-muted/30 focus:bg-background transition-all"
                                defaultValue={query}
                                onChange={(e) => updateSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 flex-1 flex flex-col lg:flex-row gap-8">

                {/* Mobile Filter Trigger */}
                <div className="lg:hidden w-full mb-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters & Preferences
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6">
                            <TalentFilters />
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Sidebar Filters (Desktop) */}
                <aside className="hidden lg:block w-72 shrink-0 space-y-8 sticky top-48 h-fit">
                    <TalentFilters />
                </aside>

                {/* Grid Content */}
                <div className="flex-1 w-full min-w-0">

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <TalentSkeleton key={i} />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-20 text-red-500">
                            Failed to load talent data. Please try again.
                        </div>
                    ) : data?.data && data.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {data.data.map((talent) => (
                                    <TalentCard key={talent.id} talent={talent} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1}
                                    onClick={() => handlePageChange(page - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm font-medium px-4">
                                    Page {page} of {data.meta.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= data.meta.totalPages}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl bg-muted/10">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">No talent found</h3>
                            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                                We couldn't find any candidates matching your active filters. Try broadening your search.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => router.push(pathname)}
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default function TalentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><TalentSkeleton /></div>}>
            <TalentContent />
        </Suspense>
    )
}
