"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { TalentFilters } from "@/components/features/talent/talent-filters"
import { TalentCard } from "@/components/features/talent/talent-card"
import { TalentSkeleton } from "@/components/features/talent/talent-skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Filter, SlidersHorizontal, Upload, Loader2, Sparkles, X } from "lucide-react"
import { publicApi } from "@/lib/api/public-api"
import { toast } from "sonner"

// --- Mock API Fetcher ---
interface FetchParams {
    query?: string
    role?: string[]
    skills?: string[]
    loc?: string[]
    exp?: string[]
    availability?: string[]
    page?: number
    limit?: number
}

const fetchTalentFromApi = async (params: FetchParams) => {
    const searchParams = new URLSearchParams()
    if (params.query) searchParams.set("query", params.query)
    if (params.skills) searchParams.set("skills", params.skills.join(","))
    if (params.loc) searchParams.set("location", params.loc.join(","))
    
    const response = await publicApi.search.candidates(searchParams.toString())
    
    // Map backend search results to Talent frontend model
    const data = response.candidates.map((c: any) => ({
        id: c.user_id,
        name: c.full_name,
        title: c.headline || "Professional",
        role: c.primary_role || "Developer",
        avatar: "", // Add default or fetch from profile
        location: c.location || "Remote",
        experience: `${c.experience_years || 0} Years`,
        experienceLevel: (c.experience_years || 0) > 5 ? "Senior" : "Intermediate",
        skills: c.skills || [],
        availability: "Immediate",
        completion: c.profile_score || 80,
        verified: c.is_verified || false,
        match_score: c.match_score
    }))

    return {
        data,
        meta: { total: data.length, totalPages: 1, page: 1, limit: 10 }
    }
}

