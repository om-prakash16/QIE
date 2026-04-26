'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code2, 
  Cpu, 
  Globe2, 
  BarChart4, 
  ShieldCheck, 
  Smartphone,
  Bitcoin,
  Briefcase,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCMS } from '@/context/cms-context';

const ICON_MAP: Record<string, any> = {
  Code2, Cpu, Globe2, BarChart4, ShieldCheck, Bitcoin, Search, Briefcase
};

export function Categories() {
  const { getVal, getJson } = useCMS();
  
  const title = getVal("sectors", "title", "Intelligence Sectors");
  const subtitle = getVal("sectors", "subtitle", "Explore professional resonance across emerging technical stacks.");
  const categories = getJson("sectors", "list") || [
    { name: 'Software Engineering', count: 1240, icon: 'Code2', color: 'indigo' },
    { name: 'AI & Neural Systems', count: 850, icon: 'Cpu', color: 'purple' },
    { name: 'Blockchain & Web3', count: 620, icon: 'Bitcoin', color: 'orange' },
  ];

  const titleParts = title.split(" ");
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
            <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Intelligence Nodes</h2>
                <h3 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
                    {titleParts[0]} <span className="text-primary not-italic">{titleParts.slice(1).join(" ")}</span>
                </h3>
            </div>
            <div className="hidden md:flex items-center gap-3 px-6 py-3 rounded-2xl glass border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary shadow-xl shadow-primary/5">
                <Search className="w-4 h-4" />
                Live Indexing Protocol Active
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat: any, i: number) => {
                const Icon = ICON_MAP[cat.icon] || Briefcase;
                return (
                    <motion.div 
                        key={cat.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                    >
                        <Card className="group p-10 glass border-white/5 hover:border-primary/40 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-primary/10 rounded-[2.5rem] overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full group-hover:bg-primary/10 transition-colors" />
                            
                            <div className="flex justify-between items-start mb-10">
                                <div className="w-16 h-16 rounded-[1.25rem] bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 shadow-inner">
                                    <Icon className="w-8 h-8 text-white/20 group-hover:text-primary transition-colors" />
                                </div>
                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-white/5 text-white/20 py-1.5 px-4 rounded-xl">
                                    {cat.count && cat.count.toLocaleString()} ACTIVE NODES
                                </Badge>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black tracking-tight uppercase italic text-white group-hover:text-primary transition-colors">{cat.name}</h3>
                                <div className="h-1 w-12 bg-primary/20 group-hover:w-20 group-hover:bg-primary transition-all duration-500 rounded-full" />
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
      </div>
    </section>
  );
}
