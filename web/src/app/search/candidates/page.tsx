"use client";

import { useState, useEffect } from "react";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { SortDropdown } from "@/components/search/SortDropdown";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Zap, MapPin, GraduationCap, ArrowRight, Loader2, Star } from "lucide-react";
import Link from "next/link";

export default function CandidateDiscovery() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/search/candidates`);
      const data = await res.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-24 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
           <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 uppercase tracking-tighter font-black italic">
             RECRUITER DISCOVERY ENGINE
           </Badge>
           <h1 className="text-6xl font-black font-heading tracking-tighter italic">Discover Top Talent.</h1>
           <p className="text-muted-foreground max-w-2xl italic">Real-time candidate discovery powered by AI Proof Scores and verified technical credentials.</p>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-500" />
                <Input 
                    placeholder="Search by skill, name, or professional summary..." 
                    className="h-14 bg-white/5 border-white/10 pl-16 text-xl focus-visible:ring-primary/50 transition-all rounded-2xl"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <SortDropdown type="candidates" onSortChange={(s) => console.log(s)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
                <FilterSidebar type="candidates" onFilterChange={(f) => console.log(f)} />
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3">
                {isLoading ? (
                    <div className="py-24 flex justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {candidates.map(candidate => (
                            <CandidateCard key={candidate.id} data={candidate} />
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ data }: { data: any }) {
    return (
        <Card className="bg-[#050505] border-white/10 hover:border-primary/50 transition-all duration-500 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users className="w-20 h-20 text-white" />
            </div>
            
            <CardHeader className="space-y-4">
                <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-2xl text-primary group-hover:bg-primary/10 transition-colors">
                        {data.full_name?.[0] || 'U'}
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">AI Proof Score</p>
                        <p className="text-3xl font-black text-emerald-500 italic flex items-center justify-end gap-1">
                            <Zap className="w-4 h-4 fill-emerald-500" /> {data.proof_score || 0}
                        </p>
                    </div>
                </div>
                <div>
                    <CardTitle className="text-2xl font-black italic tracking-tighter">{data.full_name || 'Anonymous professional'}</CardTitle>
                    <CardDescription className="text-neutral-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {data.location || 'Remote-first'}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                    {data.skills?.slice(0, 4).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-white/5 text-[10px] text-neutral-300 border-white/10 uppercase italic font-bold">
                            {skill}
                        </Badge>
                    ))}
                    {data.skills?.length > 4 && (
                        <span className="text-[10px] text-neutral-600 font-bold">+{data.skills.length - 4} MORE</span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Experience</p>
                        <p className="text-xs font-bold text-neutral-400 italic">Mid-level</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Verifications</p>
                        <div className="flex gap-1">
                           <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                           <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                           <Star className="w-3 h-3 text-neutral-800" />
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2">
                <Link href={`/u/${data.id}`} className="w-full">
                    <Button className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-black tracking-tight italic">
                        VIEW PROFILE <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
