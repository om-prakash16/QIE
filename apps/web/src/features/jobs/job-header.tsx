import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, DollarSign, Clock, Users, Bookmark, Share2, Star } from "lucide-react"
import type { Job } from "@/lib/mock-api/jobs"

interface JobHeaderProps {
    job: Job
}

export function JobHeader({ job }: JobHeaderProps) {
    return (
        <div className="bg-background rounded-2xl border shadow-sm p-6 md:p-8 mb-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Top Row: Title & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 relative z-10">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold font-heading mb-2">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="font-semibold text-foreground text-lg">{job.company}</span>
                        {job.rating && (
                            <div className="flex items-center gap-1 text-muted-foreground border-l pl-3">
                                <span className="flex items-center text-yellow-500 font-bold">
                                    {job.rating} <Star className="w-3.5 h-3.5 fill-current ml-0.5" />
                                </span>
                                {job.reviews && <span className="underline decoration-dotted text-xs">({job.reviews} Reviews)</span>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <Button size="lg" className="flex-1 md:flex-none shadow-md hover:shadow-lg transition-all rounded-xl px-8">
                        Apply Now
                    </Button>
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl shrink-0">
                        <Bookmark className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl shrink-0 text-muted-foreground">
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-b py-6 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                        <Briefcase className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Experience</p>
                        <p className="font-semibold">{job.experience || "Not Disclosed"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                        <DollarSign className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Salary</p>
                        <p className="font-semibold">{job.salary}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Location</p>
                        <p className="font-semibold">{job.location}</p>
                    </div>
                </div>
                {job.applicants && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg shrink-0">
                            <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Applicants</p>
                            <p className="font-semibold text-primary">{job.applicants} Applied</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
                <div className="flex flex-wrap gap-2">
                    <span className="bg-muted/50 px-2 py-1 rounded text-xs">Posted: {job.postedAt}</span>
                    <span className="bg-muted/50 px-2 py-1 rounded text-xs">Openings: {job.openings || 1}</span>
                    <span className="bg-muted/50 px-2 py-1 rounded text-xs text-green-600 font-medium bg-green-500/10">Early Applicant</span>
                </div>
                <Button variant="link" className="h-auto p-0 text-primary">
                    Send me jobs like this
                </Button>
            </div>
        </div>
    )
}
