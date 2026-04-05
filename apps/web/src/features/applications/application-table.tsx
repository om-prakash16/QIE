import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Eye, ExternalLink, MoreHorizontal } from "lucide-react"
import { Application } from "@/lib/mock-api/applications"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ApplicationTableProps {
    data: Application[]
}

const getStatusColor = (status: Application["status"]) => {
    switch (status) {
        case "Applied": return "bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400"
        case "Shortlisted": return "bg-purple-100 text-purple-700 hover:bg-purple-100/80 dark:bg-purple-900/30 dark:text-purple-400"
        case "Interviewing": return "bg-orange-100 text-orange-700 hover:bg-orange-100/80 dark:bg-orange-900/30 dark:text-orange-400"
        case "Hired": return "bg-green-100 text-green-700 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400"
        case "Rejected": return "bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-400"
        case "Under Review": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-400"
        default: return "bg-gray-100 text-gray-700"
    }
}

export function ApplicationTable({ data }: ApplicationTableProps) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="hidden md:table-cell">Applied Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((app) => (
                        <TableRow key={app.id}>
                            <TableCell className="font-medium">
                                <Link href={`/jobs/${app.jobId}`} className="hover:underline flex items-center gap-2">
                                    {app.title}
                                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-50" />
                                </Link>
                                <div className="md:hidden text-xs text-muted-foreground mt-1">
                                    {app.company}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={app.companyLogo} alt={app.company} />
                                        <AvatarFallback className="rounded-lg">{app.company.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:inline-block">{app.company}</span>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                                {new Date(app.appliedDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                })}
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className={`font-semibold ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/jobs/${app.jobId}`}>
                                    <Button variant="ghost" size="icon">
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                        <span className="sr-only">View Job</span>
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export function ApplicationsSkeleton() {
    return (
        <div className="rounded-md border bg-card p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between h-12">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-20 bg-muted animate-pulse rounded md:hidden" />
                        </div>
                    </div>
                    <div className="hidden md:block h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </div>
            ))}
        </div>
    )
}
