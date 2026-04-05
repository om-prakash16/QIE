import { Award, Code2, Link as LinkIcon, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PageProps {
    params: {
        walletAddress: string
    }
}

// Mocking the Supabase Project Ledger query
const getLiveLedger = async (wallet: string) => {
    return [
        { id: 1, name: "DeFi Yield Aggregator", stack: ["Solana", "Rust"], score: 98, hash: "0x89ab...cd45" },
        { id: 2, name: "Zero-Knowledge Voting", stack: ["Cairo", "Next.js"], score: 92, hash: "0x12ef...89ab" },
        { id: 3, name: "AI Agent Trading Bot", stack: ["Python", "FastAPI"], score: 95, hash: "0x34cd...efa1" },
    ];
};

export default async function PublicPortfolio({ params }: PageProps) {
    const wallet = params.walletAddress;
    const ledger = await getLiveLedger(wallet);

    return (
        <div className="container mx-auto py-16 px-4">
            <div className="max-w-4xl mx-auto space-y-12">
                
                {/* Header Identity */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b">
                    <div>
                        <h1 className="text-4xl font-bold font-heading flex items-center gap-3">
                            Candidate Profile <ShieldCheck className="text-primary w-8 h-8" />
                        </h1>
                        <p className="text-muted-foreground font-mono mt-2 bg-muted/30 p-2 rounded-md tracking-wider">
                            {wallet}
                        </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <Badge variant="default" className="text-lg py-1 px-4">Level: Gold</Badge>
                        <span className="text-sm text-muted-foreground mt-2">Dynamic Web3 Skill NFT</span>
                    </div>
                </div>

                {/* Ledger Body */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Code2 className="w-6 h-6" /> Live Project Ledger
                    </h2>
                    <p className="text-muted-foreground">Immutable proof-of-work hashes verified directly via the Solana blockchain.</p>

                    <div className="grid gap-4">
                        {ledger.map(project => (
                            <div key={project.id} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow bg-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">{project.name}</h3>
                                    <div className="flex gap-2">
                                        {project.stack.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{project.score}%</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">AI Score</div>
                                    </div>
                                    <div className="h-12 w-px bg-border hidden md:block"></div>
                                    <div className="space-y-1 text-right">
                                        <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                            <LinkIcon className="w-3 h-3"/> On-Chain Hash
                                        </div>
                                        <code className="text-sm bg-muted/50 px-2 py-1 rounded">{project.hash}</code>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-center pt-8">
                    <Link href="/bounties" className="text-primary hover:underline font-semibold">
                        Hire this candidate for a Micro-Job &rarr;
                    </Link>
                </div>
            </div>
        </div>
    )
}
