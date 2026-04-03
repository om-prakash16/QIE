"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Loader2, 
    Trash2, 
    ExternalLink, 
    Briefcase,
    Search,
    PlusCircle,
    Globe,
    Zap,
    TrendingUp,
    Settings2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/features/admin/admin-table"
import { AdminStatsCard } from "@/components/features/admin/admin-stats-card"
import { EditJobModal } from "@/components/features/admin/edit-job-modal"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function AdminJobsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedJobs, setSelectedJobs] = useState<string[]>([])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [jobToEdit, setJobToEdit] = useState<any | null>(null)

    const { data: jobs, isLoading, refetch } = useQuery({
        queryKey: ["adminAllJobs"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (error) throw error
            return data
        }
    })

    const filteredJobs = jobs?.filter(j => 
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        j.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelectAll = (checked: boolean) => {
        if (checked && filteredJobs) {
            setSelectedJobs(filteredJobs.map(j => j.id))
        } else {
            setSelectedJobs([])
        }
    }

    const toggleJobSelection = (jobId: string) => {
        setSelectedJobs(prev => 
            prev.includes(jobId) 
                ? prev.filter(id => id !== jobId) 
                : [...prev, jobId]
        )
    }

    const handleBulkDelete = async () => {
        if (selectedJobs.length === 0) return
        if (!confirm(`Broadcast termination protocol for ${selectedJobs.length} selected bounties?`)) return
        
        try {
            const { error } = await supabase.from('jobs').delete().in('id', selectedJobs)
            if (error) throw error
            toast.success(`${selectedJobs.length} bounty protocols terminated`)
            setSelectedJobs([])
            refetch()
        } catch (err: any) {
            toast.error(`Mass termination failed: ${err.message}`)
        }
    }

    const handleDeleteJob = async (jobId: string) => {
        if (!confirm("Remove this job posting from the platform?")) return;
        
        try {
            const { error } = await supabase.from('jobs').delete().eq('id', jobId)
            if (error) throw error
            toast.success("Job removed successfully")
            refetch()
        } catch (err: any) {
            toast.error(`Error deleting job: ${err.message}`)
        }
    }

    const toggleJobStatus = async (jobId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'closed' : 'active'
        try {
            const { error } = await supabase.from('jobs').update({ status: newStatus }).eq('id', jobId)
            if (error) throw error
            toast.success(`Job status updated to ${newStatus}`)
            refetch()
        } catch (err: any) {
            toast.error(`Error updating status: ${err.message}`)
        }
    }

    const handleEditJob = (job: any) => {
        setJobToEdit(job)
        setIsEditModalOpen(true)
    }

    if (isLoading) {
        return (
            <div className="flex h-[70vh] w-full items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
                </div>
            </div>
        )
    }

    const totalJobs = jobs?.length || 0
    const activeJobs = jobs?.filter(j => j.status === 'active').length || 0
    const newJobs24h = jobs?.filter(j => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return new Date(j.created_at) > yesterday;
    }).length || 0

    return (
        <div className="space-y-12 pb-24 max-w-[1600px] mx-auto relative">
            <EditJobModal 
                job={jobToEdit}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={refetch}
            />

            {/* Background Accent Glow */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-md shadow-lg shadow-emerald-500/5">
                            <Briefcase className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/70 mb-1">Opportunity Node</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-foreground">
                                Job Moderation
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center gap-4"
                >
                    <AnimatePresence mode="wait">
                        {selectedJobs.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
                            >
                                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">{selectedJobs.length} bounties selected</span>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleBulkDelete}
                                    className="h-8 rounded-xl hover:bg-rose-500/20 text-rose-400 font-bold px-4"
                                >
                                    Purge Protocols
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-emerald-500 transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Scan job protocols..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold placeholder:text-muted-foreground/30 shadow-2xl"
                                />
                            </div>
                        )}
                    </AnimatePresence>
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-8 h-14 shadow-2xl border-t border-white/20 font-black tracking-tight group overflow-hidden relative">
                        <PlusCircle className="w-5 h-5 mr-3" />
                        <span className="relative z-10">Broadcast Job</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Button>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AdminStatsCard 
                    title="Active Bounties" 
                    value={activeJobs} 
                    icon={Zap} 
                    trend={`+${newJobs24h} today`}
                    trendUp={true}
                    color="text-amber-400"
                    index={0}
                />
                <AdminStatsCard 
                    title="Global Velocity" 
                    value={`${totalJobs}`} 
                    icon={Globe} 
                    color="text-blue-400"
                    description="Total deployments"
                    index={1}
                />
                <AdminStatsCard 
                    title="Platform Health" 
                    value="98.2%" 
                    icon={TrendingUp} 
                    color="text-emerald-400"
                    description="Success rate"
                    index={2}
                />
            </div>

            <AdminTable 
                headers={["Protocol Title", "Origin Node", "Classification", "Operational Status", "Actions"]}
                showCheckbox
                isAllSelected={(filteredJobs?.length ?? 0) > 0 && selectedJobs.length === filteredJobs?.length}
                onSelectAll={handleSelectAll}
            >
                {filteredJobs?.map((j, i) => (
                    <AdminTableRow 
                        key={j.id} 
                        index={i}
                        showCheckbox
                        isSelected={selectedJobs.includes(j.id)}
                        onSelect={() => toggleJobSelection(j.id)}
                        onClick={() => handleEditJob(j)}
                    >
                        <AdminTableCell>
                            <div className="flex flex-col">
                                <span className="font-black text-base text-foreground/90 tracking-tight group-hover/row:text-emerald-400 transition-colors uppercase">{j.title}</span>
                                <span className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.1em]">{j.location}</span>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell className="text-muted-foreground font-bold tracking-tight opacity-70 group-hover/row:opacity-100 transition-opacity">
                            {j.company_name}
                        </AdminTableCell>
                        <AdminTableCell>
                            <Badge variant="outline" className="rounded-xl px-4 py-1.5 border border-white/5 bg-white/5 text-muted-foreground font-black text-[10px] uppercase tracking-widest group-hover/row:border-emerald-500/20 group-hover/row:text-emerald-400 transition-all">
                                {j.job_type || 'Contract'}
                            </Badge>
                        </AdminTableCell>
                        <AdminTableCell>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleJobStatus(j.id, j.status);
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all shadow-lg",
                                    j.status === 'active' 
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                                )}
                            >
                                <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", j.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400')} />
                                {j.status}
                            </button>
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                            <div className="flex justify-end gap-3">
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={(e) => { e.stopPropagation(); handleEditJob(j); }}
                                    className="h-10 w-10 rounded-xl hover:bg-emerald-500/10 border border-white/5 group/btn"
                                >
                                    <Settings2 className="w-4 h-4 text-muted-foreground group-hover/btn:text-emerald-500" />
                                </Button>
                                <Button size="icon" variant="ghost" asChild className="h-10 w-10 rounded-xl hover:bg-white/5 border border-white/5">
                                    <Link href={`/jobs/${j.id}`} onClick={(e) => e.stopPropagation()}>
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteJob(j.id);
                                    }}
                                    className="h-10 w-10 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/20 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
            </AdminTable>
        </div>
    )
}
