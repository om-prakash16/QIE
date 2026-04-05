import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Article } from "@/lib/mock-api/career-advice"

interface FeaturedArticleCardProps {
    article: Article
}

export function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
    return (
        <Card className="overflow-hidden border-none shadow-none bg-background group">
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="h-64 md:h-80 w-full rounded-2xl overflow-hidden relative">
                    <div className={`w-full h-full transform group-hover:scale-105 transition-transform duration-500 bg-gradient-to-br ${article.id === "1" ? "from-indigo-500 via-purple-500 to-pink-500" :
                            "from-blue-600 to-cyan-500"
                        }`} />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                            ★ Featured
                        </Badge>
                        <Badge variant="secondary">
                            {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readingTime}
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight group-hover:text-primary transition-colors">
                        <Link href={`/career-advice/${article.id}`}>{article.title}</Link>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {article.summary}
                    </p>
                    <div className="pt-2">
                        <Button variant="link" className="pl-0 h-auto font-semibold text-primary" asChild>
                            <Link href={`/career-advice/${article.id}`}>
                                Read Article <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
