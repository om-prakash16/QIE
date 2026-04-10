"use client"

import { useState } from "react"
import { Users, Briefcase, Flag, Ticket, Shield, TrendingUp, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

const mockStats = [
    { label: "Open Reports",     value: 12,  icon: Flag,        color: "text-red-400",    bg: "bg-red-500/10",    href: "/staff/reports" },
    { label: "Active Tickets",   value: 28,  icon: Ticket,      color: "text-yellow-400", bg: "bg-yellow-500/10", href: "/staff/tickets" },
    { label: "Users Flagged",    value: 5,   icon: Users,       color: "text-orange-400", bg: "bg-orange-500/10", href: "/staff/users" },
    { label: "NFT Flags",        value: 3,   icon: Shield,      color: "text-violet-400", bg: "bg-violet-500/10", href: "/staff/nft-monitor" },
    { label: "Jobs Pending",     value: 7,   icon: Briefcase,   color: "text-blue-400",   bg: "bg-blue-500/10",   href: "/staff/jobs" },
    { label: "Resolved Today",   value: 19,  icon: CheckCircle2,color: "text-green-400",  bg: "bg-green-500/10",  href: "/staff/reports" },
]

const mockActivity = [
    { id: 1, action: "flagged suspicious profile",      user: "mod_anita",  target: "0xabc...123", time: "2m ago",  type: "flag" },
    { id: 2, action: "resolved support ticket #284",    user: "sup_rahul",  target: "Ticket",      time: "8m ago",  type: "resolve" },
    { id: 3, action: "approved skill NFT",              user: "ver_priya",  target: "React NFT",   time: "21m ago", type: "approve" },
    { id: 4, action: "flagged spam job posting",        user: "mod_anita",  target: "Job #592",    time: "1h ago",  type: "flag" },
    { id: 5, action: "requested skill re-verification", user: "ver_priya",  target: "Python NFT",  time: "3h ago",  type: "retest" },
]

const priorityQueue = [
    { id: 1, type: "User Report",  priority: "critical", subject: "Fake profile with cloned GitHub",   age: "12h" },
    { id: 2, type: "Job Report",   priority: "high",     subject: "Spam job by unverified company",   age: "3h" },
    { id: 3, type: "Support",      priority: "urgent",   subject: "Wallet stuck — can't apply to jobs", age: "45m" },
]

const priorityColors: Record<string, string> = {
    critical: "text-red-400 bg-red-500/10 border-red-500/30",
    high:     "text-orange-400 bg-orange-500/10 border-orange-500/30",
    urgent:   "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
}

export default function StaffDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Operations Dashboard</h1>
                <p className="text-slate-400 mt-1">Your daily moderation overview — Best Hiring Tool Staff Panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {mockStats.map((stat) => (
                    <Link key={stat.label} href={stat.href}
                        className="rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-violet-600/50 transition-all group">
                        <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">{stat.value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                    </Link>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Priority Queue */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <h2 className="font-semibold text-white">Priority Queue</h2>
                    </div>
                    <div className="space-y-3">
                        {priorityQueue.map((item) => (
                            <div key={item.id}
                                className={`flex items-start justify-between p-3 rounded-lg border ${priorityColors[item.priority]}`}>
                                <div>
                                    <p className="text-sm font-medium text-white">{item.subject}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.type} · {item.age} ago</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${priorityColors[item.priority]}`}>
                                    {item.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <h2 className="font-semibold text-white">Recent Activity</h2>
                    </div>
                    <div className="space-y-3">
                        {mockActivity.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
                                <Clock className="w-3 h-3 text-slate-600 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-300 truncate">
                                        <span className="text-violet-400 font-medium">{item.user}</span>
                                        {" "}{item.action}
                                    </p>
                                    <p className="text-xs text-slate-600">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
