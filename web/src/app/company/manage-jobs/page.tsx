"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ExternalLink, Trash2, Edit2, Briefcase } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"

export default function ManageJobsPage() {
    const { user } = useAuth()

    const { data: jobs, isLoading, refetch } = useQuery({
        queryKey: ["companyJobs", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('posted_by', user?.id)
                .order('created_at', { ascending: false })
            
            if (error) throw error
            return data
        },
        enabled: !!user?.id
    })

    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const handleDelete = async (jobId: string) => {
        if (!confirm("Are you sure you want to delete this job posting?")) return
        
        setIsDeleting(jobId)
        try {
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', jobId)
            
            if (error) throw error
            toast.success("Job deleted successfully")
            refetch()
        } catch (error: any) {
            toast.error(`Error deleting job: ${error.message}`)
        } finally {
            setIsDeleting(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading tracking-tight">Manage Jobs</h1>
                    <p className="text-muted-foreground">View and edit your current job listings.</p>
                </div>
                <Link href="/company/post-job">
                    <Button>Post New Job</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        Active Postings
                    </CardTitle>
                    <CardDescription>All positions currently visible on the marketplace.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!jobs || jobs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>You haven't posted any jobs yet.</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Posted</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jobs.map((job) => (
                                        <TableRow key={job.id}>
                                            <TableCell className="font-medium">{job.title}</TableCell>
                                            <TableCell><Badge variant="outline">{job.job_type || 'Full-time'}</Badge></TableCell>
                                            <TableCell>{job.location || 'Remote'}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(job.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild title="View live">
                                                        <Link href={`/jobs/${job.id}`}>
                                                            <ExternalLink className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" title="Edit (Coming Soon)">
                                                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => handleDelete(job.id)}
                                                        disabled={isDeleting === job.id}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        {isDeleting === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
