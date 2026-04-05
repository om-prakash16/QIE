import { Company } from "@/lib/mock-api/companies"
import { JobCard } from "@/components/shared/job-card"
import { JOBS } from "@/lib/mock-data"

export function JobsTab({ company }: { company: Company }) {
    // Filter jobs for this company (mock: using company name matching or just showing random ones for demo if ID missing)
    // In real app, filter by company.id
    // For this mock, I'll filter by company name match or show all if specifically assigned
    // Given the mock-data structure might not strictly link, I'll just show the first 3 jobs as "mock company jobs"
    const companyJobs = JOBS.slice(0, 3)

    return (
        <div className="space-y-6">
            <h3 className="font-semibold text-lg">Open Positions at {company.name}</h3>
            <div className="space-y-4">
                {companyJobs.length > 0 ? (
                    companyJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))
                ) : (
                    <p className="text-muted-foreground">No open positions currently.</p>
                )}
            </div>
        </div>
    )
}
