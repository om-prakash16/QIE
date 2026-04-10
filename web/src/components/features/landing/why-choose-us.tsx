'use client';

import { ShieldCheck, Zap, BarChart3, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCMS } from '@/context/cms-context';

const ICON_MAP: Record<string, any> = {
  ShieldCheck, Zap, BarChart3, Users, Briefcase
};

export function WhyChooseUs() {
  const { getVal, getJson } = useCMS();

  const title = getVal("features", "title", "The Best Hiring Tool Paradigm");
  const subtitle = getVal("features", "subtitle", "We've discarded traditional hiring friction for verified cryptographic certainty.");
  const features = getJson("features", "cards") || [
    { title: 'Precision Verification', description: 'On-chain proof of expertise verified through Solana-based NFT skill badges.', icon: 'ShieldCheck' },
    { title: 'AI Insights', description: 'Gemini 1.5 analyzes resumes and technical repo data to find perfect matches.', icon: 'Zap' },
  ];

  const titleParts = title.split(" ");
  return (
    <section className="py-24 px-4 bg-muted/5 border-t border-primary/5">
      <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row gap-20">
        <div className="lg:w-1/3 space-y-8">
            <h2 className="text-5xl font-black tracking-tighter leading-[1.1] uppercase">
                {titleParts[0]} {titleParts[1]} <br /><span className="text-primary italic">{titleParts.slice(2).join(" ")}</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
               {subtitle}
            </p>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-12">
            {features.map((feature: any, i: number) => {
                const Icon = ICON_MAP[feature.icon] || Briefcase;
                return (
                    <div key={feature.title} className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-black tracking-tighter">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                );
            })}
        </div>
      </div>
    </section>
  );
}
