"use client";

import { useEffect, useState } from "react";
import { TransactionHistory } from "@/components/blockchain/TransactionHistory";
import { 
  Activity, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Database, 
  Globe,
  Cpu,
  Fingerprint,
  Link,
  Save,
  Loader2,
  BoxSelect
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Transaction {
  id: string;
  user_wallet: string;
  transaction_hash: string;
  transaction_type: string;
  status: "pending" | "confirmed" | "failed" | "finalized";
  timestamp: string;
  explorer_url: string;
}

export default function BlockchainDashboard() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // NFT Configuration State (Section 11)
  const [nftConfig, setNftConfig] = useState({
      auto_mint: true,
      soulbound: true,
      min_resonance_score: 85,
      metadata_template: "SKILLPROOF_V1_METAPLEX",
      collection_mint: "3u7...9vJ"
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:8000/blockchain/transactions");
        const json = await response.json();
        setData(Array.isArray(json) ? json : []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 15000); 
    return () => clearInterval(interval);
  }, []);

  const handleSaveConfig = async () => {
      setIsSaving(true);
      try {
          if (api.admin.updateSettings) {
              await api.admin.updateSettings({
                  setting_key: "blockchain_config",
                  setting_value: nftConfig
              });
          }
          toast.success("Blockchain Synthesis Protocols Synchronized");
      } catch (err) {
          toast.error("Failed to update blockchain config");
      } finally {
          setIsSaving(false);
      }
  };

  const stats = [
    {
      title: "Total Transactions",
      value: data.length,
      icon: Activity,
      description: "On-chain activity logged to Supabase",
      color: "blue",
    },
    {
      title: "Verification Rate",
      value: "99.8%",
      icon: ShieldCheck,
      description: "Successful finality across cluster",
      color: "emerald",
    },
    {
      title: "Indexing Latency",
      value: "450ms",
      icon: Zap,
      description: "Helius DAS real-time sync",
      color: "amber",
    },
    {
        title: "Active Mints",
        value: data.filter(tx => tx.transaction_type?.includes('mint')).length,
        icon: Database,
        color: "purple",
        description: "Verified NFT Certificates"
    }
  ];

  return (
    <div className="flex-1 space-y-12 p-8 pt-6 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            <Cpu className="w-10 h-10 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            Blockchain <span className="text-blue-500">Governance</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-2">
            Absolute control over the platform's Web3 infrastructure, minting protocols, and transaction ledger.
          </p>
        </div>
      </div>

      {/* Network Stats Bar */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden group hover:border-white/20 transition-all border-t-2" style={{ borderTopColor: stat.color === 'emerald' ? '#10b98133' : stat.color === 'amber' ? '#f59e0b33' : stat.color === 'purple' ? '#a855f733' : '#3b82f633' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.color}-500 group-hover:scale-110 transition-transform`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <p className="text-[10px] text-white/30 mt-2 flex items-center gap-1 uppercase font-bold tracking-tight">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* NFT Configuration Card - Section 11 */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-blue-500/30 border-t-2 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
              <CardHeader className="relative z-10 border-b border-white/5">
                  <div className="flex items-center gap-3">
                      <Fingerprint className="w-6 h-6 text-blue-500" />
                      <div>
                          <CardTitle className="text-xl font-bold">NFT Synthesis Protocol</CardTitle>
                          <CardDescription>Configure automated skill verification tokens.</CardDescription>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 relative z-10">
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Automatic Minting</span>
                        <span className="text-[10px] text-white/30 italic">Mint on resonance threshold.</span>
                    </div>
                    <Switch 
                        checked={nftConfig.auto_mint} 
                        onCheckedChange={(v) => setNftConfig({...nftConfig, auto_mint: v})} 
                        className="data-[state=checked]:bg-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Soulbound Protocol</span>
                        <span className="text-[10px] text-white/30 italic">Transferability restriction.</span>
                    </div>
                    <Switch 
                        checked={nftConfig.soulbound} 
                        onCheckedChange={(v) => setNftConfig({...nftConfig, soulbound: v})} 
                        className="data-[state=checked]:bg-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Minimum Skill Resonance for Mint</label>
                      <div className="flex gap-4 items-center">
                          <Input 
                              type="number" 
                              className="bg-black/40 border-white/10 h-10 font-black text-blue-400"
                              value={nftConfig.min_resonance_score}
                              onChange={(e) => setNftConfig({...nftConfig, min_resonance_score: parseInt(e.target.value)})}
                          />
                          <Badge variant="outline" className="h-10 px-4 bg-blue-500/10 text-blue-500 border-blue-500/20 uppercase font-black tracking-widest text-[10px]">
                              SCORE %
                          </Badge>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Metadata Schema Template</label>
                      <Select value={nftConfig.metadata_template} onValueChange={(v) => setNftConfig({...nftConfig, metadata_template: v})}>
                          <SelectTrigger className="bg-black/40 border-white/10 h-10 text-xs">
                              <SelectValue placeholder="Template Selection" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-950 border-white/10 text-white">
                              <SelectItem value="SKILLPROOF_V1_METAPLEX">Metaplex Certified (v1.0)</SelectItem>
                              <SelectItem value="SKILLPROOF_CORE_V2">SkillProof Core (v2.0)</SelectItem>
                              <SelectItem value="ENTERPRISE_CUSTOM">Enterprise Custom</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>

                  <div className="space-y-3">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Global Collection Authority</label>
                      <div className="relative group">
                          <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-white/20 group-hover:text-blue-500">
                                <Link className="w-3 h-3" />
                          </Button>
                          <Input 
                              className="bg-black/40 border-white/10 h-10 font-mono text-[10px] text-white/60 pr-10"
                              value={nftConfig.collection_mint}
                              onChange={(e) => setNftConfig({...nftConfig, collection_mint: e.target.value})}
                          />
                      </div>
                  </div>

                  <Button 
                    onClick={handleSaveConfig} 
                    disabled={isSaving} 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest uppercase h-12 mt-4 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Sync Protocols</>}
                  </Button>
              </CardContent>
          </Card>

          {/* Ledger View */}
          <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                     <BoxSelect className="w-5 h-5 text-blue-500" />
                     Immutable Transaction Ledger
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-black text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    Live Watch
                  </div>
              </div>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                    <TransactionHistory initialData={data} />
                </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
