import { Company } from "@/lib/mock-api/companies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Clock, Monitor } from "lucide-react"

export function OverviewTab({ company }: { company: Company }) {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>About {company.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            {company.description}
                        </p>
                    </CardContent>
                </Card>

                <div className="grid sm:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Briefcase className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{company.stats.activeJobs}</div>
                                <div className="text-xs text-muted-foreground uppercase font-medium">Open Jobs</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{company.stats.avgExperience}</div>
                                <div className="text-xs text-muted-foreground uppercase font-medium">Avg Exp</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Monitor className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-lg font-bold truncate w-full">{company.stats.workType}</div>
                                <div className="text-xs text-muted-foreground uppercase font-medium">Work Type</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Hiring Focus</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            We are primarily looking for Engineering and Product roles to support our rapid growth.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {/* Mock tags based on industry */}
                            {company.industry === "AI/ML" && (
                                <>
                                    <span className="px-2 py-1 bg-muted rounded text-xs">Machine Learning</span>
                                    <span className="px-2 py-1 bg-muted rounded text-xs">Python</span>
                                    <span className="px-2 py-1 bg-muted rounded text-xs">Data Science</span>
                                </>
                            )}
                            <span className="px-2 py-1 bg-muted rounded text-xs">Senior Level</span>
                            <span className="px-2 py-1 bg-muted rounded text-xs">Full Time</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
