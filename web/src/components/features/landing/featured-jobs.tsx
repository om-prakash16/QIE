'use client';

import { Card } from '@/components/ui/card';
import { JobCard } from '@/components/shared/job-card';
import { JOBS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FeaturedJobs() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl space-y-12">
        <div className="text-center space-y-4">
            <h2 className="text-5xl font-black tracking-tighter leading-none">
                Featured <span className="text-primary italic">Requisitions</span>
            </h2>
            <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
                Top roles at verified Web3 and AI organizations
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {JOBS.slice(0, 3).map((job) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>

        <div className="flex justify-center pt-8">
            <Link href="/jobs">
                <Button variant="outline" className="h-12 px-12 rounded-xl bg-card border-primary/10 hover:border-primary/40 font-bold uppercase text-xs tracking-widest">
                    Explore Directory
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
