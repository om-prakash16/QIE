"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Search, Filter, ArrowRight, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function JobMarketplace() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const url = user?.id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/list?user_id=${user.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/list`;
      
      const res = await fetch(url);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.companies?.company_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[180px] -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-8">
           <div className="flex justify-center">
               <Badge variant="outline" className="glass text-primary px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.4em] rounded-full border-primary/20 shadow-lg shadow-primary/10">
                 Marketplace v4.0.2 Protocol
               </Badge>
           </div>
           <h1 className="text-5xl md:text-9xl font-black font-heading tracking-tighter uppercase italic leading-[0.8] text-white">
             Find Your <br />
             <span className="text-primary not-italic">Next Impact</span>
           </h1>
           <p className="text-white/30 max-w-2xl mx-auto text-sm md:text-base font-black uppercase tracking-[0.2em] leading-relaxed">
             Browse high-fidelity roles verified by <span className="text-white">Proof Scores</span> and real-time AI matching intelligence.
           </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 glass p-4 rounded-[3rem] border-white/5 shadow-2xl">
           <div className="flex-1 relative group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-primary transition-colors" />
             <Input 
                placeholder="Filter by Role, Company, or Skill Matrix..." 
                className="bg-transparent border-none pl-16 h-16 text-xl focus-visible:ring-0 placeholder:text-white/10 font-bold text-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
             />
           </div>
           <Button className="h-16 px-10 glass border-white/10 hover:border-primary/50 text-white font-black tracking-widest uppercase text-[10px] rounded-[2rem] transition-all">
              <Filter className="w-5 h-5 mr-3 text-primary" /> Advanced Protocol
           </Button>
        </div>

        {/* Job Grid */}
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-8">
             <Loader2 className="w-12 h-12 animate-spin text-primary/50" />
             <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Synthesizing Role Intersections...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} user={user} />
            ))}
            {filteredJobs.length === 0 && (
                <div className="col-span-full py-32 text-center glass border-dashed border-white/10 rounded-[3rem]">
                    <p className="text-[11px] font-black uppercase tracking-widest text-white/20">Awaiting role deployments matching your parameters...</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job, user }: { job: any, user: any }) {
    return (
        <Card className="glass group hover:border-primary/40 transition-all duration-500 flex flex-col rounded-[3rem] overflow-hidden border-white/5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full group-hover:bg-primary/10 transition-colors" />
            
            <CardHeader className="relative overflow-hidden pt-12 px-10">
                <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-primary/40 group-hover:w-12 transition-all duration-500" />
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{job.companies?.company_name}</p>
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight leading-none text-white uppercase italic group-hover:text-primary transition-all duration-500">
                        {job.title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-10 px-10 pb-10 relative z-10">
                <div className="flex flex-wrap gap-8 text-[9px] font-black uppercase tracking-widest text-white/30">
                    <span className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary/50" /> {job.location || 'Remote Node'}</span>
                    <span className="flex items-center gap-3"><DollarSign className="w-4 h-4 text-primary/50" /> {job.salary_range || 'Competitive'}</span>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-2">
                    {job.skills_required.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="glass border-white/10 text-[9px] text-white/40 font-black uppercase tracking-widest py-1.5 px-4 rounded-xl group-hover:border-primary/20 group-hover:text-primary/60 transition-colors">
                            {skill}
                        </Badge>
                    ))}
                    {job.skills_required.length > 3 && (
                        <Badge variant="outline" className="glass border-white/5 text-[9px] text-white/20 font-black tracking-widest uppercase py-1.5 px-4 rounded-xl">
                            +{job.skills_required.length - 3}
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-10 pt-8 border-t border-white/5 mt-auto relative z-10">
                {user ? (
                   <div className="w-full flex items-center justify-between gap-6">
                      <div className="flex flex-col gap-1.5">
                         <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Resonance</span>
                         <span className={`text-2xl font-black italic flex items-center gap-3 ${
                            (job.ai_match_percentage || 0) > 70 ? 'text-emerald-400' : 'text-amber-500'
                         }`}>
                            <Zap className={`w-5 h-5 ${(job.ai_match_percentage || 0) > 70 ? 'fill-emerald-400/20' : 'fill-amber-500/20'}`} /> 
                            {job.ai_match_percentage || 0}%
                         </span>
                      </div>
                      <Link href={`/jobs/${job.id}`} className="flex-shrink-0">
                        <Button variant="premium" className="h-14 px-8 group/btn rounded-2xl text-[10px] font-black uppercase tracking-widest">
                            VIEW DETAILS <ArrowRight className="w-4 h-4 ml-3 group-hover/btn:translate-x-2 transition-transform" />
                        </Button>
                      </Link>
                   </div>
                ) : (
                   <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full h-14 border-white/10 hover:bg-white/5 font-black uppercase text-[10px] tracking-widest rounded-2xl">
                         SIGN IN TO DEPLOY
                      </Button>
                   </Link>
                )}
            </CardFooter>
        </Card>
    )
}
