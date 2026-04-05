"use client"

import { useState, useEffect } from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { Loader2, Briefcase, Globe, Info, Zap } from "lucide-react"

interface EditJobModalProps {
    job: any | null
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function EditJobModal({ job, isOpen, onClose, onSuccess }: EditJobModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        company_name: "",
        location: "",
        job_type: "",
        status: ""
    })

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title || "",
                company_name: job.company_name || "",
                location: job.location || "Remote",
                job_type: job.job_type || "Contract",
                status: job.status || "active"
            })
        }
    }, [job])

    const handleSave = async () => {
        if (!job) return
        setIsLoading(true)
        
        try {
            const { error } = await supabase
                .from('jobs')
                .update({
                    title: formData.title,
                    company_name: formData.company_name,
                    location: formData.location,
                    job_type: formData.job_type,
                    status: formData.status
                })
                .eq('id', job.id)

            if (error) throw error
            
            toast.success("Job protocol updated and broadcasted.")
            onSuccess()
            onClose()
        } catch (err: any) {
            toast.error(`Update signal failed: ${err.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#050505]/90 backdrop-blur-3xl border-emerald-500/10 rounded-[2.5rem] max-w-lg shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-50" />
                
                <DialogHeader className="pt-6 px-8 text-left">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <Briefcase className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black font-heading tracking-tight text-foreground">
                                Bounty Reconfiguration
                            </DialogTitle>
                            <DialogDescription className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500/50">
                                Manual Metadata Adjustment
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-8 py-8 px-8 border-y border-white/5 bg-white/[0.01]">
                    <div className="grid gap-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Protocol Title</Label>
                            <div className="relative group">
                                <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-emerald-500 transition-colors" />
                                <Input 
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-background/40 border-white/5 rounded-2xl pl-12 h-14 font-bold focus:ring-emerald-500/20 transition-all"
                                    placeholder="Enter bounty title..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Origin Node</Label>
                                <Input 
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                    className="bg-background/40 border-white/5 rounded-2xl h-14 font-bold focus:ring-emerald-500/20"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Locale Zone</Label>
                                <div className="relative group">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/40" />
                                    <Input 
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="bg-background/40 border-white/5 rounded-2xl pl-10 h-14 font-bold focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Classification</Label>
                                <Select 
                                    value={formData.job_type} 
                                    onValueChange={(val) => setFormData({ ...formData, job_type: val })}
                                >
                                    <SelectTrigger className="bg-background/40 border-white/5 rounded-2xl h-14 font-bold focus:ring-emerald-500/20 transition-all">
                                        <SelectValue placeholder="Select Protocol" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 rounded-2xl">
                                        <SelectItem value="Full-time" className="font-bold">Full-time</SelectItem>
                                        <SelectItem value="Contract" className="font-bold">Contract</SelectItem>
                                        <SelectItem value="Freelance" className="font-bold">Freelance</SelectItem>
                                        <SelectItem value="Internship" className="font-bold">Internship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Network Status</Label>
                                <Select 
                                    value={formData.status} 
                                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger className="bg-background/40 border-white/5 rounded-2xl h-14 font-bold focus:ring-emerald-500/20 transition-all">
                                        <SelectValue placeholder="Select State" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 rounded-2xl">
                                        <SelectItem value="active" className="font-bold text-emerald-400">Broadcast (Active)</SelectItem>
                                        <SelectItem value="closed" className="font-bold text-rose-400">Terminated (Closed)</SelectItem>
                                        <SelectItem value="flagged" className="font-bold text-amber-400">Restricted (Flagged)</SelectItem>
                                        <SelectItem value="draft" className="font-bold text-blue-400">Simulation (Draft)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-8 py-6 bg-emerald-500/[0.02]">
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] hover:bg-white/5"
                    >
                        Abort
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl h-14 px-10 border-t border-white/20 shadow-2xl font-black uppercase tracking-widest text-[10px] group overflow-hidden relative"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Zap className="w-4 h-4 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                        )}
                        <span className="relative z-10">{isLoading ? "Modulating..." : "Confirm Protocol"}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
