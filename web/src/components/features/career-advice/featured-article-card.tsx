"use client"

export function FeaturedArticleCard({ article }: { article: any }) {
    return (
        <div className="p-8 border border-primary/20 rounded-3xl bg-primary/5">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-4 block">Hiring Spotlight</span>
            <h3 className="text-2xl font-black tracking-tighter italic mb-4">{article?.title || "Mastering the Solana Ecosystem"}</h3>
            <p className="text-xs text-white/60 mb-6 italic">Strategy and telemetry for elite Web3 engineering roles.</p>
        </div>
    )
}
