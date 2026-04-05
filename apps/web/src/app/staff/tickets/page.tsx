"use client"

import { motion } from "framer-motion"
import { MessageSquare, Clock, CheckCircle2, User, ChevronRight, Filter, Search } from "lucide-react"

const mockTickets = [
    { id: "TK-1001", user: "0x12...abc", subject: "Wallet connection failing on mobile", category: "Technical", status: "Open", priority: "High", time: "2h ago" },
    { id: "TK-1002", user: "0x44...efg", subject: "Skill NFT not showing in dashboard", category: "Sync", status: "In Progress", priority: "Normal", time: "5h ago" },
    { id: "TK-1003", user: "0x98...zyx", subject: "Profile verification taking too long", category: "Verification", status: "Open", priority: "Urgent", time: "1h ago" },
    { id: "TK-1004", user: "0x33...lmn", subject: "Change company name request", category: "Profile", status: "Resolved", priority: "Low", time: "1d ago" },
]

export default function StaffSupportTickets() {
    return (
        <div className="space-y-12 pb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 backdrop-blur-md shadow-lg shadow-blue-500/5">
                            <MessageSquare className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400/70 mb-1">Operational Support</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-white">
                                Support Tickets
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input 
                            type="text" 
                            placeholder="Search tickets..." 
                            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-[240px]"
                        />
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {mockTickets.map((ticket, i) => (
                    <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative bg-white/5 border border-white/5 hover:border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl transition-all cursor-pointer overflow-hidden"
                    >
                        {/* Status Accent */}
                        <div className={`absolute top-0 left-0 w-2 h-full ${
                            ticket.priority === "Urgent" ? "bg-red-500" :
                            ticket.priority === "High" ? "bg-orange-500" :
                            "bg-blue-500"
                        }`} />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex flex-col gap-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{ticket.id}</span>
                                    <div className="h-4 w-px bg-white/10" />
                                    <span className="text-xs font-bold text-primary italic uppercase tracking-widest">{ticket.category}</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{ticket.time}</span>
                                </div>
                                <h3 className="text-2xl font-black font-heading tracking-tight text-white/90 group-hover:text-primary transition-colors">
                                    {ticket.subject}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                        <User className="w-3.5 h-3.5 text-white/40" />
                                        <span className="text-xs font-bold text-white/60 tracking-tight">{ticket.user}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                        <div className={`w-2 h-2 rounded-full ${
                                            ticket.status === "Open" ? "bg-red-500" :
                                            ticket.status === "In Progress" ? "bg-orange-500" :
                                            "bg-emerald-500"
                                        }`} />
                                        <span className="text-xs font-bold text-white/60 tracking-tight uppercase">{ticket.status}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="flex items-center justify-center gap-4 px-10 py-5 bg-white/5 border border-white/5 group-hover:bg-primary group-hover:border-primary group-hover:text-black rounded-3xl transition-all duration-500 min-w-[200px]">
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Enter Case</span>
                                <ChevronRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
