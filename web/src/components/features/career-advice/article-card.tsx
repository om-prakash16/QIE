"use client"

export function ArticleCard({ article }: { article: any }) {
    return (
        <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">
            <h4 className="font-bold text-sm mb-2">{article?.title || "Career Strategy Insight"}</h4>
            <p className="text-[10px] text-white/40 italic">Deep-dive technical career telemetry...</p>
        </div>
    )
}
