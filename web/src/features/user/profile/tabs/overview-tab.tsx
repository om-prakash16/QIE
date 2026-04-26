import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/types/profile"
import { ArrowRight, Star, Clock } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"

interface OverviewTabProps {
    data: any
    isEditing?: boolean
    onUpdateBio?: (bio: string) => void
}

export function OverviewTab({ data, isEditing, onUpdateBio }: OverviewTabProps) {
    return (
        <div className="grid gap-10 lg:grid-cols-3">
            {/* Summary Section */}
            <div className="lg:col-span-2 space-y-10">
                <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <CardHeader className="pt-10 px-10">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight">Neural Synthesis</CardTitle>
                    </CardHeader>
                    <CardContent className="px-10 pb-12">
                        {isEditing ? (
                            <Textarea
                                defaultValue={data.basic.bio}
                                onChange={(e) => onUpdateBio?.(e.target.value)}
                                className="min-h-[160px] glass border-white/10 rounded-[2rem] focus:ring-primary/30 p-8 text-sm leading-relaxed"
                            />
                        ) : (
                            <p className="text-white/60 leading-[1.8] text-sm font-medium italic">
                                {data.basic.bio}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-10">
                    <Card className="glass border-white/5 rounded-[2.5rem]">
                        <CardHeader className="pt-8 px-8">
                            <CardTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2">
                                <Star className="w-4 h-4 text-primary" /> Core Architecture
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-10">
                            <div className="flex flex-wrap gap-2">
                                {data.skills.filter((s: any) => s.level === "Advanced").slice(0, 8).map((skill: any) => (
                                    <Badge key={skill.name} variant="outline" className="glass py-1.5 px-4 text-[9px] font-black uppercase tracking-widest text-primary border-primary/20 rounded-full">
                                        {skill.name}
                                    </Badge>
                                ))}
                                {data.skills.filter((s: any) => s.level === "Advanced").length === 0 && (
                                    <p className="text-[10px] text-white/20 italic font-black uppercase tracking-widest">No advanced nodes detected.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-white/5 rounded-[2.5rem]">
                        <CardHeader className="pt-8 px-8">
                            <CardTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2">
                                <ArrowRight className="w-4 h-4 text-primary" /> Active Proofs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-10 space-y-6">
                            {data.experience.slice(0, 2).map((exp: any) => (
                                <div key={exp.id} className="flex gap-4 items-start group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 font-black text-primary/40 text-[10px] group-hover:scale-110 transition-transform">
                                        {exp.company.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm text-white/90 truncate">{exp.role}</p>
                                        <p className="text-[10px] text-white/30 uppercase font-black tracking-widest truncate">{exp.company}</p>
                                    </div>
                                </div>
                            ))}
                            {data.experience.length === 0 && (
                                <p className="text-[10px] text-white/20 italic font-black uppercase tracking-widest">Awaiting work history synthesis...</p>
                            )}
                            <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                                Access Full Ledger <ArrowRight className="w-3 h-3 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Sidebar Activity */}
            <div className="space-y-10">
                <Card className="glass border-white/5 rounded-[2.5rem]">
                    <CardHeader className="pt-8 px-8">
                        <CardTitle className="text-sm font-black uppercase italic tracking-[0.1em] flex items-center gap-3">
                            <Clock className="w-4 h-4 text-primary" />
                            Signal History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-10 space-y-6">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-white/80">Applied to Senior Frontend Engineer</p>
                            <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Acme Corp • 2 days ago</p>
                        </div>
                        <div className="space-y-1 pt-4 border-t border-white/5">
                            <p className="text-xs font-bold text-white/80">Updated Architecture Section</p>
                            <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Added Docker • 5 days ago</p>
                        </div>
                        <div className="space-y-1 pt-4 border-t border-white/5">
                            <p className="text-xs font-bold text-white/80">Entity Intercepted Profile</p>
                            <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Linear • 1 week ago</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5 rounded-[2.5rem]">
                    <CardHeader className="pt-8 px-8">
                        <CardTitle className="text-sm font-black uppercase italic tracking-[0.1em]">
                            Protocol Metadata
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-10 space-y-8">
                        <div className="space-y-3">
                            <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Lingual Nodes</p>
                            <div className="flex flex-wrap gap-2">
                                {data.basic.languages?.map((lang: any) => (
                                    <Badge key={lang} variant="outline" className="glass py-1 px-3 text-[9px] font-black uppercase text-white/60 border-white/10 rounded-lg">{lang}</Badge>
                                )) || <Badge variant="outline" className="glass py-1 px-3 text-[9px] font-black uppercase text-white/60 border-white/10 rounded-lg">English</Badge>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Genesis Date</p>
                                <p className="text-xs font-bold text-white/80">{data.basic.joinDate || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Link Mode</p>
                                <p className="text-xs font-bold text-white/80">{data.basic.jobType}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">Encrypted Comms</p>
                            <p className="text-xs font-bold text-white/80 break-all">{data.basic.email}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
