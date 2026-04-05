import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Briefcase, TrendingUp, Zap, Target, Layers, Loader2 } from "lucide-react"
import { GithubRepo } from "@/lib/mock-api/github-data"
import { generateAnalysisReport } from "@/lib/utils/github-analysis-generator"
import { useMemo } from "react"
import { MOCK_GITHUB_ANALYSIS } from "@/lib/mock-api/github-analysis"

interface GithubAnalysisProps {
    repos?: GithubRepo[]
}

export function GithubAnalysis({ repos }: GithubAnalysisProps) {

    const report = useMemo(() => {
        if (!repos || repos.length === 0) return MOCK_GITHUB_ANALYSIS;
        return generateAnalysisReport(repos);
    }, [repos]);

    if (!report) return null;

    return (
        <Card className="bg-gradient-to-br from-muted/50 to-muted/10 border-primary/20">
            <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">AI Technical Evaluation</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
                {/* 1. Executive Summary */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Target className="w-4 h-4" /> Executive Summary
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground/90">
                        {report.executiveSummary}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* 2. Core Strengths */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Core Strengths
                        </h4>
                        <ul className="space-y-2">
                            {report.technicalStrengths.map((strength, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 5. Role & Seniority */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Role & Fit
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm p-2 bg-muted/40 rounded border">
                                <span className="text-muted-foreground">Best Fit</span>
                                <span className="font-medium text-right">{report.roleFit.bestFitRole}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Architecture Signals */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Architecture Signals
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {report.architectureSignals.map((signal) => (
                            <div key={signal.label} className="p-3 rounded-lg border bg-card/50 space-y-1">
                                <div className="text-xs text-muted-foreground">{signal.label}</div>
                                <div className="font-semibold text-sm">{signal.value}</div>
                                <div className="text-[10px] text-muted-foreground leading-tight mt-1 opacity-80">
                                    {signal.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 8. Growth Recommendations */}
                <div className="space-y-3 pt-2 border-t border-border/50">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mt-4">
                        <TrendingUp className="w-4 h-4" /> Growth Trajectory
                    </h4>
                    <div className="space-y-2">
                        {report.growthRecommendations.map((rec, i) => (
                            <div key={i} className="flex gap-3 text-sm text-muted-foreground p-2 hover:bg-muted/30 rounded transition-colors">
                                <span className="font-mono text-xs opacity-50">0{i + 1}</span>
                                <span>{rec}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
