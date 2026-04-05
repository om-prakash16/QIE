"use client"

import { useQuery } from "@tanstack/react-query"
import { getApplicantsByJobId } from "@/lib/mock-api/company-applicants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, MoreHorizontal, Github, Check, X, Mail } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function JobApplicantsPage() {
    const params = useParams()
    const jobId = params.jobId as string

    const { data: applicants, isLoading } = useQuery({
        queryKey: ["jobApplicants", jobId],
        queryFn: () => getApplicantsByJobId(jobId)
    })

    const handleAction = (action: string, name: string) => {
        toast.message(`Applicant ${action}`, {
            description: `${name} has been marked as ${action.toLowerCase()}.`
        })
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/company/jobs">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold font-heading tracking-tight">Review Applicants</h1>
                    <p className="text-muted-foreground">Managing candidates for Job ID: #{jobId}</p>
                </div>
            </div>

            <div className="grid gap-4">
                {applicants?.map((applicant) => (
                    <Card key={applicant.id} className="transition-colors hover:bg-muted/10">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start md:items-center gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-border">
                                        <AvatarImage src={applicant.avatar} />
                                        <AvatarFallback>{applicant.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg">{applicant.name}</h3>
                                            {applicant.hasGithub && (
                                                <div className="bg-muted p-1 rounded-full text-foreground/80" title="GitHub Connected">
                                                    <Github className="w-3 h-3" />
                                                </div>
                                            )}
                                            <Badge variant={
                                                applicant.status === 'New' ? 'secondary' :
                                                    applicant.status === 'Shortlisted' ? 'default' :
                                                        applicant.status === 'Rejected' ? 'destructive' : 'outline'
                                            } className="ml-2">
                                                {applicant.status}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground font-medium">{applicant.role}</p>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {applicant.skills.map((skill) => (
                                                <Badge key={skill} variant="outline" className="text-xs bg-background/50">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 md:self-center self-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleAction('Rejected', applicant.name)}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleAction('Shortlisted', applicant.name)}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Shortlist
                                    </Button>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Mail className="w-4 h-4 mr-2" />
                                                Contact Candidate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                View Full Profile
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t flex justify-between text-xs text-muted-foreground">
                                <span>Applied {applicant.appliedAt}</span>
                                <span>{applicant.email}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {applicants?.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No applicants yet for this job.
                    </div>
                )}
            </div>
        </div>
    )
}
