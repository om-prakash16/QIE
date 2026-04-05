import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Globe, Linkedin, Twitter, Facebook } from "lucide-react"
import type { Job } from "@/lib/mock-api/jobs"
import Link from "next/link"

interface JobDescriptionProps {
    job: Job
}

export function JobDescription({ job }: JobDescriptionProps) {
    return (
        <div className="grid gap-6">
            {/* Job Highlights */}
            {job.highlights && (
                <div className="bg-background rounded-2xl border shadow-sm p-6">
                    <h2 className="text-lg font-bold font-heading mb-4">Job Highlights</h2>
                    <ul className="space-y-3">
                        {job.highlights.map((highlight, index) => (
                            <li key={index} className="flex gap-3 text-sm text-foreground/80">
                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                <span className="leading-relaxed">{highlight}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Main Description */}
            <div className="bg-background rounded-2xl border shadow-sm p-6 space-y-8">
                <div>
                    <h2 className="text-lg font-bold font-heading mb-4">Job Description</h2>
                    <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                        {job.description}
                    </div>
                </div>

                {/* Role Details Table */}
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm border-t pt-6">
                    {job.roleCategory && (
                        <div>
                            <span className="text-muted-foreground block mb-1">Role Category</span>
                            <span className="font-medium">{job.roleCategory}</span>
                        </div>
                    )}
                    {job.type && (
                        <div>
                            <span className="text-muted-foreground block mb-1">Employment Type</span>
                            <span className="font-medium">{job.type}</span>
                        </div>
                    )}
                    {job.education && (
                        <div className="md:col-span-2">
                            <span className="text-muted-foreground block mb-1">Education</span>
                            <span className="font-medium">{job.education}</span>
                        </div>
                    )}
                </div>

                {/* Key Skills */}
                {job.keySkills && (
                    <div>
                        <h3 className="font-semibold mb-3">Key Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {job.keySkills.map(skill => (
                                <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm font-normal rounded-lg">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* About Company */}
            <div className="bg-background rounded-2xl border shadow-sm p-6">
                <h2 className="text-lg font-bold font-heading mb-4">About {job.company}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {job.aboutCompany || `About ${job.company}`}
                </p>

                {job.benefits && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3 text-sm">Benefits & Perks</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {job.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs font-medium text-foreground/80 bg-muted/50 p-2 rounded">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                    {benefit}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {job.companySocials && (
                    <div>
                        <h3 className="font-semibold mb-3 text-sm">Follow {job.company}</h3>
                        <div className="flex gap-3">
                            {job.companySocials.website && (
                                <Link href={job.companySocials.website} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                    <Globe className="w-4 h-4" />
                                </Link>
                            )}
                            {job.companySocials.linkedin && (
                                <Link href={job.companySocials.linkedin} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </Link>
                            )}
                            {job.companySocials.twitter && (
                                <Link href={job.companySocials.twitter} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </Link>
                            )}
                            {job.companySocials.facebook && (
                                <Link href={job.companySocials.facebook} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                    <Facebook className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
