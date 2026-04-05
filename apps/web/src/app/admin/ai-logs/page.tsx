"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
    Cpu, 
    Zap, 
    BarChart3, 
    Search, 
    Filter,
    Terminal,
    DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"

const mockAILogs = [
    {
        id: "1",
        user: "om-prakash",
        operation: "Job Matching (Vector Search)",
        model: "text-embedding-3-small",
        status: "complete",
        tokens: 450,
        result: "Matched 15 candidates for 'Senior Rust Engineer' (Threshold: 0.75)",
        time: "10 min ago"
    },
    {
        id: "2",
        user: "jane-doe",
        operation: "Resume Parsing",
        model: "gpt-4o",
        status: "complete",
        tokens: 1200,
        result: "Extracted 12 skills, 3 roles from 'resume_v2.pdf'",
        time: "25 min ago"
    },
    {
        id: "3",
        user: "system",
        operation: "Quiz Generation",
        model: "gpt-4o",
        status: "complete",
        tokens: 2100,
        result: "Generated 10 unique technical questions for 'Solana/Anchor'",
        time: "45 min ago"
    }
]

export default function AdminAILogs() {
    return (
        <div className="container max-w-6xl py-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI System Logs</h1>
                    <p className="text-muted-foreground">Monitor LLM performance, matching accuracy, and operational costs.</p>
                </div>
                <div className="flex gap-3">
                    <Badge variant="outline" className="h-9 px-4 flex gap-2">
                        <BarChart3 className="h-4 w-4" /> Global Efficiency: 92%
                    </Badge>
                    <Badge variant="outline" className="h-9 px-4 flex gap-2 text-primary font-bold">
                        <DollarSign className="h-4 w-4" /> Avg Cost/Match: $0.012
                    </Badge>
                </div>
            </div>

            <Card className="border-primary/20 bg-background/50 backdrop-blur-md shadow-2xl shadow-primary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <div className="space-y-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-primary" /> System Execution Trail
                        </CardTitle>
                        <CardDescription>Real-time audit of semantic matching and skill evaluation engines.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[650px]">
                        <div className="flex flex-col">
                            {mockAILogs.map((log) => (
                                <div key={log.id} className="p-6 border-b last:border-0 hover:bg-primary/[0.02] group transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                                                <Cpu className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg">{log.operation}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                                                        {log.model}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground border-l pl-2">User: {log.user}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs font-mono text-muted-foreground">{log.time}</span>
                                            <div className="flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/5 px-2 py-0.5 rounded-full">
                                                <Zap className="h-3 w-3" /> {log.tokens} tokens
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                        <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                                            <span className="text-primary/70">{'>'}</span> {log.result}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
