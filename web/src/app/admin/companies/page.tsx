"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Building2, Trash2, Edit, ExternalLink, ShieldCheck, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";

export default function CompanyModeration() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
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
          toast.success("Company purged from the network.");
          await fetchCompanies();
      } catch (err) {
          toast.error("Failed to execute purge protocol.");
      } finally {
          setIsDeleting(null);
      }
  }

  const filteredCompanies = companies.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
              <Building2 className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.8)]" /> 
              Partner Network
            </h1>
            <p className="text-muted-foreground text-lg mt-3">
              Absolute governance over hiring entities. Moderation, verification, and lifecycle management for multi-tenant organizations.
            </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest h-14 px-8">
            <Plus className="w-5 h-5 mr-2" /> Provision Company
        </Button>
      </div>

      <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search companies by name or sector..." 
            className="h-14 bg-white/5 border-white/10 pl-14 text-lg focus-visible:ring-primary/30 rounded-2xl"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group border-t-primary/30 border-t-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-white/10 flex flex-row items-center justify-between pb-6">
            <div>
                <CardTitle className="text-xl flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Active Hiring Entities</CardTitle>
                <CardDescription>Direct relational control over the organizational layer.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white/5 border-white/10 font-mono tracking-wider text-primary">
                {filteredCompanies.length} VERIFIED
            </Badge>
        </CardHeader>
        <CardContent className="p-0 relative z-10">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14 px-6">Company Entity</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Industry / Sector</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Website</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-white/40 h-14 px-6">Terminal Overrides</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-24">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary/50" />
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.map((company, index) => (
                <motion.tr 
                    key={company.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-white/5 hover:bg-white/[0.02]"
                >
                  <TableCell className="px-6 py-5">
                      <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white tracking-tight">{company.name}</span>
                            {company.verified ? (
                                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                            ) : (
                                <Badge variant="outline" className="text-[8px] h-4 bg-amber-500/10 text-amber-500 border-amber-500/20 font-black">PENDING</Badge>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-white/30 uppercase mt-1">{company.id.substring(0,8)}...</span>
                      </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase font-black text-white/60">
                        {company.industry || 'GENERIC_ENT'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                      {company.website ? (
                          <a href={company.website} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1 group">
                               Visit <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                      ) : <span className="text-xs text-white/20 italic">No link</span>}
                  </TableCell>
                  <TableCell className="text-right px-6 space-x-2">
                    {!company.verified && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-3 text-[10px] font-black uppercase tracking-tighter bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:text-primary transition-all"
                            onClick={async () => {
                                try {
                                    await api.admin.verifyCompany(company.id);
                                    toast.success("Organization verified.");
                                    fetchCompanies();
                                } catch (err) {
                                    toast.error("Verification failed.");
                                }
                            }}
                        >
                            Verify Entity
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        onClick={() => handleDelete(company.id)}
                        disabled={isDeleting === company.id}
                    >
                      {isDeleting === company.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
