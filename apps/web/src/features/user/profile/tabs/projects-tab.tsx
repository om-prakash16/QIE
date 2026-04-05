import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Github, ExternalLink, Folder, Trash2 } from "lucide-react"
import { UserProfile } from "@/lib/mock-api/user-profile"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ProjectsTabProps {
    data: UserProfile
    isEditing?: boolean
    onAdd?: () => void
    onDelete?: (id: string) => void
    onUpdate?: (id: string, field: string, value: string) => void
}

export function ProjectsTab({ data, isEditing, onAdd, onDelete, onUpdate }: ProjectsTabProps) {
    return (
        <Card className="border-none shadow-none bg-transparent">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Projects</h2>
                    <p className="text-sm text-muted-foreground">Showcase your best work.</p>
                </div>
                {isEditing && (
                    <Button size="sm" onClick={onAdd}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                    </Button>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {data.projects.map((project) => (
                    <Card key={project.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex gap-3 flex-1">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                        <Folder className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    defaultValue={project.title}
                                                    onChange={(e) => onUpdate?.(project.id, 'title', e.target.value)}
                                                    className="font-semibold"
                                                    placeholder="Project Title"
                                                />
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <Input
                                                        defaultValue={project.github}
                                                        onChange={(e) => onUpdate?.(project.id, 'github', e.target.value)}
                                                        className="text-xs h-8"
                                                        placeholder="GitHub URL"
                                                    />
                                                    <Input
                                                        defaultValue={project.link}
                                                        onChange={(e) => onUpdate?.(project.id, 'link', e.target.value)}
                                                        className="text-xs h-8"
                                                        placeholder="Live URL"
                                                    />
                                                </div>
                                                <Input
                                                    defaultValue={project.stack.join(", ")}
                                                    onChange={(e) => onUpdate?.(project.id, 'stack', e.target.value)}
                                                    className="text-xs h-8"
                                                    placeholder="Tech Stack (comma separated)"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <CardTitle className="text-base">{project.title}</CardTitle>
                                            </>
                                        )}

                                        {!isEditing && (
                                            <div className="flex items-center gap-3 mt-1.5">
                                                {project.github && (
                                                    <Link href={project.github} className="text-muted-foreground hover:text-primary transition-colors">
                                                        <Github className="w-4 h-4" />
                                                    </Link>
                                                )}
                                                {project.link && (
                                                    <Link href={project.link} className="text-muted-foreground hover:text-primary transition-colors">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {isEditing && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete?.(project.id)}
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 pb-4">
                            {isEditing ? (
                                <Textarea
                                    defaultValue={project.description}
                                    onChange={(e) => onUpdate?.(project.id, 'description', e.target.value)}
                                    className="text-sm min-h-[100px]"
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                    {project.description}
                                </p>
                            )}
                        </CardContent>
                        <CardFooter>
                            <div className="flex flex-wrap gap-1.5">
                                {project.stack.map(tech => (
                                    <Badge key={tech} variant="secondary" className="text-xs font-normal">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </Card>
    )
}
