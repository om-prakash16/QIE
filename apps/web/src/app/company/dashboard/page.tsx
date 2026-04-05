"use client"

import { useQuery } from "@tanstack/react-query"
import { getCompanyStats } from "@/lib/mock-api/company"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, CheckCircle2, XCircle, Plus, FileText, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function CompanyDashboardPage() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["companyStats"],
        queryFn: getCompanyStats
    })

    if (isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!stats) return null;

    const statCards = [
        { label: "Active Jobs", value: stats.activeJobs, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Applicants", value: stats.totalApplicants, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { label: "Shortlisted", value: stats.shortlisted, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Jobs Closed", value: stats.closedJobs, icon: XCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading tracking-tight">Company Dashboard</h1>
                    <p className="text-muted-foreground">Manage your hiring activity and talent pipeline.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/company/jobs/create">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Post New Job
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <Card key={i} className="hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <div className={cn("p-2 rounded-full", stat.bg)}>
                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Recent Activity */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates from your hiring team.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {stats.recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center">
                                    <div className="mr-4 rounded-full bg-primary/10 p-2">
                                        {activity.type === 'job_posted' && <Briefcase className="h-4 w-4 text-primary" />}
                                        {activity.type === 'new_applicant' && <Users className="h-4 w-4 text-primary" />}
                                        {activity.type === 'job_closed' && <XCircle className="h-4 w-4 text-primary" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{activity.message}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Shortcuts to manage your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/company/jobs" className="block">
                            <Button variant="outline" className="w-full justify-between group">
                                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Manage Jobs</span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </Link>
                        <Link href="/company/talent" className="block">
                            <Button variant="outline" className="w-full justify-between group">
                                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Browse Talent</span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
