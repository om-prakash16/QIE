import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GraduationCap, Pencil, Trash2 } from "lucide-react"
import { UserProfile } from "@/lib/mock-api/user-profile"

import { Input } from "@/components/ui/input"

interface EducationTabProps {
    data: UserProfile
    isEditing?: boolean
    onAdd?: () => void
    onDelete?: (id: string) => void
    onUpdate?: (id: string, field: string, value: string) => void
}

export function EducationTab({ data, isEditing, onAdd, onDelete, onUpdate }: EducationTabProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>Academic degrees and certifications.</CardDescription>
                </div>
                {isEditing && (
                    <Button size="sm" onClick={onAdd}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {data.education.map((edu, index) => (
                    <div key={edu.id} className={`flex gap-4 ${index !== data.education.length - 1 ? "pb-6 border-b border-border/50" : ""}`}>
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0 border border-border/50">
                            <GraduationCap className="w-6 h-6 text-muted-foreground" />
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1 flex-1 mr-4">
                                    {isEditing ? (
                                        <>
                                            <Input
                                                defaultValue={edu.institution}
                                                onChange={(e) => onUpdate?.(edu.id, 'institution', e.target.value)}
                                                className="font-semibold h-8"
                                                placeholder="Institution"
                                            />
                                            <Input
                                                defaultValue={edu.degree}
                                                onChange={(e) => onUpdate?.(edu.id, 'degree', e.target.value)}
                                                className="h-8 text-sm"
                                                placeholder="Degree"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="font-semibold text-base">{edu.institution}</h3>
                                            <p className="text-sm text-foreground/80">{edu.degree}</p>
                                        </>
                                    )}
                                </div>
                                {isEditing && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete?.(edu.id)}
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {isEditing ? (
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        defaultValue={edu.year}
                                        onChange={(e) => onUpdate?.(edu.id, 'year', e.target.value)}
                                        className="h-8 text-sm w-24"
                                        placeholder="Year"
                                    />
                                    <Input
                                        defaultValue={edu.grade || ""}
                                        onChange={(e) => onUpdate?.(edu.id, 'grade', e.target.value)}
                                        className="h-8 text-sm w-24"
                                        placeholder="Grade"
                                    />
                                </div>
                            ) : (
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    <span>{edu.year}</span>
                                    {edu.grade && <span>• {edu.grade}</span>}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
