"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { fetchApplications } from "@/lib/mock-api/applications"
import { ApplicationTable, ApplicationsSkeleton } from "@/components/features/applications/application-table"
import { Search, SlidersHorizontal } from "lucide-react"

export default function ApplicationsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const { data: applications, isLoading } = useQuery({
        queryKey: ["applications", searchQuery, statusFilter],
        queryFn: () => fetchApplications({
            query: searchQuery || undefined,
            status: statusFilter === "all" ? undefined : statusFilter
        })
    })

    const hasFilters = searchQuery || (statusFilter && statusFilter !== "all")

    const clearFilters = () => {
        setSearchQuery("")
        setStatusFilter("all")
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-heading tracking-tight">My Applications</h1>
                <p className="text-muted-foreground mt-2">
                    Track the status of your job applications and upcoming interviews.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by job title or company..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                                <SelectValue placeholder="Filter by Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Applied">Applied</SelectItem>
                            <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="Interviewing">Interviewing</SelectItem>
                            <SelectItem value="Hired">Hired</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <ApplicationsSkeleton />
            ) : applications && applications.length > 0 ? (
                <ApplicationTable data={applications} />
            ) : (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No applications found</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            {hasFilters
                                ? "We couldn't find any applications matching your filters."
                                : "You haven't applied to any jobs yet. Start exploring opportunities!"}
                        </p>
                        {hasFilters ? (
                            <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
                        ) : (
                            <Button onClick={() => window.location.href = "/jobs"}>Browse Jobs</Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
