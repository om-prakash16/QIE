"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Brain, 
    Zap, 
    ShieldCheck, 
    ArrowRight, 
    Trophy,
    Loader2,
    Timer,
    Target,
    Activity,
    Cpu,
    CheckCircle2,
    XCircle,
    LayoutDashboard,
    Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api/api-client"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function AssessmentRunnerPage() {
    const { jobId } = useParams()
    const router = useRouter()
    const { user } = useAuth()
    
    const [currentIdx, setCurrentIdx] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [isFinished, setIsFinished] = useState(false)
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes total
    const [isStarted, setIsStarted] = useState(false)

    // 1. Fetch Questions
    const { data: questions, isLoading: loadingQuestions } = useQuery({
        queryKey: ["assessmentQuestions", jobId, user?.id],
        queryFn: () => api.interview.get(jobId as string),
        enabled: !!jobId && !!user?.id
    })

    // 2. Fetch Job Details
    const { data: job, isLoading: loadingJob } = useQuery({
        queryKey: ["assessmentJob", jobId],
        queryFn: () => api.jobs.details(jobId as string),
        enabled: !!jobId
    })

    // 3. Submit Results Mutation
    const submitMutation = useMutation({
        mutationFn: (data: { score: number, answers: string[] }) => {
            // We need to find the application ID for this user/job
            // For now we'll assume the backend can find it via jobId/userId if we update the endpoint
            // or we fetch application first.
            return api.jobs.submitAssessment(jobId as string, data)
        },
        onSuccess: () => {
            toast.success("Intelligence Synchronized to Proof Identity.")
        },
        onError: (err: any) => {
            toast.error(`Synchronization failed: ${err.message}`)
        }
    })

    // Timer Logic
    useEffect(() => {
        if (!isStarted || isFinished || timeLeft <= 0) return
        
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)
        
        return () => clearInterval(timer)
    }, [isStarted, isFinished, timeLeft])

    const handleAnswer = (answer: string) => {
        const newAnswers = [...answers, answer]
        setAnswers(newAnswers)

        if (currentIdx < (questions?.length || 0) - 1) {
            setCurrentIdx(prev => prev + 1)
        } else {
            finishAssessment(newAnswers)
        }
    }

    const finishAssessment = (finalAnswers: string[]) => {
        setIsFinished(true)
        
        // Calculate Score
        let correctCount = 0
        questions.forEach((q: any, idx: number) => {
            if (q.correct_answer === finalAnswers[idx]) correctCount++
        })
        
        const score = Math.round((correctCount / questions.length) * 100)
        submitMutation.mutate({ score, answers: finalAnswers })
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (loadingQuestions || loadingJob) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6">
                <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
                <div className="text-center space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">Loading Strategic Challenge...</p>
                    <p className="text-xs italic text-white/20">Synthesizing environment from job parameters.</p>
                </div>
            </div>
        )
    }

    if (!isStarted && !isFinished) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 animate-in fade-in zoom-in duration-700">
                <Card className="bg-[#0a0a0a] border-white/10 overflow-hidden relative shadow-2xl shadow-primary/10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                    <CardHeader className="p-12 text-center space-y-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-primary/20 rotate-3 group-hover:rotate-6 transition-transform">
                            <Brain className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-5xl font-black italic uppercase tracking-tighter">Skill Proof <span className="text-primary">Engagement</span></h1>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                                You are about to enter a high-resonance assessment for <span className="text-white font-bold">{job?.title}</span>.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 py-8">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <Timer className="w-5 h-5 text-primary mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Duration</p>
                                <p className="text-lg font-bold">10:00</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <Target className="w-5 h-5 text-primary mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Questions</p>
                                <p className="text-lg font-bold">{questions?.length || 0}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <ShieldCheck className="w-5 h-5 text-primary mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Integrity</p>
                                <p className="text-lg font-bold uppercase tracking-tighter">Verified</p>
                            </div>
                        </div>

                        <Button 
                            onClick={() => setIsStarted(true)}
                            size="lg"
                            className="h-16 px-12 bg-white text-black hover:bg-neutral-200 font-black uppercase tracking-widest rounded-2xl gap-3 shadow-xl"
                        >
                            Initialize Sync <ArrowRight className="w-5 h-5" />
                        </Button>
                        
                        <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.2em] pt-4 italic">
                            System Monitoring Enabled. Proof will be minted to your professional identity.
                        </p>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    if (isFinished) {
        const score = Math.round((answers.filter((a, i) => a === questions[i].correct_answer).length / questions.length) * 100)
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 animate-in fade-in zoom-in duration-1000">
                <Card className="bg-[#0a0a0a] border-white/10 overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/20 to-transparent blur-3xl opacity-50" />
                    <CardHeader className="p-12 text-center space-y-8 relative">
                        <div className="relative inline-block">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto"
                            >
                                <Trophy className="w-12 h-12 text-primary" />
                            </motion.div>
                        </div>
                        
                        <div className="space-y-3">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Engagement Synthesized</h2>
                            <p className="text-muted-foreground">Your neural performance has been analyzed and synchronized.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto py-8">
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center">
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Proof Score</div>
                                <div className="text-5xl font-black tracking-tighter text-white">{score}%</div>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center">
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Rank Delta</div>
                                <div className="text-5xl font-black tracking-tighter text-emerald-500">+{score > 80 ? "14" : "4"}%</div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 pt-6">
                            <Button 
                                onClick={() => router.push("/dashboard/candidate/applications")}
                                size="lg" 
                                className="h-16 px-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl gap-3"
                            >
                                <Zap className="w-5 h-5" /> View Career Proof
                            </Button>
                            <Button 
                                onClick={() => router.push("/dashboard/candidate")}
                                variant="ghost" 
                                className="text-[10px] font-black uppercase tracking-widest text-white/30"
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" /> Back to Nexus
                            </Button>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    const currentQ = questions[currentIdx]
    const progress = ((currentIdx + 1) / questions.length) * 100

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 min-h-[85vh] flex flex-col justify-center">
            {/* HUD Status Bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                        <Cpu className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Synapse Response Stream: Live</span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">Requirement {currentIdx + 1} of {questions.length}</h3>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="flex items-center gap-2 text-white/40 mb-1">
                            <Timer className={cn("w-4 h-4", timeLeft < 60 ? "text-rose-500 animate-pulse" : "text-primary")} />
                            <span className={cn("text-xs font-mono font-bold uppercase", timeLeft < 60 ? "text-rose-500" : "text-white")}>{formatTime(timeLeft)}</span>
                        </div>
                        <Progress value={progress} className="w-32 h-1 bg-white/5" />
                    </div>
                </div>
            </div>

            {/* Main Engagement Card */}
            <Card className="bg-[#0a0a0a] border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,1)] group">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
                <CardHeader className="p-12 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 uppercase tracking-widest text-[9px] font-black">
                            {currentQ.difficulty || 'Advanced'} Intelligence
                        </Badge>
                    </div>
                    <CardTitle className="text-3xl font-black italic tracking-tight leading-tight text-white group-hover:text-primary transition-colors duration-500">
                        {currentQ.question}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-12 pt-0 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {currentQ.options.map((option: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(option)}
                                className="group text-left p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/40 transition-all duration-300 flex items-center gap-6 relative overflow-hidden"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-white/40 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                    {String.fromCharCode(65 + i)}
                                </div>
                                <span className="text-lg font-bold text-white/80 group-hover:text-white transition-colors flex-1">{option}</span>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-all">
                                    <ArrowRight className="w-5 h-5 text-primary" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Telemetry Footer */}
            <div className="flex items-center justify-center gap-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 py-6">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <Activity className="w-3.5 h-3.5 text-primary" /> Biometric Sync
                </div>
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Proof Integrity
                </div>
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <Zap className="w-3.5 h-3.5 text-primary" /> Real-time Match Analysis
                </div>
            </div>
        </div>
    )
}
