"use client"

import { motion, AnimatePresence } from "framer-motion"
import { 
    CheckCircle2, 
    Zap, 
    ArrowRight, 
    Brain, 
    ShieldCheck, 
    Sparkles, 
    X,
    Trophy,
    LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface ApplySuccessModalProps {
    isOpen: boolean
    onClose: () => void
    matchScore: number
    jobTitle: string
    jobId: string
    hasCustomQuestions: boolean
}

export function ApplySuccessModal({ isOpen, onClose, matchScore, jobTitle, jobId, hasCustomQuestions }: ApplySuccessModalProps) {
    const router = useRouter()

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-primary/20 to-transparent blur-3xl opacity-50" />
                        
                        <div className="relative p-10 text-center space-y-8">
                            {/* Success Icon */}
                            <div className="relative inline-block">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                                    className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                </motion.div>
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-4 border-2 border-dashed border-emerald-500/10 rounded-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Mission Executed</h2>
                                <p className="text-muted-foreground text-sm max-w-sm mx-auto font-medium">Your application for <span className="text-white font-bold">{jobTitle}</span> has been secured and match-scored.</p>
                            </div>

                            {/* Analysis Card */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Pulse Score</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                        <span className="text-3xl font-black tracking-tighter">{matchScore}%</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Proof Status</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-primary fill-primary/20" />
                                        <span className="text-[10px] font-black tracking-widest uppercase">Minted</span>
                                    </div>
                                </div>
                            </div>

                            {/* Assessment Prompt */}
                            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 space-y-4">
                                <div className="flex items-center justify-center gap-3">
                                    <Brain className="w-5 h-5 text-primary" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-primary">Assessment Ready</h3>
                                </div>
                                <p className="text-xs text-muted-foreground">Verify your expertise now to jump to the top of the recruiter's proof ranking.</p>
                                <Button 
                                    onClick={() => router.push(`/dashboard/assessments/${jobId}`)}
                                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] rounded-2xl gap-2 shadow-xl shadow-primary/20"
                                >
                                    Start Skill Quiz <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex items-center justify-center gap-6 pt-2">
                                <Button 
                                    variant="ghost" 
                                    onClick={onClose}
                                    className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white"
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                                </Button>
                            </div>
                        </div>

                        {/* Top Right Close */}
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors"
                        >
                            <X className="w-4 h-4 text-white/40" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
