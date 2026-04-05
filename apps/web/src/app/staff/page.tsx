"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Users, Briefcase, FileWarning, MessageSquare, AlertCircle } from "lucide-react"
import { AdminStatsCard } from "@/features/admin/admin-stats-card"
import { AdminCharts } from "@/features/admin/admin-charts"

export default function StaffDashboard() {
    return (
        <div className="space-y-12 pb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 mb-3">Operational Command</p>
                    <h1 className="text-6xl font-black font-heading tracking-tighter text-white leading-[0.9]">
                        Staff <span className="text-primary italic">Overview</span>
                    </h1>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-white/60 tracking-tight">System Status: Optimal</span>
                </motion.div>
            </header>

            {/* Operational Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatsCard 
                    title="Open Reports" 
                    value="12" 
                    icon={FileWarning} 
                    trend="+3 new" 
                    trendUp={false}
                    description="User & Job reports pending review"
                />
                <AdminStatsCard 
                    title="Active Tickets" 
                    value="48" 
                    icon={MessageSquare} 
                    trend="8 resolution avg" 
                    trendUp={true}
                    description="Customer support requests"
                />
                <AdminStatsCard 
                    title="Flagged Skills" 
                    value="5" 
                    icon={AlertCircle} 
                    trend="-2 today" 
                    trendUp={true}
                    description="NFT authenticity checks"
                />
                <AdminStatsCard 
                    title="Active Users" 
                    value="1.2k" 
                    icon={Users} 
                    trend="+12% growth" 
                    trendUp={true}
                    description="Total verified professionals"
                />
            </div>

            {/* Activity Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AdminCharts />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldCheck className="w-24 h-24 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-primary" />
                        Urgent Tasks
                    </h3>
                    <div className="space-y-4">
                        {[
                            { title: "Review Report #892", type: "Security", time: "12m ago" },
                            { title: "Resolve Ticket #102", type: "Support", time: "45m ago" },
                            { title: "Flagged NFT: Python Expert", type: "Verification", time: "1h ago" },
                            { title: "Suspicious Job Post detected", type: "Moderation", time: "3h ago" }
                        ].map((task, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-black uppercase text-primary/80 tracking-widest">{task.type}</span>
                                    <span className="text-[10px] text-white/30 font-bold">{task.time}</span>
                                </div>
                                <p className="text-sm font-bold group-hover:text-primary transition-colors">{task.title}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
