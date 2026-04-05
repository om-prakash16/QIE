"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Bookmark, FileText, TrendingUp } from "lucide-react"

import Link from "next/link"

export default function UserDashboard() {
    const stats = [
        { label: "Applied Jobs", value: 12, icon: Briefcase, href: "/user/applications" },
        { label: "Saved Jobs", value: 5, icon: Bookmark, href: "/user/saved" },
        { label: "Interviews", value: 2, icon: TrendingUp, href: "/user/applications" },
        { label: "Profile Views", value: 45, icon: FileText, href: "/user/profile" },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, here is your daily overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Link key={i} href={stat.href} className="block transition-transform hover:scale-[1.02]">
                        <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.label}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Recent Activity / Recommended Jobs could go here */}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">You haven't applied to any jobs recently.</p>
                        <Link href="/jobs">
                            <Button variant="link" className="px-0">Find Jobs</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Profile Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-8">
                            <div className="relative w-32 h-32 rounded-full border-4 border-muted flex items-center justify-center">
                                <span className="text-2xl font-bold">80%</span>
                                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary border-t-transparent rotate-45" />
                            </div>
                        </div>
                        <p className="text-center text-sm text-muted-foreground">Add your GitHub to reach 100%</p>
                        <Link href="/user/profile">
                            <Button className="w-full mt-4" variant="outline">Update Profile</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
