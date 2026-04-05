"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Clock, Trash2, Eye, Building2 } from "lucide-react"
import { SavedJob } from "@/lib/mock-api/saved-jobs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface SavedJobCardProps {
    job: SavedJob
    onRemove: (id: string) => void
}

export function SavedJobCard({ job, onRemove }: SavedJobCardProps) {
    return (
        <Card className="group hover:shadow-md transition-all duration-300 border-border/50">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex gap-4">
                    <Avatar className="h-12 w-12 rounded-lg border">
                        <AvatarImage src={job.logo} alt={job.company} />
                        <AvatarFallback className="rounded-lg bg-primary/5 text-primary font-bold">
                            {job.company.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg leading-none group-hover:text-primary transition-colors">
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{job.company}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                        </div>
                    </div>
                </div>
                <Badge variant="secondary" className="font-normal opacity-0 group-hover:opacity-100 transition-opacity">
                    Saved on {new Date(job.savedDate).toLocaleDateString()}
                </Badge>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        {job.salary}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Posted {job.postedDate}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-4 flex justify-between gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -ml-2"
                    onClick={() => onRemove(job.id)}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                </Button>
                <Link href={`/jobs/${job.id}`} className="flex-1 max-w-[140px]">
                    <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Job
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
