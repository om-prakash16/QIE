import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MapPin, Clock, DollarSign, Briefcase, Bookmark } from "lucide-react"
import Link from "next/link"

interface JobCardProps {
    job: {
        id: string
        title: string
        company: string
        location: string
        type: string
        salary: string
        postedAt: string
        tags: string[]
        description?: string
        rating?: number
        reviews?: number
        experience?: string
        openings?: number
        applicants?: string
        roleCategory?: string
        education?: string
        keySkills?: string[]
    }
}

export function JobCard({ job }: JobCardProps) {
    // Helper to generate slug
    const createSlug = (title: string, company: string, id: string) => {
        const slug = `${title}-${company}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        return `/jobs/${slug}-${id}`
    }

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Bookmark className="w-4 h-4" />
                </Button>
            </div>

            <CardHeader className="flex flex-row items-start justify-between pb-2 pr-12">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground uppercase shrink-0">
                        {job.company.substring(0, 2)}
                    </div>
                    <div>
                        <Link href={createSlug(job.title, job.company, job.id)} className="hover:underline">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className="font-medium text-foreground">{job.company}</span>
                            {job.rating && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center text-yellow-500">
                                        <span className="mr-1">{job.rating}</span> ★
                                    </span>
                                </>
                            )}
                            {job.reviews && (
                                <span className="text-xs">({job.reviews} Reviews)</span>
                            )}
                        </div>
                    </div>
                </div>
                <Badge variant="secondary" className="font-normal shrink-0">{job.type}</Badge>
            </CardHeader>

            <CardContent className="pb-3 space-y-3">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    {job.experience && (
                        <div className="flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>{job.experience}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{job.location}</span>
                    </div>
                </div>

                {job.description && (
                    <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                        {job.description}
                    </p>
                )}

                <div className="flex gap-2 flex-wrap pt-1">
                    {job.tags.slice(0, 4).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs bg-muted/30 hover:bg-muted/50 transition-colors font-normal">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{job.postedAt}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                        <Bookmark className="w-4 h-4" />
                    </Button>
                    <Link href={createSlug(job.title, job.company, job.id)} className="w-full">
                        <Button variant="outline" size="sm" className="h-8 w-full">
                            View Details
                        </Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
