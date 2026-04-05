import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle2, MapPin, Briefcase, Github, Linkedin, Code2 } from "lucide-react"
import Link from "next/link"
import { User } from "@/lib/mock-api/users"

interface UserCardProps {
    user: User
}

export function UserCard({ user }: UserCardProps) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden flex flex-col h-full">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
                                    {user.name}
                                </h3>
                                {user.verified && (
                                    <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/10" />
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">{user.role}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{user.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Briefcase className="w-3 h-3" />
                                    <span>{user.experience}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-4 flex-grow space-y-4">
                {user.bio && (
                    <p className="text-sm text-muted-foreground/90 line-clamp-2">
                        {user.bio}
                    </p>
                )}

                <div className="flex flex-wrap gap-1.5">
                    {user.skills.slice(0, 5).map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs font-normal">
                            {skill}
                        </Badge>
                    ))}
                    {user.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                            +{user.skills.length - 5}
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-0 flex flex-col gap-3">
                <div className="w-full flex items-center justify-between border-t py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.availability === "Immediate" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        user.availability === "Not Looking" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                        {user.availability}
                    </span>

                    <div className="flex gap-2">
                        {user.github && (
                            <Link href={`https://${user.github}`} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="w-4 h-4" />
                            </Link>
                        )}
                        {user.linkedin && (
                            <Link href={`https://${user.linkedin}`} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        )}
                        {user.leetcode && (
                            <Link href={`https://${user.leetcode}`} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Code2 className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
                <Link href={`/talent/${user.id}`} className="w-full">
                    <Button className="w-full" variant="outline" size="sm">
                        View Profile
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
