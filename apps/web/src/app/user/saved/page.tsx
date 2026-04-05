"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, BookmarkX, ArrowRight } from "lucide-react"
import { SavedJobCard } from "@/components/features/user/saved-job-card"
import { SAVED_JOBS, SavedJob } from "@/lib/mock-api/saved-jobs"
import { SavedJobsSkeleton } from "@/components/features/user/saved-jobs-skeleton"
import { Pagination } from "@/components/shared/pagination"
import Link from "next/link"

// Mock fetch function
const fetchSavedJobs = async (): Promise<SavedJob[]> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return SAVED_JOBS
}

const ITEMS_PER_PAGE = 6

export default function SavedJobsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("recent")
    const [currentPage, setCurrentPage] = useState(1)
    // Local state for optimistic UI updates (removing items)
    const [removedIds, setRemovedIds] = useState<string[]>([])

    const { data, isLoading } = useQuery({
        queryKey: ["savedJobs"],
        queryFn: fetchSavedJobs,
    })

    // Filter logic
    const filteredJobs = data
        ?.filter(job => !removedIds.includes(job.id))
        .filter(job =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "recent") return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
            if (sortBy === "location") return a.location.localeCompare(b.location)
            if (sortBy === "type") return a.type.localeCompare(b.type)
            return 0
        }) || []

    // Pagination logic
    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handleRemove = (id: string) => {
        setRemovedIds(prev => [...prev, id])
    }

    // Reset pagination when search changes
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1)
    }

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
                    <p className="text-muted-foreground">Jobs you bookmarked to apply later</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <SavedJobsSkeleton key={i} />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in-50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
                    <p className="text-muted-foreground">
                        Jobs you bookmarked to apply later
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search saved jobs..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Recently Saved</SelectItem>
                            <SelectItem value="location">Location</SelectItem>
                            <SelectItem value="type">Job Type</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* List */}
            {paginatedJobs.length > 0 ? (
                <>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedJobs.map(job => (
                            <SavedJobCard
                                key={job.id}
                                job={job}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl bg-muted/5">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <BookmarkX className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-semibold">You haven&apos;t saved any jobs yet</h3>
                    <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                        {searchQuery
                            ? "No jobs found matching your search. Try adjusting your filters."
                            : "Start exploring opportunities and bookmark the ones you like!"}
                    </p>
                    <Link href="/jobs">
                        <Button>
                            Browse Jobs <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
