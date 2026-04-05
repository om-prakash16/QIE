import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CalendarDays, Clock, User } from "lucide-react"
import Link from "next/link"
import { Article } from "@/lib/mock-api/career-advice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ArticleCardProps {
    article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="p-0">
                <div className="h-48 w-full bg-muted rounded-t-xl overflow-hidden relative group">
                    {/* Placeholder for real image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute bottom-3 left-4 z-20">
                        <Badge variant="secondary" className="mb-2 bg-background/80 hover:bg-background text-foreground backdrop-blur-sm shadow-sm border-none">
                            {article.category}
                        </Badge>
                    </div>
                    {/* Mock Image Gradient for now since we don't have real images */}
                    <div className={`w-full h-full bg-gradient-to-br ${article.id === "1" ? "from-blue-400 to-indigo-500" :
                            article.id === "2" ? "from-green-400 to-emerald-500" :
                                article.id === "3" ? "from-orange-400 to-red-500" :
                                    article.id === "4" ? "from-purple-400 to-pink-500" :
                                        "from-slate-400 to-gray-500"
                        }`} />
                </div>
            </CardHeader>
            <CardContent className="flex-1 pt-6 space-y-3">
                <h3 className="font-bold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                    <Link href={`/career-advice/${article.id}`}>{article.title}</Link>
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3">
                    {article.summary}
                </p>
            </CardContent>
            <CardFooter className="pt-0 flex items-center justify-between text-xs text-muted-foreground border-t p-4 mt-auto">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={article.author.avatar} />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <span>{article.author.name}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readingTime}
                    </span>
                    <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {article.publishedDate.split(',')[0]}
                    </span>
                </div>
            </CardFooter>
        </Card>
    )
}
