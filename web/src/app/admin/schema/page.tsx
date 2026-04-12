"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
    ShieldAlert, 
    Plus, 
    Loader2, 
    Database, 
    Trash2, 
    Edit, 
    Layers, 
    LayoutGrid, 
    ArrowUpDown,
    Type,
    FileCode,
    Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api/api-client";
import { toast } from "sonner";

export default function SchemaBuilder() {
  const { user, isLoading: authLoading } = useAuth();
  const [fields, setFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newField, setNewField] = useState({
    field_name: "", 
    field_label: "",
    field_type: "text",
    section: "BASIC_INFO",
    required: false,
    placeholder: "",
    display_order: 0
  });

  const SECTION_OPTIONS = [
      { id: "BASIC_INFO", label: "Basic Identity" },
      { id: "SKILLS", label: "Core Proficiencies" },
      { id: "EXPERIENCE", label: "Career Experience" },
      { id: "PROJECTS", label: "Project Portfolio" },
      { id: "CERTIFICATIONS", label: "Verifications" },
      { id: "SOCIAL", label: "Network Links" }
  ];

  const TYPE_OPTIONS = [
      { id: "text", label: "Single Line Text" },
      { id: "textarea", label: "Multi-line Area" },
      { id: "number", label: "Numeric Value" },
      { id: "url", label: "Resource URL" },
      { id: "select", label: "Drop-down Menu" },
      { id: "date", label: "Calendar Date" },
      { id: "file_upload", label: "Cloud/IPFS Upload" }
  ];

  useEffect(() => {
    if(!authLoading) fetchSchema();
  }, [authLoading]);

  const fetchSchema = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getSchema();
      setFields(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Schema fetch error:", err);
      toast.error("Failed to fetch schema matrix");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddField = async () => {
    if (!newField.field_name || !newField.field_label) {
        toast.error("Name and Label are required");
        return;
    }
    
    setIsSaving(true);
    try {
      await api.admin.createSchema({
          ...newField,
          display_order: newField.display_order || fields.length + 1
      });
      toast.success("Structural parameter deployed");
      await fetchSchema();
      setNewField({ field_name: "", field_label: "", field_type: "text", section: "BASIC_INFO", required: false, placeholder: "", display_order: 0 });
    } catch (err) {
      console.error("Schema add error:", err);
      toast.error("Deployment failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteField = async (id: string) => {
    if (!confirm("Are you sure you want to purge this parameter from the registry?")) return;
    try {
      await api.admin.deleteSchema(id);
      toast.success("Parameter expunged");
      await fetchSchema();
    } catch (err) {
      console.error("Schema delete error:", err);
      toast.error("Expunge operation failed");
    }
  };

  if (!authLoading && user?.role !== "admin" && user?.role !== "super_admin" && process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full" />
            <ShieldAlert className="w-24 h-24 text-rose-500 relative z-10" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-widest text-white">Access Denied</h2>
        <p className="text-muted-foreground text-lg uppercase tracking-widest italic">Administrator Clearance Required.</p>
      </div>
    );
  }

  // Section-based grouping
  const groupedFields = SECTION_OPTIONS.map(section => ({
      ...section,
      fields: fields.filter(f => f.section === section.id).sort((a,b) => (a.display_order || 0) - (b.display_order || 0))
  })).filter(s => s.fields.length > 0 || fields.filter(f => !SECTION_OPTIONS.map(so => so.id).includes(f.section)).length > 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col justify-between items-start gap-4">
        <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
          <Database className="w-10 h-10 text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]" /> 
          Meta-Schema Engine
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Architect the platform's core identity matrix. Define how user data is collected, structured, and validated across the entire talent network.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          
          {/* Builder Panel */}
          <div className="xl:col-span-1 space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group border-t-indigo-500/30 border-t-2 sticky top-24">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl flex items-center gap-2 font-bold"><Plus className="w-5 h-5 text-indigo-500" /> Construct Parameter</CardTitle>
                  <CardDescription>Synthesize a new data collection module.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 relative z-10 pt-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Field Identity (Key)</label>
                        <Input 
                            placeholder="e.g. github_handle" 
                            className="bg-black/40 border-white/10 h-12 focus-visible:ring-indigo-500/50 font-mono text-sm"
                            value={newField.field_name}
                            onChange={e => setNewField({...newField, field_name: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-white/40">UI Label (Frontend Display)</label>
                        <Input 
                            placeholder="e.g. GitHub Repository" 
                            className="bg-black/40 border-white/10 h-12 focus-visible:ring-indigo-500/50"
                            value={newField.field_label}
                            onChange={e => setNewField({...newField, field_label: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Schema Section</label>
                        <Select value={newField.section} onValueChange={(v) => setNewField({...newField, section: v})}>
                            <SelectTrigger className="bg-black/40 border-white/10 h-12">
                                <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-950 border-white/10 text-white">
                                {SECTION_OPTIONS.map(opt => (
                                    <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Data Type</label>
                            <Select value={newField.field_type} onValueChange={(v) => setNewField({...newField, field_type: v})}>
                                <SelectTrigger className="bg-black/40 border-white/10 h-12 text-xs">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-white/10 text-white">
                                    {TYPE_OPTIONS.map(opt => (
                                        <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/40">Order</label>
                            <Input 
                                type="number"
                                className="bg-black/40 border-white/10 h-12"
                                value={newField.display_order}
                                onChange={e => setNewField({...newField, display_order: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white/80">Required Parameter</span>
                            <span className="text-[10px] text-white/30 italic">Enforce user input in flows.</span>
                        </div>
                        <Switch 
                            checked={newField.required} 
                            onCheckedChange={(v) => setNewField({...newField, required: v})} 
                            className="data-[state=checked]:bg-indigo-500"
                        />
                    </div>
                    
                    <Button 
                        onClick={handleAddField} 
                        disabled={isSaving || !newField.field_name} 
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest uppercase mt-4 shadow-[0_0_20px_rgba(99,102,241,0.4)] h-14"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Deploy Logic</>}
                    </Button>
                </CardContent>
              </Card>
          </div>

          {/* Rendered Matrix */}
          <div className="xl:col-span-3 space-y-10">
              
              {isLoading ? (
                  <div className="py-40 flex justify-center"><Loader2 className="w-16 h-16 animate-spin text-indigo-500/20" /></div>
              ) : (
                <AnimatePresence>
                    {groupedFields.map((section, sIdx) => (
                        <motion.div 
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sIdx * 0.1 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3 px-2">
                                <LayoutGrid className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white/90">{section.label}</h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {section.fields.map((field, fIdx) => (
                                    <Card key={field.id} className="bg-white/5 border-white/10 backdrop-blur-md group hover:border-indigo-500/40 transition-all duration-300 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <CardContent className="p-5 flex items-center justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                                    {field.field_type === 'file_upload' ? <FileCode className="w-5 h-5 text-indigo-400" /> : <Type className="w-5 h-5 text-white/60" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-white tracking-tight">{field.field_label || field.field_name}</span>
                                                        {field.required && <Badge className="bg-rose-500/10 text-rose-500 text-[8px] h-4 font-black border-rose-500/20 px-1.5 uppercase">Required Flag</Badge>}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <code className="text-[10px] text-indigo-400 font-mono bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 uppercase tracking-tighter">{field.field_name}</code>
                                                        <span className="text-white/20 text-[10px] uppercase font-black tracking-widest">• {field.field_type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-white/20 hover:text-white hover:bg-white/10"><ArrowUpDown className="w-4 h-4" /></Button>
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-white/20 hover:text-indigo-400 hover:bg-indigo-500/10"><Settings className="w-4 h-4" /></Button>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-9 w-9 text-white/10 hover:text-rose-500 hover:bg-rose-500/10"
                                                    onClick={() => handleDeleteField(field.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
              )}
              
              {fields.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center py-40 text-center space-y-4">
                      <div className="p-6 bg-white/5 rounded-full border border-white/10"><Layers className="w-12 h-12 text-white/20" /></div>
                      <div>
                          <h3 className="text-xl font-bold text-white/60">Schema Registry Blank</h3>
                          <p className="text-white/30 text-sm">No topological parameters have been defined for the network.</p>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}
