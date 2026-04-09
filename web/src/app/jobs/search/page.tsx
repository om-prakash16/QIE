'use client';

import { SearchHeader } from '@/components/search/SearchHeader';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';

const MOCK_JOBS = [
  { id: 1, title: 'Senior Backend Engineer', company: 'Solana Labs', location: 'Remote', salary: '$140k - $180k', type: 'Full-time', posted: '2d ago', score: 98 },
  { id: 2, title: 'Rust Developer (FastAPI)', company: 'Magic Eden', location: 'Remote', salary: '$120k - $160k', type: 'Contract', posted: '4d ago', score: 85 },
];

export default function JobSearchPage() {
  const handleSearch = (query: string, isSemantic: boolean) => {
    console.log(`Searching Jobs: ${query} (AI: ${isSemantic})`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <FilterSidebar />

        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Job Board</h1>
              <p className="text-muted-foreground mt-1">Found {MOCK_JOBS.length} top opportunities with AI matching enabled.</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-primary/30 text-primary">AI Match: Top 1%</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {MOCK_JOBS.map((job) => (
              <div key={job.id} className="p-6 border rounded-2xl bg-card/20 hover:border-indigo-500/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                      <Badge variant="secondary" className="text-[10px] uppercase font-black tracking-widest">{job.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</div>
                      <div className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.company}</div>
                      <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</div>
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.posted}</div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">Rust</Badge>
                      <Badge variant="outline">Solana</Badge>
                      <Badge variant="outline">FastAPI</Badge>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="w-12 h-12 rounded-full border-2 border-indigo-500 flex items-center justify-center text-sm font-bold text-indigo-400">
                      {job.score}%
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Match Rank</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
