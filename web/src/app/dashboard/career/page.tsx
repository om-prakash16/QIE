"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, 
    Target, 
    Calendar, 
    CheckCircle2, 
    Circle, 
    ArrowRight, 
    Trophy, 
    TrendingUp, 
    AlertCircle,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { api } from "@/lib/api/api-client"

export default function CareerRoadmapPage() {
    const [goals, setGoals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddingGoal, setIsAddingGoal] = useState(false)
    const [newGoal, setNewGoal] = useState({ goal_title: "", target_role: "", deadline: "" })

    useEffect(() => {
        fetchGoals()
    }, [])

    const fetchGoals = async () => {
        try {
            const data = await api.career.getGoals()
            setGoals(data)
        } catch (error) {
            console.error("Failed to fetch goals:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.career.createGoal(newGoal)
            toast.success("New career goal established!")
            setIsAddingGoal(false)
            setNewGoal({ goal_title: "", target_role: "", deadline: "" })
            fetchGoals()
        } catch (error) {
            toast.error("Failed to create goal")
        }
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-medium">
                        <Target className="w-5 h-5" />
                        <span className="tracking-widest uppercase text-xs">Aspiration Engine</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Career Roadmap</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Define your professional milestones and track your journey towards your dream role.
                    </p>
                </div>
                <Button 
                    size="lg" 
                    className="h-14 px-8 rounded-2xl gap-2 shadow-xl shadow-primary/20"
                    onClick={() => setIsAddingGoal(true)}
                >
                    <Plus className="w-5 h-5" />
                    Set New Goal
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Calibrating your trajectory...</p>
                </div>
            ) : goals.length === 0 && !isAddingGoal ? (
                <Card className="border-dashed bg-muted/5 py-20">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="p-4 bg-muted rounded-full">
                            <Target className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">No active goals found</h3>
                            <p className="text-muted-foreground">Every great career starts with a single objective. Let's set your first one.</p>
                        </div>
                        <Button variant="outline" onClick={() => setIsAddingGoal(true)}>Initialize First Goal</Button>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    <AnimatePresence>
                        {isAddingGoal && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            >
                                <Card className="border-primary/20 overflow-hidden relative shadow-2xl shadow-primary/5">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                    <CardHeader>
                                        <CardTitle>Define Vision</CardTitle>
                                        <CardDescription>What is your next major professional milestone?</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label>Goal Title</Label>
                                                <Input 
                                                    placeholder="e.g. Master React & Next.js" 
                                                    value={newGoal.goal_title}
                                                    onChange={(e) => setNewGoal({...newGoal, goal_title: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Target Role</Label>
                                                <Input 
                                                    placeholder="e.g. Senior Frontend Engineer" 
                                                    value={newGoal.target_role}
                                                    onChange={(e) => setNewGoal({...newGoal, target_role: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Target Date</Label>
                                                <Input 
                                                    type="date" 
                                                    value={newGoal.deadline}
                                                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                                                />
                                            </div>
                                            <div className="md:col-span-3 flex justify-end gap-3 pt-4">
                                                <Button variant="ghost" onClick={() => setIsAddingGoal(false)}>Cancel</Button>
                                                <Button type="submit">Establish Trajectory</Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {goals.map((goal, index) => (
                        <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="group hover:border-primary/40 transition-all duration-500 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-2 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                                                    {goal.status}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Target: {new Date(goal.deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                                                    {goal.goal_title}
                                                </h3>
                                                <p className="text-muted-foreground italic">Aiming for: {goal.target_role}</p>
                                            </div>

                                            <div className="space-y-2 pt-4">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-sm font-medium">Completion Progress</span>
                                                    <span className="text-2xl font-bold text-primary">{Math.round(goal.progress_percentage)}%</span>
                                                </div>
                                                <Progress value={goal.progress_percentage} className="h-2.5 bg-primary/5" />
                                            </div>
                                        </div>

                                        <div className="w-full md:w-80 space-y-4 border-l border-white/5 pl-0 md:pl-8">
                                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                                Milestones
                                            </h4>
                                            <div className="space-y-3">
                                                {goal.tasks && goal.tasks.length > 0 ? (
                                                    goal.tasks.map((task: any) => (
                                                        <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group/task">
                                                            {task.status === 'COMPLETED' ? (
                                                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                                            ) : (
                                                                <Circle className="w-4 h-4 text-muted-foreground shrink-0 group-hover/task:text-primary/50" />
                                                            )}
                                                            <span className={task.status === 'COMPLETED' ? 'line-through text-muted-foreground text-sm' : 'text-sm'}>
                                                                {task.task_title}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-4 bg-muted/5 rounded-xl border border-dashed border-white/10">
                                                        <p className="text-xs text-muted-foreground mb-2">No tasks defined yet</p>
                                                        <Button variant="link" size="sm" className="h-auto p-0 text-primary">Initialize Milestones</Button>
                                                    </div>
                                                )}
                                            </div>
                                            <Button variant="outline" className="w-full mt-4 group/btn" size="sm">
                                                View Detailed Insights
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Stats Overview */}
            {!loading && goals.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <CardHeader className="p-6">
                            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                                <Trophy className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-bold">
                                {goals.filter(g => g.status === 'COMPLETED').length}
                            </CardTitle>
                            <CardDescription>Goals Achieved</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <CardHeader className="p-6">
                            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                                <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-bold">
                                {Math.round(goals.reduce((acc, g) => acc + (g.progress_percentage || 0), 0) / goals.length)}%
                            </CardTitle>
                            <CardDescription>Aggregate Velocity</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                        <CardHeader className="p-6">
                            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                                <AlertCircle className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-bold">
                                {goals.reduce((acc, g) => acc + (g.tasks?.filter((t:any) => t.status !== 'COMPLETED').length || 0), 0)}
                            </CardTitle>
                            <CardDescription>Pending Milestones</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            )}
        </div>
    )
}
