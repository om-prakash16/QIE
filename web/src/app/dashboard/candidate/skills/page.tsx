"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Award, 
    Plus, 
    Search, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    BarChart3, 
    Trash2,
    ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"

interface Skill {
    id: string
    skill_name: string
    proficiency_level: number
    is_verified: boolean
}

export default function SkillsPage() {
    const { user } = useAuth()
    const [skills, setSkills] = useState<Skill[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newSkillName, setNewSkillName] = useState("")
    const [proficiency, setProficiency] = useState(50)

    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/skills`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("sp_token")}`
                }
            })
            const data = await res.json()
            setSkills(data)
        } catch (err) {
            toast.error("Failed to load skills")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddSkill = async () => {
        if (!newSkillName.trim()) return
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/skills`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("sp_token")}`
                },
                body: JSON.stringify({
                    skill_name: newSkillName,
                    proficiency_level: Math.round(proficiency / 10)
                })
            })
            
            if (res.ok) {
                toast.success("Skill added successfully")
                setNewSkillName("")
                fetchSkills()
            }
        } catch (err) {
            toast.error("Failed to add skill")
        }
    }

    const handleRequestVerification = async (skillId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/skills/${skillId}/verify`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("sp_token")}`
                }
            })
            
            if (res.ok) {
                toast.success("Verification request submitted")
                fetchSkills()
            }
        } catch (err) {
            toast.error("Failed to submit verification request")
        }
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto py-10 px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
                        <Award className="w-8 h-8 text-primary" />
                        Skills & Verification
                    </h1>
                    <p className="text-muted-foreground text-sm">Manage your professional skills and request on-chain verification.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full border border-emerald-500/20 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    {skills.filter(s => s.is_verified).length} Verified Skills
                </div>
            </div>

            {/* Add Skill Section */}
            <Card className="border-primary/20 bg-primary/5 shadow-inner">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm uppercase tracking-widest font-black flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Skill
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input 
                                placeholder="E.g. Rust, Solidity, Project Management..." 
                                value={newSkillName}
                                onChange={(e) => setNewSkillName(e.target.value)}
                                className="h-12 bg-background border-primary/20 focus:ring-primary"
                            />
                        </div>
                        <div className="w-full md:w-64 space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <span>Proficiency</span>
                                <span>{Math.round(proficiency / 10)} / 10</span>
                            </div>
                            <input 
                                type="range" 
                                min="10" 
                                max="100" 
                                step="10"
                                value={proficiency}
                                onChange={(e) => setProficiency(parseInt(e.target.value))}
                                className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                        <Button 
                            onClick={handleAddSkill}
                            className="h-12 px-8 font-bold"
                            disabled={!newSkillName.trim()}
                        >
                            Add Skill
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse" />
                        ))
                    ) : skills.length === 0 ? (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <div className="bg-muted p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">No skills added yet. Start by adding your core competencies.</p>
                        </div>
                    ) : (
                        skills.map((skill) => (
                            <motion.div
                                key={skill.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <Card className={cn(
                                    "group relative overflow-hidden transition-all hover:shadow-lg border-border/50",
                                    skill.is_verified && "border-emerald-500/30 bg-emerald-500/[0.02]"
                                )}>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-lg">{skill.skill_name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px] font-bold">
                                                        Level {skill.proficiency_level}
                                                    </Badge>
                                                    {skill.is_verified ? (
                                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> Verified
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-[10px] font-bold gap-1">
                                                            <Clock className="w-3 h-3" /> Pending
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                <span>Proficiency</span>
                                                <span>{skill.proficiency_level * 10}%</span>
                                            </div>
                                            <Progress value={skill.proficiency_level * 10} className="h-1.5" />
                                        </div>

                                        {!skill.is_verified && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full text-xs font-bold border-primary/20 hover:bg-primary/5 gap-2"
                                                onClick={() => handleRequestVerification(skill.id)}
                                            >
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                Request Verification
                                            </Button>
                                        )}
                                    </CardContent>
                                    
                                    {/* Decorative background icon */}
                                    <Award className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ")
}
