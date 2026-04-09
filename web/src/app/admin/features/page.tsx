"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeatureToggleCard } from "@/components/admin/FeatureToggleCard";
import { ShieldAlert, Search, Filter, Loader2, SlidersHorizontal, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";

export default function AdminFeatureControl() {
  const [features, setFeatures] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getFeatures();
      setFeatures(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch features.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (name: string, is_enabled: boolean) => {
    try {
        await api.admin.updateFeature({ feature_name: name, is_enabled });
        // Optionally update local state without refetching if successful
        setFeatures(prev => prev.map(f => f.feature_name === name ? { ...f, is_enabled } : f));
    } catch (err) {
        toast.error("Failed to update feature flag.");
        throw err;
    }
  };

  const categories = ['ai', 'web3', 'marketplace', 'advanced'];

  return (
    <div className="max-w-7xl mx-auto py-24 px-6 space-y-12 h-screen overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-12">
        <div className="space-y-4">
           <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-4 py-1 uppercase tracking-tighter font-black italic">
             ADMIN COMMAND CENTER
           </Badge>
           <h1 className="text-6xl font-black font-heading tracking-tighter italic uppercase flex items-center gap-4">
             Feature Registry <SlidersHorizontal className="w-10 h-10 text-primary" />
           </h1>
           <p className="text-muted-foreground max-w-xl italic">Dynamic configuration for the this best hiring tool ecosystem. Toggle platform capabilities in real-time without redeploying code.</p>
        </div>
        <div className="flex gap-4">
            <Button onClick={fetchFeatures} size="lg" variant="outline" className="h-16 px-8 border-white/10 font-black tracking-tight italic flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 mr-1" /> REFRESH STATUS
            </Button>
            <Button size="lg" className="h-16 px-8 bg-white text-black hover:bg-neutral-200 font-black tracking-tight italic">
                LOGS & AUDIT
            </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-500" />
                <Input 
                    placeholder="Search flags by name or description..." 
                    className="h-14 bg-white/5 border-white/10 pl-16 text-xl focus-visible:ring-primary/50 transition-all rounded-2xl"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <Button variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
                <Filter className="w-4 h-4 ml-2" /> CATEGORY
            </Button>
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div className="py-24 flex justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-12">
          {categories.map(category => (
            <div key={category} className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 italic">{category} Systems</h2>
                    <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features
                        .filter(f => f.category === category)
                        .filter(f => f.feature_name.toLowerCase().includes(search.toLowerCase()))
                        .map(feature => (
                            <FeatureToggleCard 
                                key={feature.id} 
                                feature={feature} 
                                onToggle={handleToggle}
                            />
                        ))
                    }
                </div>
            </div>
          ))}
        </div>
      )}

      {/* Safety Alert */}
      <div className="p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex flex-col md:flex-row items-center gap-6">
          <ShieldAlert className="w-12 h-12 text-rose-500 shrink-0" />
          <div className="space-y-1 flex-1">
              <h4 className="text-lg font-black italic uppercase italic">Experimental Flag Warning</h4>
              <p className="text-xs text-rose-500/70 font-medium italic">Enabling flags in the 'Advanced' or 'Experiment' categories may trigger AI pipelines (RAG) which impact compute overhead. Monitor analytics during rollout.</p>
          </div>
          <Button variant="outline" className="h-12 px-8 border-rose-500/20 text-rose-500 hover:bg-rose-500/10 font-bold uppercase tracking-widest italic text-[10px]">
              LEARN MORE
          </Button>
      </div>
    </div>
  );
}
