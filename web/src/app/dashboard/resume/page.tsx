'use client';

import { FileUploader } from './FileUploader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCheck, ShieldAlert, Sparkles } from 'lucide-react';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-muted/5 py-24 px-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-none" />
      
      <main className="max-w-4xl mx-auto space-y-12 relative">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="bg-indigo-500/5 text-indigo-400 border-indigo-500/20 px-4 py-1">
            <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse" />
            AI-Powered Extraction Active
          </Badge>
          <h1 className="text-5xl font-black tracking-tighter text-foreground">
            Complete Your <span className="text-primary italic">Proof</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your professional resume. Our Gemini AI will instantly extract your verified skills and update your discovery portfolio.
          </p>
        </div>

        <section className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card className="p-10 bg-card/20 backdrop-blur-xl border-primary/10 shadow-2xl">
                    <FileUploader 
                        category="resume" 
                        maxSize={10} 
                        onUploadComplete={(url) => console.log('Resume synced to profile:', url)}
                    />
                    
                    <div className="mt-12 space-y-6">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">What happens next?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <FileCheck className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Secure Storage</p>
                                    <p className="text-[11px] text-muted-foreground">Encrypted in Supabase private buckets with RLS protection.</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                    <ShieldAlert className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Privacy Control</p>
                                    <p className="text-[11px] text-muted-foreground">Only authorized recruiters can view your private resume files.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="p-6 bg-indigo-600/5 border-indigo-500/20 backdrop-blur-sm">
                    <h4 className="font-bold mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        AI Extraction Tips
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-2.5">
                        <li className="flex gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            Use clear section headers (Experience, Skills).
                        </li>
                        <li className="flex gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            Include project URLs for deep verification.
                        </li>
                        <li className="flex gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            PDF is the preferred format for AI parsing.
                        </li>
                    </ul>
                </Card>
                
                <div className="p-6 rounded-2xl border border-dashed border-primary/20 bg-primary/5">
                    <p className="text-xs text-center text-muted-foreground italic">
                        "Your resume data is used solely for skill discovery and will never be shared without your explicit application."
                    </p>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
