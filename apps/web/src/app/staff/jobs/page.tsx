"use client"

import { motion } from "framer-motion"
import { Briefcase, Search, Filter, CheckCircle2, XCircle, AlertCircle, ExternalLink, Building2, MapPin, Clock } from "lucide-react"

const mockJobs = [
    { id: "JOB-401", title: "Senior Rust Engineer", company: "Solana Labs", location: "Remote", status: "Pending Approval", type: "Full-time", posted: "2h ago" },
    { id: "JOB-402", title: "Frontend Lead (Next.js)", company: "Magic Eden", location: "Berlin, DE", status: "Active", type: "Contract", posted: "5h ago" },
    { id: "JOB-403", title: "Smart Contract Auditor", company: "CertiK", location: "New York, US", status: "Flagged", type: "Full-time", posted: "1d ago" },
    { id: "JOB-404", title: "Marketing Director", company: "Phantom", location: "San Francisco, US", status: "Active", type: "Full-time", posted: "2d ago" },
]

export default function StaffJobsModeration() {
    return (
        <div className="space-y-12 pb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-md shadow-lg shadow-emerald-500/5">
                            <Briefcase className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400/70 mb-1">Marketplace Integrity</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-white">
                                Jobs Moderation
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input 
                            type="text" 
                            placeholder="Search jobs..." 
                            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-[240px]"
                        />
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {mockJobs.map((job, i) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-white/5 border border-white/5 hover:border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md transition-all relative overflow-hidden"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{job.id}</span>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                                        job.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                        job.status === 'Flagged' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                    }`}>
                                        {job.status}
                                    </div>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        {job.posted}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black font-heading tracking-tight text-white group-hover:text-primary transition-colors flex items-center gap-3">
                                        {job.title}
                                        <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-primary/50" />
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-6 mt-2">
                                        <div className="flex items-center gap-2 text-white/60 font-medium">
                                            <Building2 className="w-4 h-4 text-primary/50" />
                                            <span className="text-sm">{job.company}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/60 font-medium">
                                            <MapPin className="w-4 h-4 text-primary/50" />
                                            <span className="text-sm">{job.location}</span>
                                        </div>
                                        <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold uppercase text-white/40 letter-spacing-1">
                                            {job.type}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center flex-wrap gap-3 shrink-0">
                                {job.status === 'Pending Approval' && (
                                    <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl hover:bg-emerald-500/30 transition-all text-xs font-black uppercase tracking-widest">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Approve
                                    </button>
                                )}
                                {job.status !== 'Flagged' && (
                                    <button className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl hover:bg-red-500/20 transition-all text-xs font-black uppercase tracking-widest">
                                        <AlertCircle className="w-4 h-4" />
                                        Flag
                                    </button>
                                )}
                                <button className="p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl transition-all">
                                    <XCircle className="w-5 h-5 text-white/40 hover:text-red-400" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
