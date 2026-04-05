import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Building2 } from "lucide-react"
import { UserProfile } from "@/lib/mock-api/user-profile"

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
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>Your professional career journey.</CardDescription>
                </div>
                {isEditing && (
                    <Button size="sm" onClick={onAdd}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Role
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {data.experience.map((exp, index) => (
                    <div key={exp.id} className={`relative flex gap-4 ${index !== data.experience.length - 1 ? "pb-6 border-b border-border/50" : ""}`}>
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0 border border-border/50">
                            {exp.logo ? (
                                <span className="font-bold text-lg text-muted-foreground">{exp.company[0]}</span>
                            ) : (
                                <Building2 className="w-6 h-6 text-muted-foreground" />
                            )}
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1 flex-1 mr-4">
                                    {isEditing ? (
                                        <>
                                            <Input
                                                defaultValue={exp.role}
                                                onChange={(e) => onUpdate?.(exp.id, 'role', e.target.value)}
                                                className="font-semibold h-8"
                                                placeholder="Role"
                                            />
                                            <div className="flex gap-2">
                                                <Input
                                                    defaultValue={exp.company}
                                                    onChange={(e) => onUpdate?.(exp.id, 'company', e.target.value)}
                                                    className="h-8 text-sm"
                                                    placeholder="Company"
                                                />
                                                <Input
                                                    defaultValue={exp.type}
                                                    onChange={(e) => onUpdate?.(exp.id, 'type', e.target.value)}
                                                    className="h-8 text-sm w-32"
                                                    placeholder="Type"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="font-semibold text-base">{exp.role}</h3>
                                            <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                <span>{exp.company}</span>
                                                <span>•</span>
                                                <span className="text-muted-foreground">{exp.type}</span>
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
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="flex gap-2 mt-2">
                                    <Input defaultValue={exp.startDate} className="h-8 text-sm w-32" placeholder="Start Date" />
                                    <Input defaultValue={exp.endDate} className="h-8 text-sm w-32" placeholder="End Date" />
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {exp.startDate} - {exp.endDate}
                                </p>
                            )}

                            {isEditing ? (
                                <Textarea defaultValue={exp.description} className="mt-2 text-sm" />
                            ) : (
                                <p className="text-sm text-muted-foreground/90 mt-2 leading-relaxed">
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
