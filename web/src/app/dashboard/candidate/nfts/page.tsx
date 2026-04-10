"use client"

import { motion } from "framer-motion"
import { Gem, ExternalLink, Shield, Award, User, Copy, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useState } from "react"

const mockNFTs = [
    {
        type: "profile",
        name: "Best Hiring Tool — Profile",
        symbol: "PROOF",
        image: "🪪",
        level: "Verified",
        mint: "7xKm9qR3wBnPdFaLz...",
        attributes: [
            { trait_type: "Category", value: "profile" },
            { trait_type: "Version", value: "3" },
            { trait_type: "Soulbound", value: "true" },
            { trait_type: "Issuer", value: "Best Hiring Tool" },
        ]
    },
    {
        type: "skill",
        name: "Best Hiring Tool — Rust Developer",
        symbol: "SKILL",
        image: "🦀",
        level: "Silver",
        mint: "4xBn2rT8mCdQwEaKp...",
        attributes: [
            { trait_type: "Skill", value: "Rust Programming" },
            { trait_type: "Level", value: "Silver" },
            { trait_type: "Quiz Score", value: "88" },
            { trait_type: "Soulbound", value: "true" },
        ]
    },
    {
        type: "skill",
        name: "Best Hiring Tool — Solana Expert",
        symbol: "SKILL",
        image: "⚡",
        level: "Gold",
        mint: "9jRk5sN7vYeWzLfMb...",
        attributes: [
            { trait_type: "Skill", value: "Solana Development" },
            { trait_type: "Level", value: "Gold" },
            { trait_type: "Quiz Score", value: "92" },
            { trait_type: "Soulbound", value: "true" },
        ]
    },
    {
        type: "skill",
        name: "Best Hiring Tool — TypeScript Pro",
        symbol: "SKILL",
        image: "💎",
        level: "Silver",
        mint: "2pFm8kL4cXrNbDhGq...",
        attributes: [
            { trait_type: "Skill", value: "TypeScript" },
            { trait_type: "Level", value: "Silver" },
            { trait_type: "Quiz Score", value: "85" },
            { trait_type: "Soulbound", value: "true" },
        ]
    },
    {
        type: "skill",
        name: "Best Hiring Tool — Python Dev",
        symbol: "SKILL",
        image: "🐍",
        level: "Gold",
        mint: "6wTn3jQ9aKrVpEsFm...",
        attributes: [
            { trait_type: "Skill", value: "Python" },
            { trait_type: "Level", value: "Gold" },
            { trait_type: "Quiz Score", value: "91" },
            { trait_type: "Soulbound", value: "true" },
        ]
    },
    {
        type: "achievement",
        name: "First Job Achievement",
        symbol: "ACHV",
        image: "🏆",
        level: "Milestone",
        mint: "8cVk1mB6xHsWdJyNp...",
        attributes: [
            { trait_type: "Category", value: "achievement" },
            { trait_type: "Achievement", value: "First Hire" },
            { trait_type: "Soulbound", value: "true" },
        ]
    },
    {
        type: "achievement",
        name: "5 Projects Verified",
        symbol: "ACHV",
        image: "📦",
        level: "Milestone",
        mint: "5aGn4pR2wMtYkLdCz...",
        attributes: [
            { trait_type: "Category", value: "achievement" },
            { trait_type: "Achievement", value: "Portfolio Pioneer" },
            { trait_type: "Soulbound", value: "true" },
        ]
    },
]

const levelColors: Record<string, string> = {
    Gold: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
    Silver: "from-gray-400/20 to-gray-500/5 border-gray-400/20",
    Platinum: "from-cyan-400/20 to-cyan-500/5 border-cyan-400/20",
    Bronze: "from-orange-600/20 to-orange-700/5 border-orange-600/20",
    Verified: "from-primary/20 to-primary/5 border-primary/20",
    Milestone: "from-violet-500/20 to-violet-600/5 border-violet-500/20",
}

const typeIcons: Record<string, any> = {
    profile: User,
    skill: Shield,
    achievement: Award,
}

export default function NFTCredentialsPage() {
    const [filter, setFilter] = useState<"all" | "profile" | "skill" | "achievement">("all")
    const [flipped, setFlipped] = useState<string | null>(null)

    const filtered = filter === "all" ? mockNFTs : mockNFTs.filter(n => n.type === filter)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
                    <Gem className="w-8 h-8 text-primary" />
                    NFT Credentials
                </motion.h1>
                <p className="text-muted-foreground text-sm">{mockNFTs.length} Soulbound tokens on Solana Devnet.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {(["all", "profile", "skill", "achievement"] as const).map(f => (
                    <Button
                        key={f}
                        variant={filter === f ? "default" : "outline"}
                        onClick={() => setFilter(f)}
                        className={cn("rounded-xl capitalize text-sm", filter !== f && "border-white/10 bg-white/5")}
                        size="sm"
                    >
                        {f === "all" ? `All (${mockNFTs.length})` : `${f} (${mockNFTs.filter(n => n.type === f).length})`}
                    </Button>
                ))}
            </div>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((nft, i) => {
                    const isFlipped = flipped === nft.mint
                    const TypeIcon = typeIcons[nft.type]

                    return (
                        <motion.div
                            key={nft.mint}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="perspective-1000"
                        >
                            <div
                                onClick={() => setFlipped(isFlipped ? null : nft.mint)}
                                className={cn(
                                    "relative p-6 rounded-2xl border bg-gradient-to-br backdrop-blur-md cursor-pointer transition-all duration-500 hover:shadow-lg min-h-[220px] flex flex-col",
                                    levelColors[nft.level] || "from-white/5 to-white/[0.02] border-white/10"
                                )}
                            >
                                {!isFlipped ? (
                                    /* Front Face */
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-start justify-between">
                                            <span className="text-4xl">{nft.image}</span>
                                            <div className="flex items-center gap-1">
                                                <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider">{nft.symbol}</Badge>
                                            </div>
                                        </div>
                                        <div className="mt-auto space-y-2 pt-6">
                                            <h3 className="text-sm font-bold">{nft.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <TypeIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground capitalize">{nft.type}</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 font-bold">{nft.level}</span>
                                            </div>
                                        </div>
                                        <p className="text-[9px] text-muted-foreground/40 mt-2">Click to view attributes</p>
                                    </div>
                                ) : (
                                    /* Back Face: Attributes */
                                    <div className="flex flex-col h-full">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Metadata</h4>
                                        <div className="space-y-2 flex-1">
                                            {nft.attributes.map((attr, j) => (
                                                <div key={j} className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">{attr.trait_type}</span>
                                                    <span className="font-bold">{attr.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 rounded-xl text-xs border-white/10"
                                                onClick={(e) => { e.stopPropagation(); window.open(`https://explorer.solana.com/address/${nft.mint}?cluster=devnet`, "_blank") }}
                                            >
                                                <ExternalLink className="w-3 h-3 mr-1" />Verify
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 rounded-xl text-xs border-white/10"
                                                onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`https://this-best-hiring-tool.ai/verify/${nft.mint}`); toast.success("Share link copied!") }}
                                            >
                                                <Share2 className="w-3 h-3 mr-1" />Share
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
