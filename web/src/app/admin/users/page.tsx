"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
    Loader2, 
    Users, 
    ShieldAlert, 
    ShieldCheck, 
    Search, 
    UserX, 
    MoreVertical, 
    Fingerprint,
    ExternalLink,
    Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingWallet, setUpdatingWallet] = useState<string | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user matrix.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (wallet: string, updates: any) => {
    setUpdatingWallet(wallet);
    try {
      await api.admin.updateUser(wallet, updates);
      toast.success("Security profile synchronized.");
      await fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update entity status.");
    } finally {
      setUpdatingWallet(null);
    }
  };

  const filteredUsers = users.filter(user => {
      const matchesSearch = (user.wallet_address || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (user.username || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
            <Users className="w-10 h-10 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" /> 
            Entity Observation
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Monitor and govern active platform identities. Escalate execution privileges, verify professional provenance, or terminate access for non-compliant actors.
          </p>
        </div>
      </div>

      {/* Global Filter Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl md:col-span-3">
              <CardContent className="p-3 px-6 flex items-center gap-4">
                  <Search className="w-5 h-5 text-white/20" />
                  <Input 
                    placeholder="Search by wallet signature or alias..." 
                    className="bg-transparent border-none text-lg focus-visible:ring-0 placeholder:text-white/20 h-12"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <div className="h-8 w-px bg-white/10 mx-2" />
                  <Filter className="w-5 h-5 text-white/20" />
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-48 bg-transparent border-none focus:ring-0 text-white font-bold uppercase tracking-widest text-xs">
                          <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 text-white">
                          <SelectItem value="all">ALL ENTITIES</SelectItem>
                          <SelectItem value="admin">ADMINISTRATORS</SelectItem>
                          <SelectItem value="COMPANY">CORPORATE ENTITIES</SelectItem>
                          <SelectItem value="USER">CANDIDATES</SelectItem>
                      </SelectContent>
                  </Select>
              </CardContent>
          </Card>
          <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl md:col-span-1 border-t-rose-500/20">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Entities:</span>
              <span className="text-xl font-black text-rose-500 ml-4 font-mono">{filteredUsers.length}</span>
          </div>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group border-t-rose-500/30 border-t-2">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
        <CardContent className="p-0 relative z-10">
          <Table>
            <TableHeader className="bg-black/40 border-b border-white/10">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14 px-8">Identity Signature</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Protocol Role</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Resonance Score</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-14">Status</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-white/40 h-14 px-8">Terminal Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center p-24">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto text-rose-500/30" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center p-24 text-white/30 italic">No matching identities found in current scope.</TableCell>
                </TableRow>
              ) : filteredUsers.map((user, index) => (
                <motion.tr 
                    key={user.id || user.wallet_address} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-indigo-500/20 flex items-center justify-center border border-white/10">
                              <Fingerprint className="w-5 h-5 text-white/40" />
                          </div>
                          <div className="flex flex-col">
                              <span className="font-bold text-white tracking-tight">{user.username || "ANON_ACTOR"}</span>
                              <code className="text-[10px] font-mono text-white/30 uppercase mt-0.5 tracking-tighter">
                                {user.wallet_address.substring(0,6)}...{user.wallet_address.substring(user.wallet_address.length - 4)}
                              </code>
                          </div>
                      </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                        variant="outline" 
                        className={`text-[9px] uppercase font-black tracking-widest border-white/10 shadow-inner px-2.5 py-1 ${
                            user.role === 'admin' || user.role === 'super_admin' ? 'border-amber-500/40 text-amber-500 bg-amber-500/10' : 
                            user.role === 'COMPANY' ? 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' :
                            'text-white/40 bg-black/40'
                        }`}
                    >
                        {user.role || 'USER'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-rose-500/40" style={{ width: `${user.skill_score || 0}%` }} />
                        </div>
                        <span className="font-black italic text-xs text-white/60">
                            {user.skill_score || '0.00'}
                        </span>
                    </div>
                  </TableCell>
                  <TableCell>
                      {user.is_active !== false ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-widest">Active Access</Badge>
                      ) : (
                          <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[8px] font-black uppercase tracking-widest">Terminated</Badge>
                      )}
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-white/30 hover:text-white hover:bg-white/10">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-950 border-white/10 text-white w-56">
                                <DropdownMenuLabel className="text-[10px] uppercase font-black text-white/40 tracking-widest">Privilege Escalation</DropdownMenuLabel>
                                <DropdownMenuItem className="focus:bg-indigo-500 cursor-pointer text-xs" onClick={() => handleUpdateUser(user.wallet_address, { role: 'COMPANY' })}>
                                    <ShieldCheck className="w-4 h-4 mr-2" /> Promote Recruiter
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-amber-500 cursor-pointer text-xs" onClick={() => handleUpdateUser(user.wallet_address, { role: 'admin' })}>
                                    <ShieldAlert className="w-4 h-4 mr-2" /> Grant Admin Rights
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-xs" onClick={() => handleUpdateUser(user.wallet_address, { role: 'USER' })}>
                                    <Users className="w-4 h-4 mr-2" /> Revoke to Candidate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuLabel className="text-[10px] uppercase font-black text-rose-500/60 tracking-widest">Governance</DropdownMenuLabel>
                                <DropdownMenuItem className="focus:bg-rose-500 cursor-pointer text-xs font-bold" onClick={() => handleUpdateUser(user.wallet_address, { is_active: !user.is_active })}>
                                    <UserX className="w-4 h-4 mr-2 text-rose-500" /> {user.is_active !== false ? "Terminate Access" : "Restore Access"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-indigo-400/50 hover:text-indigo-400 hover:bg-indigo-500/10" title="View Digital Identity">
                            <ExternalLink className="w-4 h-4" />
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
    </div>
  );
}
