"use client"

import { Suspense, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, Quote, Lightbulb, Sparkles, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    fetchArticles,
    CATEGORIES,
    CAREER_STAGES,
    EXPERT_TIPS,
    Article
} from "@/lib/mock-api/career-advice"
import { ArticleCard } from "@/components/features/career-advice/article-card"
import { FeaturedArticleCard } from "@/components/features/career-advice/featured-article-card"
import { CategoryCard, CareerStageCard } from "@/components/features/career-advice/advice-components"
import Link from "next/link"

function CareerAdviceContent() {
    const [activeCategory, setActiveCategory] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")

    const { data: articles, isLoading } = useQuery({
        queryKey: ["articles", activeCategory, searchQuery],
        queryFn: () => fetchArticles(activeCategory, searchQuery),
        staleTime: 60000
    })

    const featuredArticle = articles?.find(a => a.featured) || articles?.[0]
    const regularArticles = articles?.filter(a => a.id !== featuredArticle?.id) || []

    return (
        <div className="min-h-screen bg-muted/5 flex flex-col pt-16">

            {/* Header Section */}
            <div className="bg-background border-b pt-12 pb-16 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 -transtale-y-1/2 translate-x-1/4 opacity-5 pointer-events-none">
                    <Sparkles className="w-96 h-96" />
                </div>

                <div className="container mx-auto max-w-6xl text-center space-y-6 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
                        Career Advice & Insights
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Practical guidance, industry secrets, and expert tips to help you grow your career at every stage.
                    </p>

                    <div className="w-full max-w-md mx-auto relative mt-8">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search articles (e.g., 'resume', 'negotiation')..."
                            className="pl-10 h-12 rounded-full shadow-sm bg-background border-muted-foreground/20 focus:border-primary/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16">

                {/* Categories */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Browse by Topic</h2>
                        {activeCategory !== "all" && (
                            <Button variant="ghost" className="text-sm" onClick={() => setActiveCategory("all")}>
                                Clear Filter
                            </Button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {CATEGORIES.map(cat => (
                            <CategoryCard
                                key={cat.id}
                                {...cat}
                                isActive={activeCategory === cat.id}
                                onClick={() => setActiveCategory(cat.id === activeCategory ? "all" : cat.id)}
                            />
                        ))}
                    </div>
                </section>

                {/* Featured Article */}
                {isLoading ? (
                    <Skeleton className="h-80 w-full rounded-2xl" />
                ) : featuredArticle && !searchQuery && activeCategory === "all" ? (
                    <section>
                        <FeaturedArticleCard article={featuredArticle} />
                    </section>
                ) : null}

                {/* Latest Articles Grid */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 fill-yellow-500/10" />
                        <h2 className="text-2xl font-bold">
                            {searchQuery ? `Search Results for "${searchQuery}"` :
                                activeCategory !== "all" ? `${CATEGORIES.find(c => c.id === activeCategory)?.label} Articles` :
                                    "Latest Advice"}
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 rounded-xl" />)}
                        </div>
                    ) : regularArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(activeCategory === "all" && !searchQuery ? regularArticles : articles || []).map((article: Article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed rounded-xl">
                            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
                            <Button variant="link" onClick={() => { setActiveCategory("all"); setSearchQuery("") }}>
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </section>

                {/* Career Stages - Only show on home view */}
                {!searchQuery && activeCategory === "all" && (
                    <section>
                        <h2 className="text-2xl font-bold mb-8">Guidance for Every Stage</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {CAREER_STAGES.map(stage => (
                                <CareerStageCard key={stage.id} {...stage} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Expert Tips */}
                {!searchQuery && activeCategory === "all" && (
                    <section className="bg-primary/5 -mx-4 sm:-mx-6 px-4 sm:px-6 py-16">
                        <div className="max-w-7xl mx-auto">
                            <h2 className="text-2xl font-bold mb-10 text-center">Expert Tips</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {EXPERT_TIPS.map(tip => (
                                    <Card key={tip.id} className="bg-background border-none shadow-md relative overflow-visible mt-6 md:mt-0">
                                        <div className="absolute -top-6 left-6 bg-primary text-primary-foreground p-2 rounded-xl shadow-lg">
                                            <Quote className="w-6 h-6" />
                                        </div>
                                        <CardContent className="pt-10 pb-6 px-6">
                                            <p className="text-lg font-medium leading-relaxed mb-6">
                                                "{tip.quote}"
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                                    {tip.author[0]}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">{tip.author}</div>
                                                    <div className="text-xs text-muted-foreground">{tip.role}</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="text-center pb-8">
                    <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none py-12 px-6">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-3xl font-bold">Ready to apply these insights?</h2>
                            <p className="text-slate-300 text-lg">
                                Thousand of companies are hiring for roles that match your skills.
                                Update your profile and start applying today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link href="/jobs">
                                    <Button size="lg" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                                        Explore Jobs
                                    </Button>
                                </Link>
                                <Link href="/salary">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white">
                                        Check Salary Trends
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </section>

            </main>
        </div>
    )
}

export default function CareerAdvicePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Skeleton className="h-12 w-12 rounded-full" /></div>}>
            <CareerAdviceContent />
        </Suspense>
    )
}
