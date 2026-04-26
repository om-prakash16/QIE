import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Building2, ArrowRight } from "lucide-react"
import { UserProfile } from "@/types/profile"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ExperienceTabProps {
    data: UserProfile
    isEditing?: boolean
    onAdd?: () => void
    onDelete?: (id: string) => void
    onUpdate?: (id: string, field: string, value: string) => void
}

export function ExperienceTab({ data, isEditing, onAdd, onDelete, onUpdate }: ExperienceTabProps) {
    return (
        <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between pt-10 px-10">
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Proof of Work</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                        Immutable chronological ledger of professional deployments.
                    </CardDescription>
                </div>
                {isEditing && (
                    <Button size="sm" onClick={onAdd} variant="premium" className="h-10 px-5 rounded-xl shadow-xl shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Log New Role
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-10 px-10 pb-12 pt-6">
                {data.experience.map((exp: any, index: any) => (
                    <div key={exp.id} className={cn(
                        "relative flex gap-6 group",
                        index !== data.experience.length - 1 ? "pb-10 border-b border-white/5" : ""
                    )}>
                        <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                            {exp.logo ? (
                                <span className="font-black text-xl text-primary/40">{exp.company[0]}</span>
                            ) : (
                                <Building2 className="w-7 h-7 text-primary/30" />
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1 flex-1 mr-4">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <Input
                                                defaultValue={exp.role}
                                                onChange={(e) => onUpdate?.(exp.id, 'role', e.target.value)}
                                                className="font-bold h-10 glass border-white/10 rounded-lg text-sm"
                                                placeholder="Role Title"
                                            />
                                            <div className="flex gap-3">
                                                <Input
                                                    defaultValue={exp.company}
                                                    onChange={(e) => onUpdate?.(exp.id, 'company', e.target.value)}
                                                    className="h-9 glass border-white/10 rounded-lg text-xs"
                                                    placeholder="Company"
                                                />
                                                <Input
                                                    defaultValue={exp.type}
                                                    onChange={(e) => onUpdate?.(exp.id, 'type', e.target.value)}
                                                    className="h-9 glass border-white/10 rounded-lg text-xs w-32"
                                                    placeholder="Contract Type"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="font-black text-lg text-white tracking-tight leading-none">{exp.role}</h3>
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest pt-1">
                                                <span className="text-primary">{exp.company}</span>
                                                <span className="text-white/10">•</span>
                                                <span className="text-white/30">{exp.type}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete?.(exp.id)}
                                            className="h-10 w-10 text-white/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="flex gap-4">
                                    <div className="space-y-1 flex-1">
                                         <Label className="text-[9px] font-black uppercase text-white/30 ml-1">Genesis</Label>
                                         <Input defaultValue={exp.startDate} className="h-9 glass border-white/10 rounded-lg text-xs" placeholder="YYYY" />
                                    </div>
                                    <div className="space-y-1 flex-1">
                                         <Label className="text-[9px] font-black uppercase text-white/30 ml-1">Termination</Label>
                                         <Input defaultValue={exp.endDate} className="h-9 glass border-white/10 rounded-lg text-xs" placeholder="YYYY / Present" />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                                    {exp.startDate} <ArrowRight className="w-2 h-2" /> {exp.endDate}
                                </p>
                            )}

                            {isEditing ? (
                                <div className="space-y-1">
                                     <Label className="text-[9px] font-black uppercase text-white/30 ml-1">Deployment Specs</Label>
                                     <Textarea 
                                        defaultValue={exp.description} 
                                        className="min-h-[100px] glass border-white/10 rounded-xl text-sm p-4" 
                                        onChange={(e) => onUpdate?.(exp.id, 'description', e.target.value)}
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-white/50 leading-relaxed italic font-medium">
                                    {exp.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
