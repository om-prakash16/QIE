"use client";

import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Zap, Loader2, ArrowRight, Table, CheckCircle, Clock, Calendar, Search } from "lucide-react";
import Link from "next/link";

export default function CandidateApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchApps();
  }, [user?.id]);

  const fetchApps = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/user?user_id=${user?.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
        case 'applied': return 'bg-white/5 text-white/50 border-white/10';
        case 'shortlisted': return 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.2)]';
        case 'interview': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case 'hired': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
        default: return 'bg-white/5 text-white border-white/10';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 space-y-16 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
      
      <div className="space-y-4">
        <h1 className="text-6xl font-black font-heading tracking-tighter italic uppercase leading-none">Nexus Deployment Tracking</h1>
        <div className="flex items-center gap-4">
            <div className="h-px w-24 bg-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Monitoring career resonance and pipeline synchronization</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-6">
            <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Synthesizing Application Data...</p>
        </div>
      ) : (
        <div className="space-y-8">
            {apps.length === 0 ? (
                <Card className="glass border-white/5 p-20 text-center space-y-8 rounded-[3rem]">
                    <div className="mx-auto w-24 h-24 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-inner">
                        <Briefcase className="w-10 h-10 text-white/10" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black italic uppercase tracking-tight">No Active Deployments</h3>
                        <p className="text-[11px] font-black uppercase tracking-widest text-white/20 max-w-sm mx-auto leading-relaxed">
                            Your professional matrix has not yet interfaced with the marketplace. 
                        </p>
                    </div>
                    <Link href="/jobs" className="block">
                        <Button variant="premium" className="h-14 px-10 rounded-2xl shadow-2xl shadow-primary/20 text-xs font-black uppercase tracking-[0.2em]">
                            BROWSE MARKETPLACE <Search className="w-4 h-4 ml-3" />
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {apps.map((app, i) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="glass border-white/5 group hover:border-primary/30 transition-all duration-500 rounded-[2.5rem] overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-[2px] h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                <CardContent className="p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-black italic text-2xl text-primary/50 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 shadow-inner">
                                            {app.jobs?.companies?.company_name?.[0] || 'C'}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{app.jobs?.companies?.company_name}</p>
                                            <h3 className="text-2xl font-black italic tracking-tight text-white group-hover:text-primary transition-colors">{app.jobs?.title}</h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-10 w-full lg:w-auto">
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Zap className="w-3 h-3 text-emerald-500" /> RESONANCE
                                            </p>
                                            <p className="text-2xl font-black italic text-white flex items-baseline gap-1">
                                                {app.ai_match_score}<span className="text-[10px] text-white/30">%</span>
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Calendar className="w-3 h-3" /> GENESIS
                                            </p>
                                            <p className="text-xs font-black text-white/60 uppercase tracking-widest">{new Date(app.created_at).toLocaleDateString()}</p>
                                        </div>

                                        <div className="flex items-center">
                                            <Badge className={cn(
                                                "px-5 py-2 uppercase tracking-[0.2em] font-black italic text-[9px] rounded-xl border",
                                                getStatusColor(app.status)
                                            )}>
                                                {app.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-3 ml-auto">
                                            {app.jobs?.assessment_questions?.length > 0 && app.assessment_score === null && (
                                                <Link href={`/user/assessments/${app.job_id}`}>
                                                    <Button variant="premium" className="h-10 px-6 rounded-xl text-[9px] font-black tracking-widest animate-pulse">
                                                        <Zap className="w-3.5 h-3.5 mr-2" /> TAKE ASSESSMENT
                                                    </Button>
                                                </Link>
                                            )}
                                            <Link href={`/jobs/${app.job_id}`}>
                                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 text-white/30 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all">
                                                    <ArrowRight className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
      )}

      <Card className="glass border-primary/20 p-10 flex flex-col md:flex-row justify-between items-center gap-10 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
          <div className="space-y-2 relative z-10 text-center md:text-left">
              <h4 className="text-2xl font-black italic tracking-tight flex items-center justify-center md:justify-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary" /> Verified Pipeline Active
              </h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Your Intelligence Profile is automatically synchronized with all active nodes.</p>
          </div>
          <div className="relative z-10">
              <Link href="/user/profile">
                  <Button variant="outline" className="h-12 px-8 border-white/10 hover:bg-white/5 font-black text-[10px] uppercase tracking-widest rounded-2xl">
                      UPDATE IDENTITY MATRIX
                  </Button>
              </Link>
          </div>
      </Card>
    </div>
  );
}
