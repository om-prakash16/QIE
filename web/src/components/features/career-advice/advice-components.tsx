"use client"

export function CategoryCard({ title }: { title: string }) {
    return (
        <div className="p-4 border border-white/5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <h5 className="text-[10px] font-black uppercase tracking-widest">{title}</h5>
        </div>
    )
}

export function CareerStageCard({ stage }: { stage: string }) {
    return (
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <h5 className="font-bold text-sm mb-1">{stage}</h5>
            <p className="text-[10px] text-white/30 uppercase font-black">Optimization Path</p>
        </div>
    )
}
