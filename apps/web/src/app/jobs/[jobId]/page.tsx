"use client"

import { notFound, useParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { JobHeader } from "@/components/features/jobs/job-header"
import { JobDescription } from "@/components/features/jobs/job-description"
import { JobCard } from "@/components/shared/job-card"
import { JOBS } from "@/lib/mock-api/jobs"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function JobDetailsPage() {
    const params = useParams<{ jobId: string }>()

    // Extract ID from the end of the slug (e.g., "frontend-engineer-acme-1" -> "1")
    const slugParts = params.jobId.split('-')
    const id = slugParts[slugParts.length - 1]

    const job = JOBS.find(j => j.id === id)

    // Find similar jobs (mock logic: same category or random, excluding current)
    // For now, just take first 2 other jobs
    const similarJobs = JOBS.filter(j => j.id !== id).slice(0, 3)

    if (!job) {
        return notFound()
    }

    return (
        <div className="min-h-screen flex flex-col bg-muted/5">
            <Navbar />

            <main className="flex-1 container py-8">
                <Link href="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Jobs
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-6">
                        <JobHeader job={job} />
                        <JobDescription job={job} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            {/* Similar Jobs Widget */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg px-1">Similar Jobs</h3>
                                <div className="space-y-4">
                                    {similarJobs.map(similarJob => (
                                        <JobCard key={similarJob.id} job={similarJob} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
