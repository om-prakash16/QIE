"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Users, 
    Briefcase, 
    Sparkles, 
    CheckCircle, 
    XCircle, 
    Clock, 
    TrendingUp, 
    ArrowUpRight,
    Search,
    Filter,
    Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MarketHeatmap } from "@/components/dashboard/MarketHeatmap";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function RecruiterDashboard() {
  const { publicKey, connected } = useWallet();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch based on current company context
    const fetchApplications = async () => {
      try {
        const res = await fetch(`${API_BASE}/jobs/applications/job?job_id=all`);
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Failed to load applicants", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (appId: string, newStatus: string) => {
    try {
      await fetch(`${API_BASE}/jobs/applications/${appId}/status?status=${newStatus}`, {
        method: "PATCH",
      });
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 mt-16 max-w-7xl animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
            <h1 className="text-5xl font-black font-heading tracking-tighter">Recruiter <span className="text-primary italic">Nexus</span></h1>
            <p className="text-muted-foreground text-lg max-w-xl">
                Manage your Web3 talent pipeline with AI-driven matching and verifiable skill proofs.
            </p>
        </div>
        <div className="flex gap-3">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-8 py-6 rounded-2xl shadow-xl hover:shadow-primary/20 transition-all active:scale-95">
                <PlusIcon className="w-4 h-4 mr-2" />
                Post New Job
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <StatCard label="Total Applications" value="482" trend="+12% from last wk" icon={Users} color="from-blue-500/20 to-blue-600/5 text-blue-500" />
        <StatCard label="AI Match Avg" value="78%" trend="Consistent quality" icon={Sparkles} color="from-amber-500/20 to-amber-600/5 text-amber-500" />
        <StatCard label="Active Jobs" value="12" trend="3 high priority" icon={Briefcase} color="from-emerald-500/20 to-emerald-600/5 text-emerald-500" />
        <StatCard label="Hire Rate" value="14.2%" trend="+2.4% improved" icon={TrendingUp} color="from-pink-500/20 to-pink-600/5 text-pink-500" />
      </div>

      <Tabs defaultValue="applicants" className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            <TabsList className="bg-transparent border-none p-0">
                <TabsTrigger value="applicants" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Applicants</TabsTrigger>
                <TabsTrigger value="jobs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">My Jobs</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search talent..." className="pl-10 bg-white/5 border-white/10 rounded-xl" />
                </div>
                <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-white/5"><Filter className="w-4 h-4" /></Button>
            </div>
        </div>

        <TabsContent value="applicants" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="p-12 text-center text-muted-foreground animate-pulse">Loading talent pool...</div>
                ) : applications.length > 0 ? (
                    applications.map((app) => (
                        <Card key={app.id} className="bg-white/5 border-white/10 backdrop-blur-md hover:border-white/20 transition-all overflow-hidden group">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <Users className="w-8 h-8 text-primary/60" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold tracking-tight">Candidate {app.candidate.slice(0, 8)}...</h3>
                                            <Badge variant="outline" className={cn(
                                                "text-[10px] font-black uppercase italic",
                                                app.status === 'hired' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                app.status === 'shortlisted' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-white/5 border-white/10'
                                            )}>
                                                {app.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Briefcase className="w-3.5 h-3.5" /> Applied to Senior Solana Developer • 2 days ago
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center px-8 border-x border-white/5">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">AI Match Score</p>
                                        <div className={cn(
                                            "text-3xl font-black italic tracking-tighter",
                                            app.ai_score >= 80 ? "text-emerald-500" : app.ai_score >= 60 ? "text-amber-500" : "text-rose-500"
                                        )}>
                                            {app.ai_score}%
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest"
                                            onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                                            disabled={app.status === 'shortlisted'}
                                        >
                                            <CheckCircle className="w-3.5 h-3.5 mr-2" />
                                            Shortlist
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                                            onClick={() => handleStatusUpdate(app.id, 'hired')}
                                            disabled={app.status === 'hired'}
                                        >
                                            <Zap className="w-3.5 h-3.5 mr-2" />
                                            Direct Hire
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="hover:bg-rose-500/10 text-rose-500 rounded-xl"
                                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="p-20 text-center space-y-4 bg-white/5 border border-white/10 border-dashed rounded-3xl">
                        <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                        <h3 className="text-xl font-bold text-muted-foreground">No pending applicants found.</h3>
                        <p className="text-sm text-muted-foreground/60">Active job posts will appear here once candidates apply.</p>
                    </div>
                )}
            </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8">
            <MarketHeatmap />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color }: any) {
    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden relative group hover:border-white/20 transition-all duration-500">
            <div className={cn("absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-20", color.split(' ')[0])} />
            <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/10", color.split(' ')[2])}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
                    <p className="text-3xl font-black tabular-nums">{value}</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{trend}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function PlusIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
