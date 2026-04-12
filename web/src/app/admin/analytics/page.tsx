'use client';

import { MetricCard } from '@/components/features/analytics/MetricCard';
import { AnalyticsCharts } from '@/components/features/analytics/AnalyticsCharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  Zap, 
  Database, 
  LayoutDashboard, 
  Download,
  Calendar,
  Sparkles,
  Heart,
  MousePointer2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const USER_GROWTH = [
  { label: 'Jan', value: 8500 },
  { label: 'Feb', value: 9200 },
  { label: 'Mar', value: 12450 },
  { label: 'Apr', value: 11100 },
  { label: 'May', value: 13800 },
  { label: 'Jun', value: 16200 },
];

const SKILL_DEMAND = [
  { label: 'Solana', value: 85 },
  { label: 'React', value: 92 },
  { label: 'Python', value: 64 },
  { label: 'Rust', value: 78 },
  { label: 'LLM', value: 95 },
];

const ENGAGEMENT_FUNNEL = [
    { label: 'Total Views', value: 25000 },
    { label: 'Job Saves', value: 12000 },
    { label: 'Applications', value: 4500 },
    { label: 'Shortlisted', value: 1200 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-muted/5 py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <main className="max-w-7xl mx-auto space-y-12 relative">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8 border-primary/10">
          <div className="space-y-4">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-0.5">
                <LayoutDashboard className="w-3 h-3 mr-2" />
                Platform Intelligence
            </Badge>
            <h1 className="text-5xl font-black tracking-tighter text-foreground">
              Marketplace <span className="text-primary italic">Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground uppercase tracking-widest text-xs font-bold">
               Macro-level visibility into Web3 talent and AI throughput.
            </p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="h-11 rounded-xl bg-card/50 backdrop-blur-sm border-primary/10 font-bold">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
             </Button>
             <Button className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-600/20">
                <Download className="w-4 h-4 mr-2" />
                Export Report
             </Button>
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Talent" 
            value="12,450" 
            trend={14.2} 
            description="Verified candidates with at least one skill badge."
            icon={Users} 
          />
          <MetricCard 
            title="Sovereign NFTs" 
            value="8,920" 
            trend={28.5} 
            description="Total Solana-verified skill badges minted."
            icon={Database} 
          />
          <MetricCard 
            title="Job Engagement" 
            value="12.0k" 
            trend={42.1} 
            description="Total jobs saved by candidates (Micro-conversions)."
            icon={Heart} 
          />
          <MetricCard 
            title="Total Applications" 
            value="4,500" 
            trend={12.4} 
            description="Completed job applications across the platform."
            icon={MousePointer2} 
          />
          <MetricCard 
            title="AI Ingestions" 
            value="15.6k" 
            trend={12.1} 
            description="Gemini 1.5 total resume and quiz analyses."
            icon={Zap} 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-8 bg-card/20 backdrop-blur-xl border-primary/10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Talent Influx</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Monthly new candidate registrations</p>
                    </div>
                    <div className="h-8 w-24 bg-primary/10 rounded-lg animate-pulse" />
                </div>
                <AnalyticsCharts data={USER_GROWTH} type="area" dataKey="value" />
            </Card>

            <Card className="p-8 bg-card/20 backdrop-blur-xl border-primary/10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Skill Demand</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Global platform requirement index</p>
                    </div>
                    <div className="flex gap-1">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                </div>
                <AnalyticsCharts data={SKILL_DEMAND} type="bar" dataKey="value" />
            </Card>
        </div>

        {/* Intelligence Alert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-r from-indigo-600/10 to-primary/10 border-indigo-500/20 border-dashed">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">AI Observation: Save-to-Apply Friction</p>
                            <p className="text-xs text-muted-foreground">High "Save" volume on Senior Rust roles, but only 12% application rate. Candidates may lack specific Solana verification badges.</p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-emerald-600/10 to-primary/10 border-emerald-500/20 border-dashed">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">Admin Tip: High Intent Alert</p>
                            <p className="text-xs text-muted-foreground">Jobs saved more than 50 times in 24h are prioritized in the main feed to boost conversion.</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>

        <Card className="p-8 bg-card/20 backdrop-blur-xl border-primary/10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Engagement Funnel</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Platform-wide conversion metrics: from Interest to Action</p>
                </div>
            </div>
            <AnalyticsCharts data={ENGAGEMENT_FUNNEL} type="bar" dataKey="value" />
        </Card>
      </main>
    </div>
  );
}
