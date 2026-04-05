"use client"

import { motion } from "framer-motion"
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, Trash2, Filter } from "lucide-react"

const mockReports = [
    { id: "REP-901", target: "Job: Lead Rust Engineer", reason: "Potential Scam", reporter: "0x71...3e2", status: "Open", priority: "High" },
    { id: "REP-902", target: "User: CryptoGuru", reason: "Fake Skills", reporter: "0x12...9a1", status: "In Review", priority: "Normal" },
    { id: "REP-903", target: "Project: NFT Marketplace", reason: "Plagiarized", reporter: "0x88...bc4", status: "Open", priority: "Critical" },
    { id: "REP-904", target: "User: Bot123", reason: "Spam Activity", reporter: "0x44...ff1", status: "Resolved", priority: "Low" },
]

export default function StaffReportCenter() {
    return (
        <div className="space-y-12 pb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 backdrop-blur-md shadow-lg shadow-orange-500/5">
                            <ShieldAlert className="w-6 h-6 text-orange-400" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400/70 mb-1">Resolution Center</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-white">
                                Report Management
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
                        {["All", "User", "Job"].map((tab) => (
                            <button 
                                key={tab}
                                className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${tab === "All" ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-white/40 hover:text-white/70"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {mockReports.map((report, i) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-white/5 border border-white/5 hover:border-white/10 p-6 rounded-[2rem] backdrop-blur-md transition-all flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                                report.priority === "Critical" ? "bg-red-500/20 text-red-400 shadow-red-500/10" :
                                report.priority === "High" ? "bg-orange-500/20 text-orange-400 shadow-orange-500/10" :
                                "bg-blue-500/20 text-blue-400 shadow-blue-500/10"
                            }`}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{report.id}</span>
                                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                                        report.status === "Open" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                        report.status === "In Review" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    }`}>
                                        {report.status}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{report.target}</h4>
                                <p className="text-sm text-white/40 font-medium">Reason: {report.reason} • Reporter: {report.reporter}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                            <button className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10">
                                Review Details
                            </button>
                            <button className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 hover:bg-red-500/20 transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
