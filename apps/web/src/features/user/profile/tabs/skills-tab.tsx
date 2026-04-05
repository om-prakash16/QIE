import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, X, Check } from "lucide-react"
import { UserProfile } from "@/lib/mock-api/user-profile"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SkillsTabProps {
    data: UserProfile
    isEditing?: boolean
    onAddSkill?: (skill: { name: string, level: "Advanced" | "Intermediate" | "Beginner" }) => void
    onDeleteSkill?: (name: string) => void
}

export function SkillsTab({ data, isEditing = false, onAddSkill, onDeleteSkill }: SkillsTabProps) {
    const levels = ["Advanced", "Intermediate", "Beginner"] as const
    const [isAdding, setIsAdding] = useState(false)
    const [newSkillName, setNewSkillName] = useState("")
    const [newSkillLevel, setNewSkillLevel] = useState<"Advanced" | "Intermediate" | "Beginner">("Advanced")

    const handleSaveSkill = () => {
        if (newSkillName.trim() && onAddSkill) {
            onAddSkill({ name: newSkillName, level: newSkillLevel })
            setNewSkillName("")
            setIsAdding(false)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Technical Skills</CardTitle>
                    <CardDescription>
                        Manage your technical expertise and proficiency levels.
                    </CardDescription>
                </div>
                {isEditing && !isAdding && (
                    <Button size="sm" onClick={() => setIsAdding(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-8">
                {isAdding && (
                    <div className="flex items-center gap-2 p-4 border rounded-lg bg-muted/30 animate-in fade-in slide-in-from-top-2">
                        <Input
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            placeholder="Skill (e.g. React)"
                            className="h-9 w-[200px]"
                            autoFocus
                        />
                        <Select
                            value={newSkillLevel}
                            onValueChange={(val: any) => setNewSkillLevel(val)}
                        >
                            <SelectTrigger className="h-9 w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="sm" onClick={handleSaveSkill}>
                            <Check className="w-4 h-4 mr-2" /> Save
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setIsAdding(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {levels.map(level => {
                    const skillsInLevel = data.skills.filter(s => s.level === level)
                    // If editing, show empty levels so we can see structure? Or just list?
                    if (skillsInLevel.length === 0 && !isEditing) return null

                    return (
                        <div key={level}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{level}</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {skillsInLevel.map(skill => (
                                    <div
                                        key={skill.name}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted border rounded-lg transition-colors cursor-default group"
                                    >
                                        <span className="text-sm font-medium">{skill.name}</span>
                                        {isEditing && onDeleteSkill && (
                                            <button
                                                onClick={() => onDeleteSkill(skill.name)}
                                                className="text-muted-foreground hover:text-destructive ml-1"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
