"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Users, 
    Building2, 
    Briefcase, 
    Zap, 
    Activity, 
    TrendingUp, 
    ShieldCheck, 
    Globe, 
    BrainCircuit,
    Fingerprint,
    Loader2,
    ArrowUpRight,
    Radar,
    Terminal,
    Database,
    ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockTrendData = [
  { name: 'Mon', users: 4000, jobs: 2400 },
  { name: 'Tue', users: 3000, jobs: 1398 },
  { name: 'Wed', users: 2000, jobs: 9800 },
  { name: 'Thu', users: 2780, jobs: 3908 },
  { name: 'Fri', users: 1890, jobs: 4800 },
  { name: 'Sat', users: 2390, jobs: 3800 },
  { name: 'Sun', users: 3490, jobs: 4300 },
];

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await api.analytics.admin();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const METRIC_CARDS = [
      { 
          label: "Active Entities", 
          value: stats?.totals?.users || 0, 
          trend: "+12.5%", 
          icon: Users, 
          color: "rose",
          desc: "Unique verified identities"
      },
      { 
          label: "Partner Nodes", 
          value: stats?.totals?.companies || 0, 
          trend: "+4.2%", 
          icon: Building2, 
          color: "indigo",
          desc: "Verified corporate entities"
      },
      { 
          label: "Network Load", 
          value: stats?.totals?.jobs || 0, 
          trend: "+22.1%", 
          icon: Briefcase, 
          color: "emerald",
          desc: "Active hiring opportunities"
      },
      { 
          label: "Synthesized NFTs", 
          value: stats?.totals?.events ? Math.round(stats.totals.events / 4.5) : 342, 
          trend: "+8.9%", 
          icon: Fingerprint, 
          color: "amber",
          desc: "On-chain verification tokens"
      }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-rose-500 rounded-full animate-pulse" />
              <Badge variant="outline" className="border-rose-500/30 text-rose-500 bg-rose-500/5 px-4 font-black tracking-widest text-[9px] uppercase">
                System Status: Operational
              </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tighter text-white uppercase italic flex items-center gap-6">
            Global <span className="text-rose-500">Surveillance</span> 
            <Radar className="w-12 h-12 text-rose-500 animate-pulse" />
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            Real-time heuristic analysis of the SkillProof AI ecosystem. Absolute oversight of user migration, corporate engagement, and neural matching efficiency.
          </p>
        </div>
        <div className="flex gap-4">
            <Button size="lg" className="h-16 px-8 bg-white text-black hover:bg-neutral-200 font-black tracking-tighter uppercase transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
                <Activity className="w-5 h-5 mr-3" /> System Audit
            </Button>
        </div>
      </div>

      {/* Main Metric Array */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRIC_CARDS.map((card, idx) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-xl group-hover:border-white/20 transition-all cursor-default relative overflow-hidden h-40">
                      <div className={`absolute top-0 left-0 w-1 h-full bg-rose-500 opacity-40`} style={{ backgroundColor: card.color === 'rose' ? '#f43f5e' : card.color === 'indigo' ? '#6366f1' : card.color === 'emerald' ? '#10b981' : '#f59e0b' }} />
                      <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${card.color}-500/10 blur-[60px] rounded-full group-hover:bg-${card.color}-500/20 transition-all`} />
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{card.label}</CardTitle>
                        <card.icon className="w-4 h-4" style={{ color: card.color === 'rose' ? '#f43f5e' : card.color === 'indigo' ? '#6366f1' : card.color === 'emerald' ? '#10b981' : '#f59e0b' }} />
                      </CardHeader>
                      <CardContent>
                        {loading ? <Loader2 className="w-6 h-6 animate-spin text-white/10" /> : (
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-black text-white tracking-tighter">{card.value}</span>
                                    <span className="text-[10px] font-black text-emerald-500 flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-1" /> {card.trend}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-2">{card.desc}</span>
                            </div>
                        )}
                      </CardContent>
                  </Card>
              </motion.div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Neural Resonance Monitor (AI Stats) */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl lg:col-span-2 border-t-rose-500/20 border-t-2 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
                <CardHeader className="border-b border-white/5 pb-6">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-3">
                                <BrainCircuit className="w-6 h-6 text-rose-500" /> Neural Resonance Monitor
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-black tracking-widest text-white/30">Heuristic Engine Performance Metrics</CardDescription>
                        </div>
                        <Link href="/admin/ai-config">
                            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-rose-500">Modify Formula</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Matching Accuracy</span>
                                <span className="text-xl font-black text-white italic">94.2%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '94.2%' }} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Compute Latency</span>
                                <span className="text-xl font-black text-white italic">140ms</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" style={{ width: '15%' }} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Heuristic Load</span>
                                <span className="text-xl font-black text-white italic">Low</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '22%' }} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-black/40 border border-white/5 rounded-2xl relative group">
                        <div className="flex items-center gap-4 mb-4">
                            <Terminal className="w-5 h-5 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Real-time Matching Stream</span>
                        </div>
                        <div className="space-y-3 font-mono text-[11px] leading-relaxed">
                            <div className="flex gap-4 text-emerald-400/80 text-xs">
                                <span className="text-white/20">[14:22:01]</span>
                                <span>MATCH_SUCCESS: Candidate(0x7a...f2) paired with Job(FinTech Lead) | Score: 0.92</span>
                            </div>
                            <div className="flex gap-4 text-white/40 text-xs">
                                <span className="text-white/20">[14:21:45]</span>
                                <span>HEURISTIC_INIT: RAG pipeline triggered for Python Backend evaluation...</span>
                            </div>
                            <div className="flex gap-4 text-rose-400/80 text-xs">
                                <span className="text-white/20">[14:21:12]</span>
                                <span>RESONANCE_LOW: Candidate(0x1c...e4) rejected for Senior Architect (Skill Gap: Rust)</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
          </Card>

          {/* Recharts Analytics Visualization */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl lg:col-span-3 mt-8 relative overflow-hidden border-t-indigo-500/20 border-t-2">
              <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 pointer-events-none" />
              <CardHeader className="border-b border-white/5 pb-6">
                  <CardTitle className="text-xl flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-indigo-500" /> Ecosystem Growth Trends
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase font-black tracking-widest text-white/30">7-Day Moving Average for Users & Jobs</CardDescription>
              </CardHeader>
              <CardContent className="p-8 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                          data={mockTrendData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                          <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="#ffffff40" tick={{fill: '#ffffff80', fontSize: 12}} />
                          <YAxis stroke="#ffffff40" tick={{fill: '#ffffff80', fontSize: 12}} />
                          <Tooltip 
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="users" stroke="#f43f5e" fillOpacity={1} fill="url(#colorUsers)" />
                          <Area type="monotone" dataKey="jobs" stroke="#10b981" fillOpacity={1} fill="url(#colorJobs)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>


          {/* Operational Nexus (Quick Controls) */}
          <div className="space-y-6 lg:col-span-1">
              <h3 className="text-xl font-bold flex items-center gap-3 px-2">
                 <Globe className="w-5 h-5 text-rose-500" /> Operational Nexus
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                  {[
                      { label: "Entity Registry", href: "/admin/users", icon: Users, color: "#f43f5e", count: stats?.totals?.users },
                      { label: "Partner Matrix", href: "/admin/companies", icon: Building2, color: "#6366f1", count: stats?.totals?.companies },
                      { label: "Meta-Schema", href: "/admin/schema", icon: Database, color: "#10b981" },
                      { label: "Feature Flags", href: "/admin/features", icon: Zap, color: "#f59e0b" },
                      { label: "Digital Identity", href: "/admin/blockchain", icon: Fingerprint, color: "#3b82f6" }
                  ].map((link) => (
                      <Link key={link.label} href={link.href}>
                          <Card className="bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all cursor-pointer group backdrop-blur-lg">
                              <CardContent className="p-5 flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                      <div className={`p-2.5 rounded-xl border transition-transform group-hover:scale-110`} style={{ backgroundColor: `${link.color}11`, borderColor: `${link.color}22` }}>
                                          <link.icon className={`w-5 h-5`} style={{ color: link.color }} />
                                      </div>
                                      <span className="font-bold text-white tracking-tight">{link.label}</span>
                                  </div>
                                  {link.count !== undefined ? (
                                      <Badge variant="outline" className="font-mono text-[10px] bg-white/5 border-white/10">{link.count}</Badge>
                                  ) : <ArrowUpRight className="w-4 h-4 text-white/20" />}
                              </CardContent>
                          </Card>
                      </Link>
                  ))}
              </div>

              <Card className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex flex-col items-center gap-6 text-center">
                  <ShieldAlert className="w-10 h-10 text-rose-500" />
                  <div className="space-y-1">
                      <h4 className="text-lg font-black italic uppercase">Override Authority</h4>
                      <p className="text-[10px] text-rose-500/70 font-medium italic">Security protocols are active. All administrative actions are logged to the immutable ledger.</p>
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
}
