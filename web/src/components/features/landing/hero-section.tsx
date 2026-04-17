'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api/api-client';

export function HeroSection() {
  const [content, setContent] = useState<any>({
    title: 'Verify Skills. Hire Intelligence.',
    subtitle: 'Best Hiring Tool uses Gemini 1.5 and Solana to verify professional expertise with on-chain precision. no more resume inflation.',
    badge: 'The Future of Web3 Talent is Here'
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await api.cms.section('hero');
        if (Array.isArray(data)) {
          const mapped = data.reduce((acc: any, item: any) => {
            acc[item.content_key] = item.content_value;
            return acc;
          }, {});
          if (Object.keys(mapped).length > 0) {
            setContent((prev: any) => ({ ...prev, ...mapped }));
          }
        }
      } catch (e) {
        console.error("CMS Sync Failed:", e);
      }
    };
    fetchHero();
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-background">
      {/* Neural Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-black uppercase tracking-widest"
        >
          <Sparkles className="w-3 h-3" />
          {content.badge}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h1 text-white max-w-4xl mx-auto"
        >
          {content.title.split('.').map((part: string, i: number) => (
            <span key={i} className={i === 1 ? "text-primary italic" : ""}>
              {part}{i === 0 && "."} {i === 0 && <br />}
            </span>
          ))}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="body-large text-muted-foreground max-w-2xl mx-auto"
        >
          {content.subtitle}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link href="/jobs">
            <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
              Discover Jobs <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/talent">
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-primary/20 bg-background/50 backdrop-blur-xl font-bold hover:bg-primary/5 transition-all text-white">
              Find Talent
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
