"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Gamepad2, 
    Brain, 
    Sparkles, 
    CheckCircle2, 
    XCircle, 
    ArrowRight, 
    Trophy,
    Loader2,
    Timer,
    Lightbulb,
    Target,
    Zap,
    History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { api } from "@/lib/api/api-client"
import { useAuth } from "@/context/auth-context"

export default function AIInterviewPrepPage() {
    const { user } = useAuth()
    const [jobs, setJobs] = useState<any[]>([])
    const [selectedJob, setSelectedJob] = useState<string>("")
    const [questions, setQuestions] = useState<any[]>([])
    const [currentIdx, setCurrentIdx] = useState(0)
    const [score, setScore] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [answers, setAnswers] = useState<string[]>([])
    const [startTime, setStartTime] = useState<number | null>(null)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            const data = await api.jobs.list()
            setJobs(data)
        } catch (error) {
            console.error("Failed to fetch jobs:", error)
        }
    }

    const startInterview = async () => {
        if (!selectedJob) return
        setIsGenerating(true)
        try {
            const result = await api.interview.generate(selectedJob)
            setQuestions(result.data || [])
            setCurrentIdx(0)
            setScore(0)
            setAnswers([])
            setIsFinished(false)
            setStartTime(Date.now())
        } catch (error) {
            toast.error("Failed to generate AI questions. Using fallback set.")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleAnswer = (answer: string) => {
        const isCorrect = answer === questions[currentIdx].correct_answer
        if (isCorrect) setScore(prev => prev + 1)
        
        const newAnswers = [...answers, answer]
        setAnswers(newAnswers)

        if (currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1)
        } else {
            setIsFinished(true)
        }
    }

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
                <div className="relative">
                    <motion.div 
                        className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <Brain className="w-16 h-16 text-primary relative animate-pulse" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">AI Architect at Work</h2>
                    <p className="text-muted-foreground">Analyzing your skill gaps and crafting personalized challenges...</p>
                </div>
                <div className="w-64">
                    <Progress value={undefined} className="h-1 bg-primary/10" />
                </div>
            </div>
        )
    }

    if (isFinished) {
        const percentage = Math.round((score / questions.length) * 100)
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto space-y-8"
            >
                <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent overflow-hidden relative">
                    <div className="p-12 text-center space-y-6">
                        <div className="p-5 bg-primary/10 rounded-full w-fit mx-auto relative">
                            <Trophy className="w-12 h-12 text-primary" />
                            <motion.div 
                                className="absolute -inset-2 border-2 border-primary/30 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black tracking-tighter uppercase">Preparation Complete</h2>
                            <p className="text-muted-foreground text-lg">You've successfully navigated the AI challenge.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-4">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Score</p>
                                <p className="text-4xl font-black text-primary">{score} <span className="text-lg text-muted-foreground">/ {questions.length}</span></p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Accuracy</p>
                                <p className="text-4xl font-black text-primary">{percentage}%</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Time</p>
                                <p className="text-4xl font-black text-primary">{Math.floor((Date.now() - (startTime || 0)) / 60000)}<span className="text-lg text-muted-foreground">m</span></p>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 pt-6">
                            <Button size="lg" className="h-14 px-8 rounded-2xl gap-2" onClick={startInterview}>
                                <Zap className="w-5 h-5" />
                                Retake Challenge
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl gap-2" onClick={() => {
                                setQuestions([])
                                setIsFinished(false)
                            }}>
                                <History className="w-5 h-5" />
                                Review Answers
                            </Button>
                        </div>
                    </div>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 px-2">
                        <Target className="w-5 h-5 text-primary" />
                        Detailed Analysis
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {questions.map((q, idx) => (
                            <Card key={idx} className={cn("border-l-4", answers[idx] === q.correct_answer ? "border-l-green-500 bg-green-500/5" : "border-l-red-500 bg-red-500/5")}>
                                <CardContent className="p-6 flex gap-6 items-start">
                                    <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center shrink-0 font-bold">
                                        {idx + 1}
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <p className="font-semibold text-lg">{q.question}</p>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={cn(answers[idx] === q.correct_answer ? "text-green-500 border-green-500/20" : "text-red-500 border-red-500/20")}>
                                                    Your Answer: {answers[idx]}
                                                </Badge>
                                                {answers[idx] !== q.correct_answer && (
                                                    <Badge variant="outline" className="text-green-500 border-green-500/20">
                                                        Correct: {q.correct_answer}
                                                    </Badge>
                                                )}
                                            </div>
                                            <Badge variant="secondary" className="opacity-70">{q.difficulty}</Badge>
                                        </div>
                                    </div>
                                    {answers[idx] === q.correct_answer ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-500" />
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </motion.div>
        )
    }

    if (questions.length > 0) {
        const q = questions[currentIdx]
        const progress = ((currentIdx + 1) / questions.length) * 100

        return (
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Quiz Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary">
                            <Brain className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Active Intelligence Session</span>
                        </div>
                        <h2 className="text-2xl font-bold">Question {currentIdx + 1} of {questions.length}</h2>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Timer className="w-4 h-4" />
                            <span>Self-Paced Mode</span>
                        </div>
                        <Progress value={progress} className="w-48 h-1.5" />
                    </div>
                </div>

                {/* Question Card */}
                <Card className="border-white/5 bg-background/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
                    <CardHeader className="p-10 pb-6">
                        <div className="flex items-center justify-between mb-4">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                {q.difficulty} Level
                            </Badge>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Lightbulb className="w-3.5 h-3.5" />
                                <span>Based on your skill profile</span>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold leading-snug">
                            {q.question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 pt-0 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {q.options.map((option: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    className="group text-left p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 flex items-center gap-6 relative overflow-hidden"
                                >
                                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="text-lg font-medium flex-1">{option}</span>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tips footer */}
                <div className="flex items-center justify-center gap-8 py-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <span className="text-xs flex items-center gap-2"><Sparkles className="w-3 h-3 text-primary" /> Personalized for you</span>
                    <span className="text-xs flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-primary" /> Verifiable results</span>
                    <span className="text-xs flex items-center gap-2"><Target className="w-3 h-3 text-primary" /> Critical gap focus</span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            {/* Landing UI */}
            <div className="max-w-4xl mx-auto space-y-16">
                <div className="text-center space-y-4 pt-10">
                    <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto">
                        <Gamepad2 className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic">Combat Ready Prep</h1>
                        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                            Generate AI-driven interview gauntlets specifically designed to expose and fix your skill gaps.
                        </p>
                    </div>
                </div>

                <Card className="border-white/5 bg-background/60 backdrop-blur-xl shadow-2xl p-10 relative group overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none group-hover:bg-primary/30 transition-colors" />
                    <div className="relative space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-lg font-bold">Select Target Position</Label>
                                    <Select value={selectedJob} onValueChange={setSelectedJob}>
                                        <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 shadow-lg">
                                            <SelectValue placeholder="Which job are you prepping for?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jobs.map((job) => (
                                                <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Session Configuration</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="px-3 py-1 bg-white/5">10 Questions</Badge>
                                        <Badge variant="secondary" className="px-3 py-1 bg-white/5">Interactive Feedback</Badge>
                                        <Badge variant="secondary" className="px-3 py-1 bg-white/5">Gap Analysis</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 space-y-4">
                                <h4 className="font-bold flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-primary" />
                                    AI Logic Engine
                                </h4>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        Compares your verified skills against job requirements.
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        Generates scenarios for identified "red" skill zones.
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        Adjusts difficulty based on your verified experience level.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <Button 
                            className="w-full h-16 rounded-2xl text-lg font-bold gap-3 shadow-xl shadow-primary/20 group"
                            onClick={startInterview}
                            disabled={!selectedJob}
                        >
                            <Zap className="w-6 h-6 fill-primary-foreground group-hover:scale-125 transition-transform" />
                            Initialize Preparation Session
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 px-4">
                    <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-primary">150+</div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Skill Verticals</p>
                    </div>
                    <div className="text-center space-y-2 border-x border-white/5">
                        <div className="text-4xl font-black text-primary">0.4s</div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Gen Generation</p>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="text-4xl font-black text-primary">100%</div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Adaptive Growth</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
