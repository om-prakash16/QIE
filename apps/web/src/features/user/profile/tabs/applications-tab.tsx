import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Building2 } from "lucide-react"
import { UserProfile } from "@/lib/mock-api/user-profile"

interface ApplicationsTabProps {
    data: UserProfile
}

export function ApplicationsTab({ data }: ApplicationsTabProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Hired": return "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
            case "Shortlisted": return "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
            case "Rejected": return "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
            default: return "bg-muted text-muted-foreground hover:bg-muted"
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>Track the status of your recent applications.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-6 md:col-span-5">Job Details</div>
                        <div className="col-span-3 hidden md:block">Company</div>
                        <div className="col-span-3 md:col-span-2">Date</div>
                        <div className="col-span-3 md:col-span-2 text-right md:text-left">Status</div>
                    </div>
                    <div>
                        {data.applications.map((app) => (
                            <div key={app.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/5 transition-colors border-b last:border-0">
                                <div className="col-span-6 md:col-span-5 flex gap-3 items-center">
                                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                                        {app.logo ? (
                                            <span className="font-bold text-xs">{app.company[0]}</span>
                                        ) : (
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="font-medium text-sm line-clamp-1">{app.jobTitle}</div>
                                </div>
                                <div className="col-span-3 hidden md:block text-sm text-muted-foreground">{app.company}</div>
                                <div className="col-span-3 md:col-span-2 text-sm text-muted-foreground">{app.appliedDate}</div>
                                <div className="col-span-3 md:col-span-2 flex justify-end md:justify-start">
                                    <Badge variant="outline" className={`border-0 font-medium ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
