"use client"

import { useQuery } from "@tanstack/react-query"
import { getCompanyJobs } from "@/lib/mock-api/company-jobs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Search, Eye, Archive, MoreVertical } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CompanyJobsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const { data: jobs, isLoading } = useQuery({
        queryKey: ["companyJobs"],
        queryFn: getCompanyJobs
    })

    const filteredJobs = jobs?.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading tracking-tight">Manage Jobs</h1>
                    <p className="text-muted-foreground">Monitor your job postings and applicant counts.</p>
                </div>
                <Link href="/company/jobs/create">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Post New Job
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Posted Jobs</CardTitle>
                        <div className="w-full max-w-sm relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search jobs..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Applicants</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredJobs?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No jobs found matching your search.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredJobs?.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{job.title}</span>
                                                <span className="text-xs text-muted-foreground md:hidden">{job.location}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">{job.location}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">{job.type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{job.applicantsCount}</span>
                                                {job.applicantsCount > 0 && <span className="text-xs text-green-600 font-medium">Active</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={job.status === "Open" ? "default" : "secondary"}>
                                                {job.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/company/jobs/${job.id}/applicants`}>
                                                    <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                                                        View Applicants
                                                    </Button>
                                                </Link>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <Link href={`/company/jobs/${job.id}/applicants`}>
                                                            <DropdownMenuItem>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Applicants
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem disabled={job.status === "Closed"}>
                                                            <Archive className="w-4 h-4 mr-2" />
                                                            Close Job
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
