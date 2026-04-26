import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, X, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { UserProfile, Skill, ProficiencyLevel } from "@/types/profile"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SkillsTabProps {
    data: UserProfile
    isEditing?: boolean
    onAddSkill?: (skill: Skill) => void
    onDeleteSkill?: (name: string) => void
}

export function SkillsTab({ data, isEditing = false, onAddSkill, onDeleteSkill }: SkillsTabProps) {
    const levels: ProficiencyLevel[] = ["Expert", "Advanced", "Intermediate", "Beginner"]
    const [isAdding, setIsAdding] = useState(false)
    const [newSkillName, setNewSkillName] = useState("")
    const [newSkillLevel, setNewSkillLevel] = useState<ProficiencyLevel>("Advanced")

    const handleSaveSkill = () => {
        if (newSkillName.trim() && onAddSkill) {
            onAddSkill({ name: newSkillName, level: newSkillLevel })
            setNewSkillName("")
            setIsAdding(false)
        }
    }

    return (
        <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between pt-10 px-10">
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Architecture Matrix</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                        Manage your technical nodes and proficiency synthesis.
                    </CardDescription>
                </div>
                {isEditing && !isAdding && (
                    <Button size="sm" onClick={() => setIsAdding(true)} variant="premium" className="h-10 px-5 rounded-xl shadow-xl shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Node
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-12 px-10 pb-12 pt-6">
                {isAdding && (
                    <div className="flex items-center gap-4 p-6 glass border-primary/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
                        <div className="flex-1 space-y-2">
                             <Label className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">Node Name</Label>
                             <Input
                                value={newSkillName}
                                onChange={(e) => setNewSkillName(e.target.value)}
                                placeholder="e.g. Rust, Solidity"
                                className="h-12 glass border-white/10 rounded-xl focus:ring-primary/30 font-bold"
                                autoFocus
                            />
                        </div>
                        <div className="w-[180px] space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">Resonance Level</Label>
                            <Select
                                value={newSkillLevel}
                                onValueChange={(val: any) => setNewSkillLevel(val)}
                            >
                                <SelectTrigger className="h-12 glass border-white/10 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="glass border-white/10">
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="pt-6 flex gap-2">
                            <Button size="sm" onClick={handleSaveSkill} className="h-12 px-6 rounded-xl">
                                <Check className="w-4 h-4 mr-2" /> SAVE
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setIsAdding(false)} className="h-12 w-12 rounded-xl hover:bg-white/5">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {levels.map(level => {
                    const skillsInLevel = data.skills.filter((s: any) => s.level === level)
                    if (skillsInLevel.length === 0 && !isEditing) return null

                    const levelColors = {
                        Expert: "text-purple-400 border-purple-500/20 bg-purple-500/5",
                        Advanced: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
                        Intermediate: "text-primary border-primary/20 bg-primary/5",
                        Beginner: "text-amber-400 border-amber-500/20 bg-amber-500/5"
                    }[level]

                    return (
                        <div key={level} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 whitespace-nowrap">{level} SYNCHRONIZATION</h3>
                                <div className="h-px w-full bg-white/5" />
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {skillsInLevel.map((skill: any) => (
                                    <div
                                        key={skill.name}
                                        className={cn(
                                            "flex items-center gap-3 px-5 py-2.5 border rounded-2xl transition-all duration-300 cursor-default group hover:scale-105",
                                            levelColors
                                        )}
                                    >
                                        <span className="text-xs font-black tracking-tight">{skill.name}</span>
                                        {isEditing && onDeleteSkill && (
                                            <button
                                                onClick={() => onDeleteSkill(skill.name)}
                                                className="text-white/20 hover:text-rose-500 transition-colors ml-1"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {skillsInLevel.length === 0 && (
                                    <p className="text-[10px] text-white/10 italic font-black uppercase tracking-widest px-1">No data points.</p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
