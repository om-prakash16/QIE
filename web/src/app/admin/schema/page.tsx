"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, Plus, Loader2, Database, Trash2, Edit, Save, GitCommit, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api/api-client";

export default function SchemaBuilder() {
  const { user, isLoading: authLoading } = useAuth();
  const [fields, setFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newField, setNewField] = useState({
    field_name: "", 
    field_type: "text",
    section: "Professional Info",
    required: false,
    display_order: 0
  });

  useEffect(() => {
    if(!authLoading) fetchSchema();
  }, [authLoading]);

  const fetchSchema = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getSchema();
      if(!data.detail) {
          setFields(data || []);
      }
    } catch (err) {
      console.error("Schema fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddField = async () => {
    if (!newField.field_name) return;
    
    setIsSaving(true);
    try {
      const payload = {
          field_name: newField.field_name,
          field_type: newField.field_type,
          section: newField.section,
          required: newField.required,
          display_order: newField.display_order || fields.length + 1
      };
      await api.admin.createSchema(payload);
      await fetchSchema();
      setNewField({ field_name: "", field_type: "text", section: "Professional Info", required: false, display_order: 0 });
    } catch (err) {
      console.error("Schema add error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteField = async (id: string) => {
    if (!confirm("Are you sure you want to purge this parameter from the registry?")) return;
    try {
      await api.admin.deleteSchema(id);
      await fetchSchema();
    } catch (err) {
      console.error("Schema delete error:", err);
    }
  };

  if (!authLoading && user?.role !== "admin" && process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full" />
            <ShieldAlert className="w-24 h-24 text-rose-500 relative z-10" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Access Denied</h2>
        <p className="text-muted-foreground text-lg uppercase tracking-widest">Administrator Clearance Required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col justify-between items-start gap-4">
        <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
          <Database className="w-10 h-10 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" /> 
          Profile Schema Engine
        </h1>
        <p className="text-muted-foreground text-lg">
          Dynamically alter the structural matrix of professional profiles. Changes immediately propagate to candidate registration flows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Builder Panel */}
          <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl flex items-center gap-2"><Plus className="w-5 h-5 text-blue-500" /> Construct Parameter</CardTitle>
                  <CardDescription>Synthesize a new data collection module.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-black text-white/50">Field Name (Label & Key)</label>
                        <Input 
                            placeholder="e.g. GitHub URL" 
                            className="bg-black/40 border-white/10 text-white focus-visible:ring-blue-500/50"
                            value={newField.field_name}
                            onChange={e => setNewField({...newField, field_name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-black text-white/50">Section</label>
                        <Select value={newField.section} onValueChange={(v) => setNewField({...newField, section: v})}>
                            <SelectTrigger className="bg-black/40 border-white/10 text-white focus-visible:ring-blue-500/50">
                                <SelectValue placeholder="Section" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#030712] border-white/10 text-white">
                                <SelectItem value="Professional Info">Professional Info</SelectItem>
                                <SelectItem value="Web3 Heritage">Web3 Heritage</SelectItem>
                                <SelectItem value="Personality Analytics">Personality Analytics</SelectItem>
                                <SelectItem value="Verification Logic">Verification Logic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-black text-white/50">Data Type</label>
                        <Select value={newField.field_type} onValueChange={(v) => setNewField({...newField, field_type: v})}>
                            <SelectTrigger className="bg-black/40 border-white/10 text-white focus-visible:ring-blue-500/50">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#030712] border-white/10 text-white">
                                <SelectItem value="text">Text (Short)</SelectItem>
                                <SelectItem value="textarea">Textarea (Long)</SelectItem>
                                <SelectItem value="number">Numeric</SelectItem>
                                <SelectItem value="url">URL Signature</SelectItem>
                                <SelectItem value="select">Dropdown Menu</SelectItem>
                                <SelectItem value="file">File Upload (IPFS)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <Button 
                        onClick={handleAddField} 
                        disabled={isSaving || !newField.field_name} 
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black tracking-widest uppercase mt-4 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Parameter"}
                    </Button>
                </CardContent>
              </Card>
          </div>

          {/* Rendered Matrix */}
          <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-full shadow-2xl overflow-hidden relative border-t-blue-500/30 border-t-2">
                <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2"><Layers className="w-5 h-5 text-blue-500" /> Active Schema Matrix</CardTitle>
                            <CardDescription>Current deployment configuration for the profile network.</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase font-black tracking-widest text-white/70">
                            {fields.length} Parameters Active
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                    <TableHeader className="bg-white/5 border-b border-white/10">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-10 px-6">Name / Section</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-white/40 h-10">Type</TableHead>
                            <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-white/40 h-10 px-6">Registry Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                        {isLoading ? (
                            <TableRow>
                            <TableCell colSpan={3} className="text-center p-12">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500/50" />
                            </TableCell>
                            </TableRow>
                        ) : fields.map(field => (
                            <motion.tr 
                                key={field.id} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="border-b border-white/5 hover:bg-white/[0.02]"
                            >
                            <TableCell className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-bold text-white/90">{field.field_name}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 flex items-center gap-1">
                                        <GitCommit className="w-3 h-3" /> {field.section}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <code className="text-xs bg-black/50 border border-white/10 px-2.5 py-1 rounded-md text-white/70 font-mono shadow-inner shadow-black/50 uppercase">
                                    {field.field_type}
                                </code>
                            </TableCell>
                            <TableCell className="text-right px-6">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                                    onClick={() => handleDeleteField(field.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  );
}
