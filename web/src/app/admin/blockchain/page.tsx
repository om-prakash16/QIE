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
  Globe 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:8000/blockchain/transactions");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

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
        value: data.filter(tx => tx.transaction_type.includes('mint')).length,
        icon: Database,
        height: "25",
        color: "purple"
    }
  ];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
            Blockchain <span className="text-blue-500">Observability</span>
          </h2>
          <p className="text-muted-foreground text-sm font-medium">
            Real-time analytics and transaction verification for Best Hiring Tool on Solana.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 cursor-pointer">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Quick Verification
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.color}-500 group-hover:scale-110 transition-transform`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 uppercase font-semibold">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Transaction Ledger
                </CardTitle>
                <CardDescription>
                  A real-time broadcast of all on-chain interactions orchestrated by Best Hiring Tool.
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1" />
                Live Network Status: Mainnet-Beta
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TransactionHistory initialData={data} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
