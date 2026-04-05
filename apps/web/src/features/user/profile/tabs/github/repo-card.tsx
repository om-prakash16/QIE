import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { GithubRepo } from "@/lib/mock-api/github-data"
import { Star, GitFork } from "lucide-react"
import Link from "next/link"

interface RepoCardProps {
    repo: GithubRepo
}

const LanguageColors: Record<string, string> = {
    TypeScript: "bg-blue-500",
    JavaScript: "bg-yellow-400",
    Python: "bg-green-500",
    Go: "bg-cyan-500",
    Rust: "bg-orange-600",
    Vue: "bg-emerald-500",
    Swift: "bg-red-500",
    Kotlin: "bg-purple-500",
    Dockerfile: "bg-blue-600",
    CSS: "bg-indigo-400",
}

export function RepoCard({ repo }: RepoCardProps) {
    const langColor = LanguageColors[repo.language] || "bg-gray-400"

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    return (
        <Card className="flex flex-col h-full hover:border-primary/50 transition-colors bg-muted/20 border-border/50">
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                        <Link
                            href={repo.url}
                            className="font-semibold text-base hover:underline decoration-primary decoration-2 underline-offset-4 flex items-center gap-2"
                        >
                            {repo.name}
                            {repo.isPublic && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 font-normal">
                                    Public
                                </Badge>
                            )}
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-1 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] leading-relaxed">
                    {repo.description}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t border-border/40 bg-muted/10">
                <div className="flex items-center justify-between w-full text-xs text-muted-foreground mt-3">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${langColor}`} />
                            <span>{repo.language}</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                            <Star className="w-3.5 h-3.5" />
                            <span>{repo.stars.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                            <GitFork className="w-3.5 h-3.5" />
                            <span>{repo.forks.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] opacity-80">
                        <span>Updated {formatDate(repo.updatedAt)}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
