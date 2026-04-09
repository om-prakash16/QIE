"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Layout, Save, Globe, Smartphone, Search, RefreshCw, PenTool, Image as LucideImage } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings, Share2, Code } from "lucide-react";

export default function CMSEditor() {
  const [content, setContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCMS();
  }, []);

  const fetchCMS = async () => {
    setIsLoading(true);
    try {
      const data = await api.cms.all();
      setContent(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync CMS registry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (item: any) => {
    // Basic JSON validation for lists
    if (item.metadata?.type?.includes('_list')) {
        try {
            JSON.parse(item.content_value);
        } catch (e) {
            toast.error(`Invalid JSON structure in ${item.content_key}. Mutation aborted.`);
            return;
        }
    }

    setIsSaving(item.id);
    try {
      await api.cms.update({
          section_key: item.section_key,
          content_key: item.content_key,
          content_value: item.content_value,
          metadata: item.metadata
      });
      toast.success(`'${item.content_key}' updated in the ${item.section_key} module.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to propagate CMS mutation.");
    } finally {
      setIsSaving(null);
    }
  };

  const sections = Array.from(new Set(content.map(c => c.section_key)));
  
  const landingSections = ['hero', 'stats', 'features', 'sectors'];
  const globalSections = ['global', 'seo'];
  const navSections = ['navbar', 'footer'];

  const filteredContent = content.filter(c => 
      c.section_key.toLowerCase().includes(search.toLowerCase()) || 
      c.content_key.toLowerCase().includes(search.toLowerCase()) ||
      c.content_value.toLowerCase().includes(search.toLowerCase())
  );

  const renderSection = (section: string) => {
      const sectionItems = filteredContent.filter(c => c.section_key === section);
      if (sectionItems.length === 0) return null;

      return (
        <section key={section} className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <Layout className="w-4 h-4 text-white/40" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500/80">{section} Architecture</h2>
                <div className="flex-1 h-px bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sectionItems.map(item => (
                    <Card key={item.id} className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:bg-white-[0.07] transition-all group overflow-hidden">
                        <CardHeader className="pb-4 border-b border-white/5 bg-black/20">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <PenTool className="w-3 h-3 text-emerald-500/60" />
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-white/60">{item.content_key}</CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.metadata?.type?.includes('_list') && <Badge className="bg-blue-500/20 text-blue-400 text-[9px] border-blue-500/30">JSON_CORE</Badge>}
                                    <Badge variant="outline" className="text-[9px] border-white/10 text-white/30 tracking-tighter uppercase italic">{item.section_key}</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {item.content_value.length > 60 || item.metadata?.type?.includes('_list') ? (
                                <div className="relative">
                                    <Textarea 
                                        className={`bg-black/40 border-white/10 text-white min-h-[160px] focus-visible:ring-emerald-500/30 leading-relaxed font-mono text-sm ${item.metadata?.type?.includes('_list') ? 'text-blue-200' : ''}`}
                                        value={item.content_value}
                                        onChange={e => setContent(content.map(c => c.id === item.id ? {...c, content_value: e.target.value} : c))}
                                        placeholder={`Enter ${item.metadata?.type || 'content'} mutation...`}
                                    />
                                    {item.metadata?.type?.includes('_list') && <Code className="absolute bottom-3 right-3 w-4 h-4 text-blue-500/40" />}
                                </div>
                            ) : (
                                <div className="relative">
                                    <Input 
                                        className="bg-black/40 border-white/10 text-white h-12 font-medium text-sm focus-visible:ring-emerald-500/30"
                                        value={item.content_value}
                                        onChange={e => setContent(content.map(c => c.id === item.id ? {...c, content_value: e.target.value} : c))}
                                    />
                                    {item.content_key.includes('url') && <LucideImage className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />}
                                </div>
                            )}
                            
                            <Button 
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-widest uppercase h-12 shadow-lg shadow-emerald-900/20"
                                onClick={() => handleUpdate(item)}
                                disabled={isSaving === item.id}
                            >
                                {isSaving === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Commit Mutation</>}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
      );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
              <Globe className="w-10 h-10 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" /> 
              Content Orchestrator
            </h1>
            <p className="text-muted-foreground text-lg mt-3">
              Dynamic mutation of public-facing text, SEO parameters, and brand assets. Changes propagate instantly to the landing page.
            </p>
        </div>
        <div className="flex items-center gap-3">
            <Button onClick={fetchCMS} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]">
                <RefreshCw className="w-3 h-3 mr-2" /> Sync Registry
            </Button>
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest uppercase">Live CMS Link</span>
            </div>
        </div>
      </div>

      <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            placeholder="Search content keys or values..." 
            className="h-14 bg-white/5 border-white/10 pl-14 text-lg focus-visible:ring-emerald-500/30 rounded-2xl"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
      </div>

      <div className="grid grid-cols-1 gap-12">
          {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 animate-spin text-emerald-500/40" />
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20 animate-pulse">Establishing Secure CMS Channel...</p>
              </div>
          ) : (
            <Tabs defaultValue="landing" className="space-y-12">
                <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-2xl">
                    <TabsTrigger value="landing" className="h-12 px-8 rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] gap-2">
                        <LayoutDashboard className="w-3 h-3" /> Landing Matrix
                    </TabsTrigger>
                    <TabsTrigger value="navigation" className="h-12 px-8 rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] gap-2">
                        <Share2 className="w-3 h-3" /> Global Nav
                    </TabsTrigger>
                    <TabsTrigger value="global" className="h-12 px-8 rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white font-black uppercase tracking-widest text-[10px] gap-2">
                        <Settings className="w-3 h-3" /> System & SEO
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="landing" className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                    {landingSections.map(s => renderSection(s))}
                </TabsContent>

                <TabsContent value="navigation" className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                    {navSections.map(s => renderSection(s))}
                </TabsContent>

                <TabsContent value="global" className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                    {globalSections.map(s => renderSection(s))}
                </TabsContent>
            </Tabs>
          )}
      </div>

      <div className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-500/10 to-blue-500/5 border border-white/10 flex flex-col items-center text-center gap-6 mt-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] pointer-events-none" />
          <div className="p-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 relative z-10">
              <Smartphone className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Omnichannel Deployment</h3>
              <p className="text-sm text-white/50 max-w-md">Content updates made here are synchronized across Desktop, Mobile, and AI summary generators in real-time.</p>
          </div>
      </div>
    </div>
  );
}
