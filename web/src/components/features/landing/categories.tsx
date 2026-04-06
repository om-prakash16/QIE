'use client';

import { Card } from '@/components/ui/card';
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
  
  const title = getVal("sectors", "title", "Market Sectors");
  const subtitle = getVal("sectors", "subtitle", "Explore hiring trends across emerging tech stacks.");
  const categories = getJson("sectors", "list") || [
    { name: 'Software Engineering', count: 1240, icon: 'Code2', color: 'indigo' },
    { name: 'AI & Data Science', count: 850, icon: 'Cpu', color: 'purple' },
    { name: 'Blockchain & Web3', count: 620, icon: 'Bitcoin', color: 'orange' },
  ];

  const titleParts = title.split(" ");
  return (
    <section className="py-24 px-4 bg-muted/5">
      <div className="container mx-auto max-w-7xl space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-primary/10 pb-8">
            <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic text-primary/40">{titleParts[0]} <span className="text-foreground not-italic">{titleParts.slice(1).join(" ")}</span></h2>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">{subtitle}</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-primary/10 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <Search className="w-3 h-3 text-primary" />
                Live Indexing active
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat: any, i: number) => {
                const Icon = ICON_MAP[cat.icon] || Briefcase;
                return (
                    <motion.div 
                        key={cat.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="group p-6 bg-card/20 backdrop-blur-xl border-primary/10 hover:border-primary/40 transition-all cursor-pointer hover:shadow-2xl hover:shadow-primary/10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">{cat.count && cat.count.toLocaleString()} Active Roles</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-black tracking-tighter uppercase">{cat.name}</h3>
                                <div className="h-1 w-8 bg-primary rounded-full" />
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
