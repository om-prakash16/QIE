"use client"

import { Badge } from "@/components/ui/badge"

export function CompanyHeader({ company }: { company: any }) {
    return (
        <div className="py-10 border-b border-white/5 space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-black text-2xl uppercase italic">
                    {company?.name?.[0] || "C"}
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">{company?.name || "Target Organization"}</h1>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="text-[9px] uppercase font-black">Verified Member</Badge>
                        <Badge variant="outline" className="text-[9px] uppercase font-black bg-primary/5 text-primary border-primary/20 italic">Elite Recruiter</Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}
