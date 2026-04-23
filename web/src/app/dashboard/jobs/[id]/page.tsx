"use client"

import { useQuery, useMutation } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
    MapPin, 
    DollarSign, 
    Briefcase, 
    Clock, 
    Shield, 
    ArrowLeft, 
    Send, 
    Sparkles, 
    Loader2, 
    CheckCircle2, 
    ShieldCheck, 
    Brain,
    Lock,
    ExternalLink,
    Zap,
    Info
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api/api-client"
import { ApplySuccessModal } from "@/components/jobs/apply-success-modal"

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string
    
    const [isMinting, setIsMinting] = useState(false)
    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [appResult, setAppResult] = useState<any>(null)

    const { data: job, isLoading } = useQuery({
        queryKey: ["job", id],
        queryFn: () => api.jobs.details(id),
        enabled: !!id
    })

    const applyMutation = useMutation({
        mutationFn: (jobId: string) => api.jobs.apply(jobId),
        onSuccess: (data) => {
            setAppResult(data)
            setIsMinting(true)
            setTimeout(() => {
                setIsMinting(false)
                setIsSuccessOpen(true)
            }, 3000)
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to submit application.")
        }
    })

    if (isLoading) {
        return (
            <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20">Decrypting Job Data...</p>
            </div>
        )
    }

    if (!job) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <p>Opportunity not found in verify stream.</p>
                <Link href="/dashboard/candidate/jobs">
                    <Button variant="outline" className="mt-4">Back to Job Board</Button>
                </Link>
            </div>
        )
    }

    const handleApply = () => {
        applyMutation.mutate(id)
    }

    const matchScore = job.ai_match_percentage || 0

    return (
        <div className="space-y-8 max-w-4xl relative pb-20">
            <AnimatePresence>
                {isMinting && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="relative mb-8">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="w-32 h-32 rounded-full border-t-2 border-primary border-r-2 border-primary/20"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ShieldCheck className="w-12 h-12 text-primary animate-pulse" />
                            </div>
                            <div className="absolute -top-2 -right-2">
                                <Sparkles className="w-6 h-6 text-amber-500 animate-bounce" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Minting Proof Record</h2>
                        <p className="text-muted-foreground text-sm max-w-xs mb-8">Securing your verified skill credentials to the Solana blockchain for tamper-proof application status.</p>
                        <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-primary/40">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Establishing Trust Layer...
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back Link */}
            <Link href="/dashboard/candidate/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Back to Job board
            </Link>

            {/* Job Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Brain className="w-32 h-32" />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] uppercase font-black tracking-widest">Active Opportunity</Badge>
                            <span className="text-white/20">|</span>
                            <span className="text-xs text-muted-foreground font-medium italic">{job.companies?.name || "Verified Recruiters"}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase italic">{job.title}</h1>
                        <div className="flex items-center gap-5 text-xs text-muted-foreground font-medium italic flex-wrap">
                            <span className="flex items-center gap-2 text-white/50"><Briefcase className="w-4 h-4" />{job.companies?.name || "Global Tech"}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{job.location || "Remote"}</span>
                            <span className="flex items-center gap-2 text-primary/80"><DollarSign className="w-4 h-4" />{job.salary_range || "Competitive"}</span>
                            <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase opacity-40">{job.job_type}</Badge>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className={cn(
                            "w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center font-black shrink-0 border relative overflow-hidden group",
                            matchScore >= 90 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-xl shadow-emerald-500/5" :
                            matchScore >= 80 ? "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-xl shadow-blue-500/5" :
                            "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-xl shadow-amber-500/5"
                        )}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-3xl tracking-tighter relative z-10">{matchScore}%</span>
                            <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-60 relative z-10">Pulse</span>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleApply}
                    disabled={applyMutation.isPending || isMinting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black rounded-2xl h-16 text-lg uppercase tracking-[0.2em] gap-3 shadow-2xl shadow-primary/20 group/btn"
                >
                    {applyMutation.isPending ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <Zap className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                            Execute Application
                        </>
                    )}
                </Button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Description */}
                    <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
                            <Info className="w-3 h-3" /> Mission Context
                        </h2>
                        <div className="prose prose-invert prose-sm max-w-none">
                            <p className="text-sm leading-relaxed text-white/80 font-medium">{job.description}</p>
                        </div>
                    </div>

                    {/* Skill Analysis */}
                    <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-3">
                                <Brain className="w-3 h-3" /> Skill Resonance
                            </h2>
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {job.skills_required?.map((skill: string) => (
                                <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 border-white/5"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Recruiter Assessment */}
                    {job.assessment_questions?.length > 0 && (
                        <div className="p-6 rounded-3xl border border-primary/20 bg-primary/[0.02] space-y-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                <Zap className="w-3 h-3" /> Assessment Required
                            </h2>
                            <p className="text-xs text-muted-foreground font-medium">This recruiter has added {job.assessment_questions.length} custom challenges to verify your proficiency.</p>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                                <Lock className="w-4 h-4 text-white/20" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Locked until apply</span>
                            </div>
                        </div>
                    )}

                    {/* Trust Sidebar */}
                    <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Hiring Signal</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-white/40">Transparency</span>
                                <span className="text-emerald-500">Full</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: "100%" }} 
                                    className="h-full bg-emerald-500" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ApplySuccessModal 
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                jobTitle={appResult?.job_title || job.title}
                jobId={id}
                matchScore={appResult?.match_score || 0}
                hasCustomQuestions={appResult?.has_custom_assessment || false}
            />
        </div>
    )
}
