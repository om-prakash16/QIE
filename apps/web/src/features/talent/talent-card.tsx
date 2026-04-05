import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Briefcase, CheckCircle2, Trophy } from "lucide-react"
import Link from "next/link"
import { Talent } from "@/lib/mock-api/talent"

interface TalentCardProps {
    talent: Talent
}

export function TalentCard({ talent }: TalentCardProps) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden flex flex-col h-full bg-card">
            <div className="p-6 pb-2 flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                    <AvatarImage src={talent.avatar} alt={talent.name} />
                    <AvatarFallback>{talent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                            {talent.name}
                        </h3>
                        {talent.verified && (
                            <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10 shrink-0" />
                        )}
                    </div>
                    <p className="text-sm font-medium text-foreground/80 truncate">{talent.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                        <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            <span>{talent.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{talent.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="px-6 py-4 space-y-4 flex-grow">
                {/* Completion Bar - "Profile Strength" */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>Profile Strength</span>
                        <span className={talent.completion >= 90 ? "text-green-600 dark:text-green-400" : "text-primary"}>
                            {talent.completion}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 rounded-full"
                            style={{ width: `${talent.completion}%` }}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {talent.skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="secondary" className="px-2 py-0 text-xs font-normal bg-secondary/50 text-secondary-foreground hover:bg-secondary">
                            {skill}
                        </Badge>
                    ))}
                    {talent.skills.length > 3 && (
                        <span className="text-xs text-muted-foreground self-center px-1">
                            +{talent.skills.length - 3}
                        </span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 bg-muted/5 border-t mt-auto">
                <Link href={`/talent/${talent.id}`} className="w-full">
                    <Button className="w-full" variant="outline">
                        View Profile
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
