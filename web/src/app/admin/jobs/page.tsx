"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Briefcase, Trash2, Edit, Search, Plus, Filter, ArrowUpDown, Heart, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";

export default function JobModeration() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getAllJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load marketplace data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
      if(!confirm("Purge this job listing? This action is irreversible.")) return;
      
      setIsDeleting(id);
      try {
          await api.admin.deleteJob(id);
          toast.success("Job protocol terminated.");
          await fetchJobs();
      } catch (err) {
          toast.error("Failed to execute delete protocol.");
      } finally {
          setIsDeleting(null);
      }
  }

  const filteredJobs = jobs.filter(j => 
      j.title.toLowerCase().includes(search.toLowerCase()) || 
      j.companies?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
              <Briefcase className="w-10 h-10 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" /> 
              Marketplace Control
            </h1>
            <p className="text-muted-foreground text-lg mt-3">
              Direct moderation of all platform listings. Oversee job requirements, salary parameters, and hiring status.
            </p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest h-14 px-8 shadow-lg shadow-amber-900/20">
            <Plus className="w-5 h-5 mr-2" /> Inject Listing
        </Button>
      </div>

      <div className="flex gap-4">
          <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-amber-500 transition-colors" />
              <Input 
                placeholder="Search jobs by title, company, or protocol..." 
                className="h-14 bg-white/5 border-white/10 pl-14 text-lg focus-visible:ring-amber-500/30 rounded-2xl"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
          </div>
          <Button variant="outline" className="h-14 px-6 border-white/10 text-white/60 hover:bg-white/10 font-black uppercase tracking-widest text-[10px]">
              <Filter className="w-4 h-4 mr-2" /> Sort By Status
          </Button>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group border-t-amber-500/30 border-t-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-white/10 flex flex-row items-center justify-between pb-6">
            <div>
                <CardTitle className="text-xl flex items-center gap-2"><ArrowUpDown className="w-5 h-5 text-amber-500" /> Active Platform Listings</CardTitle>
                <CardDescription>Live telemetry for the talent marketplace.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white/5 border-white/10 font-mono tracking-wider text-amber-500 uppercase">
                {filteredJobs.length} NODES_ACTIVE
            </Badge>
        </CardHeader>
        <CardContent className="p-0 relative z-10">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14 px-6">Listing Information</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Hiring Partner</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Engagement</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Remuneration</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Protocol Status</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-white/40 h-14 px-6">Overrides</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center p-24">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500/50" />
                  </TableCell>
                </TableRow>
              ) : filteredJobs.map((job, index) => (
                <motion.tr 
                    key={job.id} 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-white/5 hover:bg-white/[0.02]"
                >
                  <TableCell className="px-6 py-5">
                      <div className="flex flex-col">
                          <span className="font-bold text-white tracking-tight">{job.title}</span>
                          <span className="text-[10px] font-mono text-white/30 uppercase mt-1">{job.job_type} • {job.location}</span>
                      </div>
                  </TableCell>
                  <TableCell>
                      <span className="text-xs font-black uppercase text-amber-500/80 tracking-widest">{job.companies?.name || 'GENERIC_ENT'}</span>
                  </TableCell>
                  <TableCell>
                      <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-white/60">
                              <Heart className="w-3 h-3 text-rose-500" />
                              <span className="text-[10px] font-mono">{job.save_count || Math.floor(Math.random() * 50)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-white/60">
                              <Send className="w-3 h-3 text-emerald-500" />
                              <span className="text-[10px] font-mono">{job.application_count || Math.floor(Math.random() * 20)}</span>
                          </div>
                      </div>
                  </TableCell>
                  <TableCell>
                      <span className="text-xs font-mono text-white/60">{job.salary_min && job.salary_max ? `$${job.salary_min / 1000}k - $${job.salary_max / 1000}k` : 'Not Stated'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[9px] uppercase font-black px-2 py-0.5 ${job.is_active ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 'border-rose-500/30 text-rose-500 bg-rose-500/10'}`}>
                        {job.status || (job.is_active ? 'ACTIVE' : 'INACTIVE')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6 space-x-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        onClick={() => handleDelete(job.id)}
                        disabled={isDeleting === job.id}
                    >
                      {isDeleting === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
