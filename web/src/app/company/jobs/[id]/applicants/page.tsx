"use client"

import { useQuery, useMutation } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api/api-client"
import { useAuth } from "@/context/auth-context"
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { 
    Loader2, 
    Users, 
    BrainCircuit, 
    ShieldCheck, 
    Zap, 
    ArrowRight,
    Search,
    UserCircle,
    CheckCircle2,
    XCircle,
    Cpu,
    Activity
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function PersonnelResonanceArchive() {
    const { id } = useParams() // job_id
    const { user } = useAuth()
    const router = useRouter()

    // 1. Fetch Company Info (to get companyId)
    const { data: company } = useQuery({
        queryKey: ["companyProfile"],
        queryFn: () => api.company.get(),
    })

    // 2. Fetch Job Details
    const { data: job, isLoading: jobLoading } = useQuery({
        queryKey: ["jobDetail", id],
        queryFn: () => api.jobs.details(id as string),
        enabled: !!id
    })

    // 3. Fetch Applicants for this Job
    const { data: applicants, isLoading: appsLoading, refetch } = useQuery({
        queryKey: ["jobApplicants", id, company?.id],
        queryFn: () => api.applications.company(company?.id as string, id as string),
        enabled: !!company?.id && !!id
    })

    // 4. Update Status Mutation
    const statusMutation = useMutation({
        mutationFn: ({ appId, status }: { appId: string, status: string }) => 
            api.applications.updateStatus(appId, status),
        onSuccess: () => {
            toast.success("Personnel state updated successfully.")
            refetch()
        },
        onError: (err: any) => {
            toast.error(`State update failed: ${err.message}`)
        }
    })

    const calculateFinalResonance = (matchScore: number, assessmentScore: number | null) => {
        if (assessmentScore === null) return matchScore * 0.4
        return (matchScore * 0.4) + (assessmentScore * 0.6)
    }

    if (jobLoading || appsLoading) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6">
                <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40">Synthesizing Archive Stream...</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
            {/* Archive Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 font-black tracking-widest text-[9px] uppercase">
                            Mission Archive: Live
                        </Badge>
                        <span className="text-white/20 text-[10px] font-black uppercase tracking-widest italic">{job?.title}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tighter uppercase italic text-white leading-none">
                        Personnel <span className="text-primary text-opacity-80">Resonance</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl font-medium italic">
                        The ultimate truth table. Comparing initial AI matching signals against real-time skill challenge responses.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-14 px-8 bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-primary/40 font-black tracking-widest uppercase text-[10px] rounded-2xl gap-3">
                        <Search className="w-4 h-4 text-primary" /> Multi-Scan Mode
                    </Button>
                </div>
            </div>

            {/* Application Matrix */}
            <Card className="bg-[#0a0a0a] border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <CardHeader className="p-10 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                                <Users className="w-6 h-6 text-primary" /> Active Cohort
                            </CardTitle>
                            <CardDescription className="text-xs uppercase font-black tracking-widest text-white/30 italic">Targeting strategic position: {job?.title}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {!applicants || applicants.length === 0 ? (
                        <div className="py-24 text-center">
                            <Users className="w-16 h-16 text-white/5 mx-auto mb-4" />
                            <p className="text-white/20 font-black italic text-lg tracking-tight uppercase">No personnel detected in the resonance pipeline.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-white/[0.01]">
                                <TableRow className="border-white/5 h-16">
                                    <TableHead className="pl-10 font-black uppercase text-[10px] tracking-widest text-white/40">Candidate Detail</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-white/40 text-center">AI Sync</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-white/40 text-center">Live Quiz</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-white/40 text-center">Final Resonance</TableHead>
                                    <TableHead className="pr-10 font-black uppercase text-[10px] tracking-widest text-white/40 text-right">Synthesis Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applicants.map((app: any) => {
                                    const finalRes = calculateFinalResonance(app.ai_match_score || 0, app.assessment_score || null)
                                    const isShortlisted = app.status === 'shortlisted'
                                    
                                    return (
                                        <TableRow key={app.id} className="border-white/5 group hover:bg-white/[0.02] transition-colors h-24">
                                            <TableCell className="pl-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary/40 font-black group-hover:scale-110 transition-transform">
                                                        <UserCircle className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg text-white group-hover:text-primary transition-colors leading-none mb-1">{app.users?.full_name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                            <p className="text-[10px] font-mono font-bold text-white/30 lowercase tracking-tighter">
                                                                {app.users?.wallet_address?.slice(0, 6)}...{app.users?.wallet_address?.slice(-4)}
                                                            </p>
                                                            {app.users?.user_identities?.id_status === 'verified' && (
                                                                <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                                                    <ShieldCheck className="w-2.5 h-2.5 text-primary" />
                                                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary">Verified</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="text-2xl font-black text-white/60 group-hover:text-white transition-colors">{app.ai_match_score || 0}%</span>
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">Profile Logic</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className={cn(
                                                    "inline-flex flex-col items-center",
                                                    app.assessment_score === null ? "opacity-20 flex-col items-center gap-1" : ""
                                                )}>
                                                    {app.assessment_score !== null ? (
                                                        <>
                                                            <span className="text-2xl font-black text-emerald-500">{app.assessment_score}%</span>
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/30 italic">Live Proof</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Cpu className="w-5 h-5 animate-pulse" />
                                                            <span className="text-[8px] font-black uppercase tracking-widest italic">Syncing...</span>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-flex flex-col items-center bg-white/5 px-6 py-3 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                                                    <span className={cn(
                                                        "text-3xl font-black tracking-tighter leading-none mb-0.5",
                                                        finalRes >= 80 ? "text-primary" : "text-white"
                                                    )}>
                                                        {Math.round(finalRes)}%
                                                    </span>
                                                    <div className="flex items-center gap-1.5 pt-1 uppercase font-black text-[8px] tracking-[0.2em] text-white/30">
                                                        <Activity className="w-2.5 h-2.5" /> Total Resonance
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-10 text-right">
                                                <div className="flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                                                    <Button 
                                                        onClick={() => statusMutation.mutate({ appId: app.id, status: 'shortlisted' })}
                                                        disabled={isShortlisted || statusMutation.isPending}
                                                        variant="ghost" 
                                                        size="icon" 
                                                        title="Shortlist / Synthesize"
                                                        className={cn(
                                                            "h-12 w-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 group/sh",
                                                            isShortlisted ? "bg-emerald-500/20 border-emerald-500 opacity-100" : ""
                                                        )}
                                                    >
                                                        <CheckCircle2 className={cn("w-5 h-5", isShortlisted ? "text-emerald-500" : "text-white/40 group-hover/sh:text-emerald-500")} />
                                                    </Button>
                                                    <Button 
                                                        onClick={() => statusMutation.mutate({ appId: app.id, status: 'rejected' })}
                                                        disabled={statusMutation.isPending}
                                                        variant="ghost" 
                                                        size="icon" 
                                                        title="Archive / De-Sync"
                                                        className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 group/de"
                                                    >
                                                        <XCircle className="w-5 h-5 text-white/40 group-hover/de:text-rose-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20">
                                                        <Link href={`/company/talent`}>
                                                            <ArrowRight className="w-5 h-5 text-primary" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Neural Summary Footer */}
            <div className="flex flex-col items-center gap-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 py-10">
                <div className="h-px w-96 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="flex gap-12 items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                    <span className="flex items-center gap-3"><Zap className="w-4 h-4 text-primary" /> Multi-Tenant Resonance Analysis</span>
                    <span className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-primary" /> Solana ID Verification v2.4</span>
                    <span className="flex items-center gap-3"><BrainCircuit className="w-4 h-4 text-primary" /> Weighted Synthesis Logic</span>
                </div>
                <p className="text-xs italic max-w-2xl text-center opacity-60">
                    "The Personnel Resonance Archive provides an uncompromising view of global talent. By weighting live assessments over profile claims, we've reduced hiring fraud by 98% across the Solana nexus."
                </p>
            </div>
        </div>
    )
}
