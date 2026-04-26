'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Talent } from '@/lib/mock-api/talent';
import { MapPin, Briefcase, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface TalentCardProps {
  talent: Talent & { match_score?: number };
}

export function TalentCard({ talent }: TalentCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="group relative overflow-hidden glass border-white/5 hover:border-primary/40 transition-all duration-500 rounded-[2.5rem] shadow-2xl hover:shadow-primary/5">
      <div className="p-8 space-y-8 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full group-hover:bg-primary/10 transition-colors" />
        
        {/* Profile Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-5">
            <div className="relative">
                <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-tr from-primary/20 to-indigo-500/20 p-0.5 group-hover:scale-105 transition-transform duration-500 shadow-lg">
                    <Avatar className="w-full h-full rounded-[1.2rem] border-none">
                        <AvatarImage src={talent.avatar} />
                        <AvatarFallback className="bg-black text-primary font-black italic">
                            {getInitials(talent.name)}
                        </AvatarFallback>
                    </Avatar>
                </div>
                {talent.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1 border border-white/10 shadow-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <h3 className="font-black text-xl italic leading-none tracking-tight text-white group-hover:text-primary transition-colors flex items-center gap-2">
                    {talent.name}
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{talent.title}</p>
            </div>
          </div>
          
          {talent.match_score !== undefined ? (
            <div className="flex flex-col items-end">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Resonance</p>
                <p className="text-2xl font-black italic text-primary leading-none">{Math.round(talent.match_score)}%</p>
            </div>
          ) : (
            <Badge className="glass bg-white/5 text-white/50 border-white/10 text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-xl group-hover:border-primary/20 group-hover:text-primary transition-all">
                <Zap className="w-3 h-3 mr-2" />
                {talent.availability}
            </Badge>
          )}
        </div>

        {/* Visual Progress */}
        <div className="space-y-3">
            <div className="flex justify-between text-[9px] uppercase font-black tracking-[0.3em] text-white/20">
                <span>Node Completion</span>
                <span className="text-white/40">{talent.completion}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] transition-all duration-1000" 
                    style={{ width: `${talent.completion}%` }}
                />
            </div>
        </div>

        {/* Talent Intelligence */}
        <div className="flex items-center gap-6">
            <div className="flex items-center text-[9px] uppercase font-black tracking-widest text-white/30">
                <MapPin className="w-3.5 h-3.5 mr-2 text-primary/50" />
                {talent.location}
            </div>
            <div className="flex items-center text-[9px] uppercase font-black tracking-widest text-white/30">
                <Briefcase className="w-3.5 h-3.5 mr-2 text-primary/50" />
                {talent.experience}
            </div>
        </div>

        {/* Skill Matrix */}
        <div className="pt-2 flex flex-wrap gap-2">
            {talent.skills.slice(0, 3).map(skill => (
                <Badge key={skill} variant="outline" className="glass border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 px-3 py-1 rounded-lg group-hover:border-primary/20 group-hover:text-primary/60 transition-colors">
                    {skill}
                </Badge>
            ))}
            {talent.skills.length > 3 && (
                <Badge variant="outline" className="glass border-white/10 text-[9px] font-black uppercase tracking-widest text-white/20 px-3 py-1 rounded-lg">
                    +{talent.skills.length - 3}
                </Badge>
            )}
        </div>
      </div>

      <Link href={`/talent/${talent.id}`} className="absolute inset-0 z-10" aria-label={`View ${talent.name}'s profile`} />
    </Card>
  );
}
