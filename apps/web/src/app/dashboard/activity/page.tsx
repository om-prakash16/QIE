"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
    Clock, 
    User, 
    Briefcase, 
    Award, 
    Settings, 
    ShieldCheck, 
    ExternalLink 
} from "lucide-react"
import { cn } from "@/lib/utils"

const mockLogs = [
    {
        id: "1",
        action: "NFT Minted",
        type: "nft",
        entity: "React Developer SBT",
        description: "Successfully minted verified skill certificate on Solana.",
        txHash: "5vG...9xZ",
        timestamp: "Apr 05, 2026 11:20 AM"
    },
    {
        id: "2",
        action: "Job Applied",
        type: "job",
        entity: "Senior Rust Engineer",
        description: "Applied to 'Solana Foundation' with AI match score: 94%.",
        timestamp: "Apr 04, 2026 09:45 PM"
    },
    {
        id: "3",
        action: "Profile Updated",
        type: "user",
        entity: "Personal Profile",
        description: "Updated professional experience and GitHub link.",
        timestamp: "Apr 04, 2026 02:15 PM"
    },
    {
        id: "4",
        action: "Skill Verified",
        type: "verify",
        entity: "Node.js Assessment",
        description: "Passed AI technical assessment with Advanced proficiency.",
        timestamp: "Apr 03, 2026 10:05 AM"
    }
]

export default function ActivityPage() {
    return (
        <div className="container max-w-5xl py-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Activity History</h1>
                <p className="text-muted-foreground">Track all your platform actions and verifiable proofs.</p>
            </div>

            <Card className="border-primary/10 bg-background/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl">Platform Audit Trail</CardTitle>
                    <CardDescription>Immutable record of your hiring journey and skill proofing.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                        <div className="flex flex-col">
                            {mockLogs.map((log) => (
                                <div key={log.id} className="flex items-start gap-4 p-6 border-b last:border-0 hover:bg-muted/30 transition-all">
                                    <div className={cn(
                                        "mt-1 p-2.5 rounded-xl",
                                        log.type === 'nft' && "bg-purple-500/10 text-purple-600",
                                        log.type === 'job' && "bg-blue-500/10 text-blue-600",
                                        log.type === 'user' && "bg-orange-500/10 text-orange-600",
                                        log.type === 'verify' && "bg-green-500/10 text-green-600",
                                    )}>
                                        {log.type === 'nft' && <Award className="h-5 w-5" />}
                                        {log.type === 'job' && <Briefcase className="h-5 w-5" />}
                                        {log.type === 'user' && <User className="h-5 w-5" />}
                                        {log.type === 'verify' && <ShieldCheck className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold">{log.action}: {log.entity}</h4>
                                                {log.txHash && (
                                                    <Badge variant="outline" className="text-[10px] font-mono cursor-pointer hover:bg-primary/5">
                                                        {log.txHash} <ExternalLink className="ml-1 h-3 w-3" />
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                                <Clock className="h-3 w-3" />
                                                {log.timestamp}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {log.description}
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
