"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { MetricCard } from "@/components/analytics/MetricCard";
import { DashboardCharts } from "@/components/analytics/DashboardCharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, Zap, Target, Loader2, Award, Info } from "lucide-react";

export default function CandidateInsights() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchAnalytics();
  }, [user?.id]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics/user`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-24 px-6 space-y-12 h-screen overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-12">
        <div className="space-y-4">
           <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 uppercase tracking-tighter font-black italic">
             AI CAREER ANALYTICS
           </Badge>
           <h1 className="text-6xl font-black font-heading tracking-tighter italic">Career Insights.</h1>
           <p className="text-muted-foreground max-w-xl italic">Visualizing your trajectory from verified skills to on-chain reputation. Powered by AI matching.</p>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
            title="AI Proof Score" 
            value={88} 
            description="Verified reputation on Solana" 
            trend={+12} 
            icon="zap" 
        />
        <MetricCard 
            title="Active Applications" 
            value={data?.total_applications || 0} 
            description="Responses from tracked jobs" 
            trend={+5} 
            icon="target" 
            color="text-emerald-500"
        />
        <MetricCard 
            title="Skill Mastery" 
            value={`${data?.skill_improvement || 0}%`} 
            description="Growth since last evaluation" 
            trend={+15} 
            icon="award" 
            color="text-amber-500"
        />
        <MetricCard 
            title="Interview Rate" 
            value={`${data?.interview_rate || 0}%`} 
            description="Hiring funnel efficiency" 
            trend={-2} 
            icon="trend" 
            color="text-sky-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Charts - 2 Columns */}
        <div className="lg:col-span-2 space-y-12">
            <DashboardCharts 
                title="Proof Score Growth (30D)" 
                type="line" 
                data={data?.proof_score_trend || []} 
                dataKey="score" 
                nameKey="date" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 p-8 space-y-6">
                    <Sparkles className="w-12 h-12 text-primary" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold italic tracking-tight">AI Talent Ranking</h3>
                        <p className="text-xs text-neutral-500 italic">You are in the top 5% of Solana Developers verified on this best hiring tool this month.</p>
                    </div>
                </Card>
                <Card className="bg-white/5 border-white/10 p-8 space-y-6">
                    <TrendingUp className="w-12 h-12 text-emerald-500" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold italic tracking-tight">Earning Potential</h3>
                        <p className="text-xs text-neutral-500 italic">Based on your Proof Score, average remote offers in your bracket range from $120k - $160k SOL.</p>
                    </div>
                </Card>
            </div>
        </div>

        {/* Info Column - 1 Column */}
        <div className="space-y-8">
            <h2 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" /> Metrics Context
            </h2>
            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-neutral-500 italic">Aggregated Data Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-[10px] text-neutral-400 font-medium italic">
                    <p>Metrics are calculated daily using high-frequency platform event data. Trends are updated every 24 hours at 00:00 UTC.</p>
                    <p>Your Proof Score includes multi-dimensional signals from on-chain transactions, AI quizzes, and project audits.</p>
                </CardContent>
            </Card>

            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary/20 via-black to-neutral-800 border border-white/10 p-8 flex flex-col justify-end">
                <Badge className="bg-white text-black font-black italic w-fit mb-4">PREMIUM INSIGHT</Badge>
                <h4 className="text-2xl font-black tracking-tighter italic">"Your Rust proficiency is currently 22% higher than the marketplace average."</h4>
            </div>
        </div>
      </div>
    </div>
  );
}
