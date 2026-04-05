import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/lib/mock-api/user-profile"
import { ArrowRight, Star, Clock } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"

interface OverviewTabProps {
    data: UserProfile
    isEditing?: boolean
}

export function OverviewTab({ data, isEditing }: OverviewTabProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Summary Section */}
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Professional Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            <Textarea
                                defaultValue={data.basic.bio}
                                className="min-h-[120px]"
                            />
                        ) : (
                            <p className="text-muted-foreground leading-relaxed">
                                {data.basic.bio}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.filter(s => s.level === "Advanced").slice(0, 5).map(skill => (
                                    <Badge key={skill.name} variant="secondary">
                                        {skill.name}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Experience Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.experience.slice(0, 2).map(exp => (
                                <div key={exp.id} className="flex gap-3 items-start">
                                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0 font-bold text-muted-foreground text-xs">
                                        {exp.company.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{exp.role}</p>
                                        <p className="text-xs text-muted-foreground">{exp.company}</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                View Full Experience <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Sidebar Activity */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm">
                            <p className="font-medium">Applied to Senior Frontend Engineer</p>
                            <p className="text-xs text-muted-foreground">Acme Corp • 2 days ago</p>
                        </div>
                        <div className="text-sm border-t pt-3">
                            <p className="font-medium">Updated Skills Section</p>
                            <p className="text-xs text-muted-foreground">Added Docker • 5 days ago</p>
                        </div>
                        <div className="text-sm border-t pt-3">
                            <p className="font-medium">Profile Viewed by Recruiter</p>
                            <p className="text-xs text-muted-foreground">Linear • 1 week ago</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            More Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-xs text-muted-foreground font-medium mb-1">Languages</p>
                            <div className="flex flex-wrap gap-1.5">
                                {data.basic.languages?.map(lang => (
                                    <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                                )) || <span className="text-sm">English</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium mb-1">Join Date</p>
                                <p className="text-sm">{data.basic.joinDate || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium mb-1">Job Type</p>
                                <p className="text-sm">{data.basic.jobType}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground font-medium mb-1">Email</p>
                            <p className="text-sm break-all">{data.basic.email}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
