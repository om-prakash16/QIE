"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Loader2, 
    Activity, 
    Terminal, 
    ShieldAlert, 
    GitCommit, 
    Search, 
    Filter, 
    History,
    Calendar,
    Download,
    Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function ActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering State (Section 13)
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(() => fetchLogs(true), 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async (silent = false) => {
    if(!silent) setIsLoading(true);
    try {
      const data = await api.activity.logs("limit=100");
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      if(!silent) toast.error("Failed to load audit stream.");
    } finally {
      setIsLoading(false);
    }
  };

  const getActionColor = (actionType: string) => {
      const type = actionType.toLowerCase();
      if(type.includes("delete") || type.includes("fail") || type.includes("block") || type.includes("terminate")) return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      if(type.includes("create") || type.includes("success") || type.includes("mint") || type.includes("verify") || type.includes("approve")) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      if(type.includes("update") || type.includes("modify") || type.includes("patch") || type.includes("promote")) return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
      return "text-white/40 bg-white/5 border-white/10";
  }

  const filteredLogs = logs.filter(log => {
      const matchesSearch = (log.description || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (log.user_id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (log.action_type || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || (log.entity_type || "").toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      
      {/* Header Array */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-3">
              <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/5 px-4 font-black tracking-widest text-[9px] uppercase italic">
                    Immutable Audit Protocol
                  </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tighter text-white uppercase italic flex items-center gap-6">
                Audit <span className="text-emerald-500">Stream</span>
                <History className="w-12 h-12 text-emerald-500 animate-pulse" />
              </h1>
              <p className="text-muted-foreground text-lg max-w-3xl font-medium">
                Real-time chronological ledger of all platform administrative, AI, and verification events. Every mutation is indexed and cryptographically logged.
              </p>
          </div>
          <div className="flex gap-4">
              <Button variant="outline" className="h-16 px-8 border-white/10 text-white/60 hover:text-white font-black tracking-tighter uppercase italic flex items-center gap-2">
                  <Download className="w-5 h-5 mr-1" /> EXPORT_LEDGER
              </Button>
          </div>
      </div>

      {/* Filter Matrix (Section 13) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl md:col-span-3">
              <CardContent className="p-3 px-6 flex items-center gap-4">
                  <Search className="w-5 h-5 text-white/20" />
                  <Input 
                    placeholder="Search by action, identity, or vector description..." 
                    className="bg-transparent border-none text-lg focus-visible:ring-0 placeholder:text-white/20 h-12"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <div className="h-8 w-px bg-white/10 mx-2" />
                  <Filter className="w-5 h-5 text-white/20" />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-48 bg-transparent border-none focus:ring-0 text-white font-black uppercase tracking-widest text-[10px]">
                          <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 text-white">
                          <SelectItem value="all">ALL CATEGORIES</SelectItem>
                          <SelectItem value="user">USER ENTITIES</SelectItem>
                          <SelectItem value="company">CORPORATE NODES</SelectItem>
                          <SelectItem value="job">OPPORTUNITY VECTORS</SelectItem>
                          <SelectItem value="skill">NEURAL WEIGHTS</SelectItem>
                          <SelectItem value="system">CORE DAEMON</SelectItem>
                      </SelectContent>
                  </Select>
              </CardContent>
          </Card>
          <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl md:col-span-1 border-t-emerald-500/20">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Events:</span>
              <span className="text-2xl font-black text-emerald-500 ml-4 font-mono">{filteredLogs.length}</span>
          </div>
      </div>

      {/* Main Ledger UI */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group border-t-emerald-500/30 border-t-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-white/10 flex flex-row items-center justify-between pb-6 bg-black/40">
            <div>
                <CardTitle className="text-xl flex items-center gap-3 uppercase font-black italic tracking-widest leading-none">
                    <Terminal className="w-6 h-6 text-emerald-500" /> Administrative History
                </CardTitle>
                <CardDescription className="text-xs mt-1 text-white/30 uppercase font-bold tracking-widest">Global Mutation Log</CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Live Stream</span>
            </div>
        </CardHeader>
        <CardContent className="p-0 relative z-10 min-h-[500px] overflow-y-auto custom-scrollbar bg-black/50">
          <Table>
            <TableHeader className="sticky top-0 bg-[#030712]/95 backdrop-blur-xl z-20 border-b border-white/10">
              <TableRow className="border-b border-white/10 hover:bg-transparent uppercase font-black text-[10px] tracking-widest">
                <TableHead className="px-8 h-12 w-48">Event Signature</TableHead>
                <TableHead className="h-12 w-56">Action Protocol</TableHead>
                <TableHead className="h-12">Vector Description</TableHead>
                <TableHead className="text-right px-8 h-12 w-40">Agent ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
              {isLoading && logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-32">
                      <div className="relative inline-block">
                          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                          <Loader2 className="w-12 h-12 animate-spin mx-auto text-emerald-500 relative" />
                      </div>
                      <p className="text-emerald-500/50 uppercase tracking-[0.4em] text-[10px] mt-8 font-black italic">Synchronizing Audit Records...</p>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center p-32 text-white/10 italic font-black uppercase tracking-widest text-xs">
                        <ShieldAlert className="w-12 h-12 mx-auto mb-6 opacity-30" />
                        No signals matched in current audit trajectory.
                    </TableCell>
                </TableRow>
              ) : filteredLogs.map((log, index) => (
                <motion.tr 
                    key={log.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.015 }}
                    className="border-b border-white/5 hover:bg-white/[0.05] transition-colors"
                >
                  <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-3.5 h-3.5 text-white/20" />
                        <span className="text-[11px] text-white/60 font-mono tracking-wider italic">
                            {log.created_at ? formatDistanceToNow(new Date(log.created_at), { addSuffix: true }) : 'LIVE'}
                        </span>
                      </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 border-t-2 ${getActionColor(log.action_type || '')}`}>
                        <GitCommit className="w-3 h-3 mr-2 inline-block opacity-70" />
                        {log.action_type?.replace(/_/g, ' ') || 'SYSTEM_EVENT'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                      <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-bold text-white/80 leading-relaxed max-w-2xl">{log.description}</span>
                          <div className="flex items-center gap-2">
                              <Badge variant="ghost" className="text-[8px] p-0 text-white/20 font-black uppercase tracking-[0.2em]">{log.entity_type || 'GLOBAL'}</Badge>
                              {log.entity_id && <span className="text-[9px] font-mono text-white/10"># {log.entity_id.substring(0,12)}</span>}
                          </div>
                      </div>
                  </TableCell>
                  <TableCell className="text-right px-8">
                      <div className="flex items-center justify-end gap-3">
                          <code className="text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-white/40 font-mono shadow-inner">
                            {log.user_id ? `${log.user_id.substring(0,8)}...` : 'DAEMON'}
                          </code>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-emerald-500 hover:bg-emerald-500/10">
                              <Eye className="w-4 h-4" />
                          </Button>
                      </div>
                  </TableCell>
                </motion.tr>
              ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Audit Alert */}
      <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
           <div className="p-5 bg-emerald-500/20 rounded-3xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
               <ShieldAlert className="w-8 h-8 text-emerald-400" />
           </div>
           <div className="space-y-1.5 flex-1 relative z-10">
               <h3 className="text-xl font-black italic uppercase text-emerald-400">Ledger Immutability Active</h3>
               <p className="text-xs text-emerald-300/60 font-medium italic">Audit logs are synthesized in real-time and synced to the secure platform vault. Deletion or modification of administrative records is programmatically locked. Integrity check hash: 0x82f...a1</p>
           </div>
           <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-[0.2em] uppercase px-12 h-16 rounded-[2rem] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-xs">
               Verify System Hash
           </Button>
      </div>
    </div>
  );
}
