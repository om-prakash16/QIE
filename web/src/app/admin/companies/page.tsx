"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Loader2, 
    Building2, 
    Trash2, 
    Edit, 
    ExternalLink, 
    ShieldCheck, 
    Search, 
    Plus,
    Filter,
    Globe,
    Lock,
    Verified,
    Crown,
    CheckCircle,
    MoreVertical
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";

export default function CompanyModeration() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getCompanies();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load company matrix.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
      if(!confirm("ARE YOU SURE? This will purge the company and all associated jobs/applications permanently.")) return;
      setIsDeleting(id);
      try {
          await api.admin.deleteCompany(id);
          toast.success("Organization purged from the grid.");
          await fetchCompanies();
      } catch (err) {
          toast.error("Purge protocol failed.");
      } finally {
          setIsDeleting(null);
      }
  }

  const handleUpdateTier = async (id: string, tier: string) => {
      toast.success(`Organization escalated to ${tier} tier.`);
      // Mock update
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, verification_tier: tier, verified: true } : c));
  }

  const filteredCompanies = companies.filter(c => {
      const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || 
                          c.industry?.toLowerCase().includes(search.toLowerCase());
      const matchesTier = tierFilter === "all" || (c.verification_tier || "basic").toLowerCase() === tierFilter.toLowerCase();
      return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      
      {/* Header Array */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 bg-indigo-500/5 px-4 font-black tracking-widest text-[9px] uppercase italic">
                  Partner Network Authority
                </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tighter text-white uppercase italic flex items-center gap-6">
              Partner <span className="text-indigo-500">Nodes</span> 
              <Building2 className="w-12 h-12 text-indigo-500 animate-pulse" />
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl font-medium">
              Heuristic oversight of corporate entities. Moderate verification tiers, manage data silos, and govern organizational lifecycles on the Best Hiring Tool network.
            </p>
        </div>
        <Button className="h-16 px-10 bg-white text-black hover:bg-neutral-200 font-black tracking-tighter uppercase transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
            <Plus className="w-5 h-5 mr-3" /> Provision Node
        </Button>
      </div>

      {/* Filter Matrix (Section 4) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl md:col-span-3">
              <CardContent className="p-3 px-6 flex items-center gap-4">
                  <Search className="w-5 h-5 text-white/20" />
                  <Input 
                    placeholder="Search by company name, sector, or ID..." 
                    className="bg-transparent border-none text-lg focus-visible:ring-0 placeholder:text-white/20 h-12"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <div className="h-8 w-px bg-white/10 mx-2" />
                  <Filter className="w-5 h-5 text-white/20" />
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                      <SelectTrigger className="w-48 bg-transparent border-none focus:ring-0 text-white font-black uppercase tracking-widest text-[10px]">
                          <SelectValue placeholder="All Tiers" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 text-white">
                          <SelectItem value="all">ALL TIERS</SelectItem>
                          <SelectItem value="premium">PREMIUM (LVL 3)</SelectItem>
                          <SelectItem value="advanced">ADVANCED (LVL 2)</SelectItem>
                          <SelectItem value="basic">BASIC (LVL 1)</SelectItem>
                          <SelectItem value="none">UNVERIFIED</SelectItem>
                      </SelectContent>
                  </Select>
              </CardContent>
          </Card>
          <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl md:col-span-1 border-t-indigo-500/20">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Active Nodes:</span>
              <span className="text-2xl font-black text-indigo-500 ml-4 font-mono">{filteredCompanies.length}</span>
          </div>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group border-t-indigo-500/30 border-t-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-white/10 bg-black/40 py-6">
            <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-3 uppercase font-black italic tracking-widest leading-none">
                    <Verified className="w-6 h-6 text-indigo-500" /> Organizational Ledger
                </CardTitle>
                <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] italic">Real-time Watch</span>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0 relative z-10 overflow-hidden bg-black/30">
          <Table>
            <TableHeader className="bg-white/[0.02] border-b border-white/5">
              <TableRow className="border-b border-white/5 hover:bg-transparent uppercase font-black text-[10px] tracking-widest">
                <TableHead className="px-8 h-12">Entity Identity</TableHead>
                <TableHead className="h-12">Provincance Tier</TableHead>
                <TableHead className="h-12">Market Resonance (Jobs)</TableHead>
                <TableHead className="h-12 text-right px-8">Terminal Overrides</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-32">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-500 opacity-50" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-8 italic">Decrypting Corporate Matrix...</p>
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center p-32 text-white/10 italic font-black uppercase tracking-widest text-xs">
                        No partner signals detected in current filter trajectory.
                    </TableCell>
                </TableRow>
              ) : filteredCompanies.map((company, index) => (
                <motion.tr 
                    key={company.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group/row"
                >
                  <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-inner group-hover/row:scale-105 transition-transform font-black text-indigo-400">
                             {company.name?.[0] || 'E'}
                          </div>
                          <div className="flex flex-col gap-1">
                              <span className="font-bold text-white tracking-tight">{company.name || 'ANON_ENTITY'}</span>
                              <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">{company.industry || 'PRIVATE_SECTOR'}</span>
                                  {company.website && (
                                       <a href={company.website} target="_blank" className="p-1 rounded text-white/10 hover:text-indigo-400 transition-colors">
                                           <Globe className="w-3 h-3" />
                                       </a>
                                  )}
                              </div>
                          </div>
                      </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 border-t-2 ${
                        company.verification_tier === 'premium' ? 'border-amber-500/40 text-amber-500 bg-amber-500/10' :
                        company.verification_tier === 'advanced' ? 'border-indigo-400/40 text-indigo-400 bg-indigo-400/10' :
                        'border-white/10 text-white/30 bg-white/5'
                    }`}>
                        {company.verification_tier === 'premium' ? <Crown className="w-3 h-3 mr-2" /> : <ShieldCheck className="w-3 h-3 mr-2" />}
                        {company.verification_tier || 'BASIC_TIER'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-3">
                         <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden border border-white/5">
                             <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '65%' }} />
                         </div>
                         <span className="font-mono text-[10px] text-white/40 italic">HIGH_LOAD</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex items-center justify-end gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-white/30 hover:text-white hover:bg-white/10 border border-white/5">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-950 border-white/10 text-white w-64 p-2 rounded-2xl shadow-2xl">
                                <DropdownMenuLabel className="text-[10px] uppercase font-black text-white/40 tracking-widest p-2">Escalate Provinance</DropdownMenuLabel>
                                <DropdownMenuItem className="focus:bg-rose-500/20 rounded-xl cursor-pointer py-3" onClick={() => handleUpdateTier(company.id, 'basic')}>
                                    <ShieldCheck className="w-4 h-4 mr-3 text-white/40" /> Basic Verification (L1)
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-indigo-500/20 rounded-xl cursor-pointer py-3" onClick={() => handleUpdateTier(company.id, 'advanced')}>
                                    <ShieldCheck className="w-4 h-4 mr-3 text-indigo-400" /> Advanced Status (L2)
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-amber-500/20 rounded-xl cursor-pointer py-3" onClick={() => handleUpdateTier(company.id, 'premium')}>
                                    <Crown className="w-4 h-4 mr-3 text-amber-500" /> Premium Enterprise (L3)
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuLabel className="text-[10px] uppercase font-black text-rose-500/60 tracking-widest p-2">Terminiate Authority</DropdownMenuLabel>
                                <DropdownMenuItem className="focus:bg-rose-500 rounded-xl cursor-pointer py-3 font-bold group" onClick={() => handleDelete(company.id)}>
                                    <Trash2 className="w-4 h-4 mr-3 group-hover:text-white text-rose-500" /> 
                                    {isDeleting === company.id ? "Purging Grid..." : "Execute Purge Protocol"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-indigo-400/50 hover:text-indigo-400 hover:bg-indigo-500/10 border border-indigo-500/10 shadow-lg shadow-indigo-500/5">
                            <ExternalLink className="w-5 h-5" />
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
      
      {/* Alert Module */}
      <div className="p-10 rounded-[3rem] bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10 shadow-2xl">
          <div className="p-6 bg-indigo-500/20 rounded-[2rem] border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <Lock className="w-10 h-10 text-indigo-400" />
          </div>
          <div className="space-y-2 flex-1 relative z-10">
              <h3 className="text-2xl font-black italic uppercase text-indigo-400">Restricted Entity Access</h3>
              <p className="text-sm text-indigo-300/60 font-medium italic max-w-2xl">All organization nodes must maintain a positive resonance score. Suspended entities lose immediate access to the hiring mesh and their listings are programmatically hidden from candidates.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-[0.2em] uppercase px-12 h-20 rounded-[2rem] shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all text-xs border-t border-white/20">
              Generate Partner Report
          </Button>
      </div>
    </div>
  );
}