// --- Main Content Component ---
function TalentContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const page = Number(searchParams.get("page")) || 1
    const query = searchParams.get("query") || ""

    const [isMatching, setIsMatching] = useState(false)
    const [matchedTalent, setMatchedTalent] = useState<any[] | null>(null)

    const updateSearch = (term: string) => {
        setMatchedTalent(null)
        const params = new URLSearchParams(searchParams.toString())
        if (term) params.set("query", term)
        else params.delete("query")
        params.set("page", "1")
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const handleJdMatch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        const file = e.target.files[0]
        
        setIsMatching(true)
        const toastId = toast.loading("AI Foreman initiating AST neural matching...")
        
        try {
            const res = await publicApi.ai.matchByJd(file)
            const mapped = res.matches.map((c: any) => ({
                id: c.user_id,
                name: c.full_name,
                title: c.headline || "Professional",
                role: c.primary_role || "Developer",
                avatar: "",
                location: c.location || "Remote",
                experience: `${c.experience_years || 0} Years`,
                experienceLevel: (c.experience_years || 0) > 5 ? "Senior" : "Intermediate",
                skills: c.skills || [],
                availability: "Immediate",
                completion: c.profile_score || 80,
                verified: c.is_verified || false,
                match_score: c.match_score
            }))
            setMatchedTalent(mapped)
            toast.success("Resonance found. Displaying top candidates.", { id: toastId })
        } catch (err) {
            toast.error("Forensic match failed. Verify PDF integrity.", { id: toastId })
        } finally {
            setIsMatching(false)
        }
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ["talent", searchParams.toString()],
        queryFn: () => fetchTalentFromApi({
            query: searchParams.get("query") || undefined,
            role: searchParams.get("role")?.split(",") || undefined,
            loc: searchParams.get("loc")?.split(",") || undefined,
            exp: searchParams.get("exp")?.split(",") || undefined,
            availability: searchParams.get("availability")?.split(",") || undefined,
            skills: searchParams.get("skills")?.split(",") || undefined,
            page: page,
            limit: 9
        }),
        enabled: !matchedTalent,
        staleTime: 5000 
    })

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", newPage.toString())
        router.push(`${pathname}?${params.toString()}`, { scroll: true })
    }

    return (
        <div className="min-h-screen flex flex-col pt-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
            
            {/* Page Header */}
            <div className="bg-background/80 backdrop-blur-xl border-b border-white/5 pt-16 pb-12 px-4 sm:px-8 sticky top-16 z-20">
                <div className="container mx-auto max-w-7xl space-y-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                        <div className="space-y-4">
                            <h1 className="text-6xl font-black font-heading tracking-tighter italic uppercase leading-none">Neural Talent Synthesis</h1>
                            <div className="flex items-center gap-4">
                                <div className="h-px w-24 bg-primary" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Connect with high-resonance verified technical nodes</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full md:w-auto">
                            <div className="w-full md:w-[400px] relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search by Identity, Node, or Skill Stack..."
                                    className="pl-12 h-14 glass border-white/5 focus:border-primary/30 transition-all rounded-2xl font-bold placeholder:text-white/10"
                                    defaultValue={query}
                                    onChange={(e) => updateSearch(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block h-10 w-px bg-white/5 mx-2" />
                                <Button 
                                    variant="premium"
                                    className="h-14 px-8 rounded-2xl shadow-2xl shadow-primary/20 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                                    disabled={isMatching}
                                    onClick={() => document.getElementById("jd-upload")?.click()}
                                >
                                    {isMatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    Match by Spec (JD)
                                </Button>
                                <input id="jd-upload" type="file" className="hidden" accept=".pdf" onChange={handleJdMatch} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto max-w-7xl px-4 sm:px-8 py-12 flex-1 flex flex-col lg:flex-row gap-12">
                <aside className="hidden lg:block w-80 shrink-0 space-y-10 sticky top-56 h-fit">
                    <div className="glass p-8 rounded-[2.5rem] border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Neural Filters</h3>
                            <SlidersHorizontal className="w-4 h-4 text-white/20" />
                        </div>
                        <TalentFilters />
                    </div>
                </aside>

                <div className="flex-1 w-full min-w-0">
                    {(isLoading || isMatching) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <TalentSkeleton key={i} />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-32 glass rounded-[3rem] border-rose-500/10">
                            <X className="w-12 h-12 text-rose-500/20 mx-auto mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-rose-500/50">Core Data Retrieval Fault</p>
                        </div>
                    ) : (matchedTalent || data?.data) && (matchedTalent?.length || 0) > 0 || (data?.data?.length || 0) > 0 ? (
                        <div className="space-y-12">
                            {matchedTalent && (
                                <div className="flex items-center justify-between p-8 glass border-primary/20 rounded-[2.5rem] animate-in fade-in slide-in-from-top-6 duration-700 shadow-2xl shadow-primary/5">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center shadow-inner">
                                            <Sparkles className="w-8 h-8 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Spec Resonance Match</h2>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Identified {matchedTalent.length} high-fidelity technical intersections.</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white/5 text-white/20" onClick={() => setMatchedTalent(null)}>
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {(matchedTalent || data?.data)?.map((talent: any) => (
                                    <TalentCard key={talent.id} talent={talent} />
                                ))}
                            </div>

                            {!matchedTalent && (
                                <div className="pt-12 flex items-center justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-12 px-6 rounded-xl border-white/5 glass font-black text-[10px] uppercase tracking-widest"
                                        disabled={page <= 1}
                                        onClick={() => handlePageChange(page - 1)}
                                    >
                                        Previous Cycle
                                    </Button>
                                    <div className="px-6 h-12 flex items-center glass rounded-xl border-white/5 text-[10px] font-black uppercase tracking-widest">
                                        Layer {page} <span className="text-white/20 mx-2">/</span> {data?.meta.totalPages || 1}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="h-12 px-6 rounded-xl border-white/5 glass font-black text-[10px] uppercase tracking-widest"
                                        disabled={page >= (data?.meta.totalPages || 1)}
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        Next Cycle
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center glass border-dashed border-white/10 rounded-[3rem]">
                            <div className="w-24 h-24 bg-white/[0.03] rounded-full flex items-center justify-center mb-8 shadow-inner">
                                <Search className="w-10 h-10 text-white/10" />
                            </div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">No Resonance Detected</h3>
                            <p className="text-[11px] font-black uppercase tracking-widest text-white/20 max-w-sm mb-10">
                                Current search parameters yielded no high-fidelity intersections.
                            </p>
                            <Button
                                variant="outline"
                                className="h-12 px-10 rounded-2xl border-white/10 font-black text-[10px] uppercase tracking-[0.2em]"
                                onClick={() => router.push(pathname)}
                            >
                                RESET NEURAL FILTERS
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default function TalentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><TalentSkeleton /></div>}>
            <TalentContent />
        </Suspense>
    )
}
