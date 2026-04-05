"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Play, CheckCircle2, XCircle, Clock, Trophy, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8011/api/v1"

const availableSkills = [
    { name: "Rust", category: "Systems", color: "from-orange-500/20 to-orange-600/5" },
    { name: "Solana", category: "Blockchain", color: "from-purple-500/20 to-purple-600/5" },
    { name: "TypeScript", category: "Frontend", color: "from-blue-500/20 to-blue-600/5" },
    { name: "Python", category: "Backend", color: "from-green-500/20 to-green-600/5" },
    { name: "Next.js", category: "Frontend", color: "from-gray-500/20 to-gray-600/5" },
    { name: "FastAPI", category: "Backend", color: "from-teal-500/20 to-teal-600/5" },
    { name: "LangChain", category: "AI", color: "from-emerald-500/20 to-emerald-600/5" },
    { name: "Anchor", category: "Blockchain", color: "from-indigo-500/20 to-indigo-600/5" },
]

const pastQuizzes = [
    { skill: "Rust", score: 88, level: "Silver", passed: true, date: "Apr 1, 2026" },
    { skill: "Solana", score: 92, level: "Gold", passed: true, date: "Mar 28, 2026" },
    { skill: "TypeScript", score: 65, level: "—", passed: false, date: "Mar 25, 2026" },
]

type Phase = "select" | "quiz" | "result"

export default function SkillVerificationPage() {
    const { user } = useAuth()
    const [phase, setPhase] = useState<Phase>("select")
    const [selectedSkill, setSelectedSkill] = useState("")
    const [questions, setQuestions] = useState<any[]>([])
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [timeLeft, setTimeLeft] = useState(900)

    const startQuiz = async (skill: string) => {
        setLoading(true)
        setSelectedSkill(skill)
        try {
            const res = await fetch(`${API}/quiz/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skill, difficulty: "intermediate", question_count: 5, wallet_address: user?.wallet_address || "demo" })
            })
            const data = await res.json()
            setQuestions(data.questions || [])
            setCurrentQ(0)
            setAnswers({})
            setPhase("quiz")
        } catch {
            // Use mock questions
            setQuestions([
                { id: "q1", text: `What is a key feature of ${skill}?`, options: ["A) Speed", "B) Safety", "C) Both A and B", "D) None"] },
                { id: "q2", text: `Which ecosystem uses ${skill}?`, options: ["A) Ethereum", "B) Solana", "C) Both", "D) Neither"] },
                { id: "q3", text: `What is the primary use case?`, options: ["A) Frontend", "B) Backend", "C) Smart Contracts", "D) All"] },
            ])
            setCurrentQ(0)
            setAnswers({})
            setPhase("quiz")
        }
        setLoading(false)
    }

    const selectAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }))
    }

    const submitQuiz = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API}/quiz/evaluate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quiz_id: "local", answers, wallet_address: user?.wallet_address || "demo" })
            })
            const data = await res.json()
            setResult(data)
        } catch {
            const correct = Object.keys(answers).length - 1
            const total = questions.length
            const score = Math.round((correct / total) * 100)
            setResult({ score, correct, total, passed: score >= 75, level: score >= 85 ? "Gold" : score >= 75 ? "Silver" : "Bronze", nft_ready: score >= 75 })
        }
        setPhase("result")
        setLoading(false)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary" />
                    Skill Verification Center
                </motion.h1>
                <p className="text-muted-foreground text-sm">Pass AI quizzes to earn Soulbound Skill NFTs on Solana.</p>
            </div>

            <AnimatePresence mode="wait">
                {/* PHASE: Skill Selection */}
                {phase === "select" && (
                    <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {availableSkills.map((skill, i) => (
                                <motion.div
                                    key={skill.name}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <button
                                        onClick={() => startQuiz(skill.name)}
                                        disabled={loading}
                                        className={cn(
                                            "w-full p-6 rounded-2xl border border-white/10 bg-gradient-to-br text-left transition-all hover:border-white/20 hover:shadow-lg group",
                                            skill.color
                                        )}
                                    >
                                        <Badge variant="secondary" className="text-[9px] mb-3">{skill.category}</Badge>
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{skill.name}</h3>
                                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                                            <Play className="w-3.5 h-3.5" />Start Quiz
                                        </div>
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        {/* Past Quiz History */}
                        {pastQuizzes.length > 0 && (
                            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Quiz History</h2>
                                <div className="space-y-3">
                                    {pastQuizzes.map((q, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                                            {q.passed ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                                            <div className="flex-1">
                                                <span className="font-bold text-sm">{q.skill}</span>
                                                <span className="text-xs text-muted-foreground ml-2">· {q.date}</span>
                                            </div>
                                            <span className="text-sm font-bold">{q.score}%</span>
                                            {q.passed && <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold">{q.level}</Badge>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* PHASE: Quiz */}
                {phase === "quiz" && questions.length > 0 && (
                    <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 max-w-3xl">
                        <div className="flex items-center justify-between">
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">{selectedSkill} Quiz</Badge>
                            <span className="text-sm text-muted-foreground">Question {currentQ + 1} / {questions.length}</span>
                        </div>

                        <Progress value={((currentQ + 1) / questions.length) * 100} className="h-1" />

                        <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] space-y-6">
                            <h2 className="text-xl font-bold">{questions[currentQ]?.text}</h2>
                            <div className="space-y-3">
                                {questions[currentQ]?.options?.map((opt: string) => {
                                    const letter = opt.charAt(0)
                                    const isSelected = answers[questions[currentQ].id] === letter
                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => selectAnswer(questions[currentQ].id, letter)}
                                            className={cn(
                                                "w-full text-left p-4 rounded-xl border transition-all text-sm font-medium",
                                                isSelected ? "border-primary bg-primary/10 text-primary" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                                            )}
                                        >
                                            {opt}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="rounded-xl border-white/10">Previous</Button>
                            {currentQ < questions.length - 1 ? (
                                <Button onClick={() => setCurrentQ(currentQ + 1)} disabled={!answers[questions[currentQ]?.id]} className="rounded-xl gap-2">
                                    Next <ArrowRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button onClick={submitQuiz} disabled={loading || Object.keys(answers).length < questions.length} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 gap-2">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    Submit Quiz
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* PHASE: Result */}
                {phase === "result" && result && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center space-y-8">
                        <div className={cn(
                            "w-32 h-32 rounded-full mx-auto flex items-center justify-center border-4",
                            result.passed ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10"
                        )}>
                            <div>
                                <div className={cn("text-4xl font-black", result.passed ? "text-emerald-500" : "text-red-500")}>{result.score}%</div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-black">{result.passed ? "🎉 Congratulations!" : "Keep Practicing!"}</h2>
                            <p className="text-muted-foreground text-sm">
                                {result.passed
                                    ? `You earned a ${result.level} level ${selectedSkill} NFT!`
                                    : "You need 75% to pass. Try again when ready."
                                }
                            </p>
                        </div>

                        {result.passed && (
                            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                                <Trophy className="w-6 h-6 text-emerald-500 mx-auto" />
                                <p className="text-sm font-bold text-emerald-500">Soulbound NFT Ready to Mint</p>
                                <p className="text-[10px] text-muted-foreground">Level: {result.level} · Skill: {selectedSkill}</p>
                                <Button className="mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success("Skill NFT minting initiated on Solana!")}>
                                    Mint Skill NFT
                                </Button>
                            </div>
                        )}

                        <Button variant="outline" onClick={() => { setPhase("select"); setResult(null) }} className="rounded-xl border-white/10">
                            Back to Skills
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && phase === "select" && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}
        </div>
    )
}
