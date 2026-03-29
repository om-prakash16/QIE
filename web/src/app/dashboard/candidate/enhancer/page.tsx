"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, BotMessageSquare } from "lucide-react";

export default function ResumeEnhancer() {
    const [resume, setResume] = useState("I am a software engineer knowing React and a bit of Rust.");
    const [job, setJob] = useState("Senior Web3 Fullstack Developer (Next.js, Solana, Rust)");
    const [streamedText, setStreamedText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEnhance = async () => {
        setLoading(true);
        setStreamedText("");
        
        try {
            const res = await fetch("http://localhost:8000/api/v1/enhancer/optimize-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ current_resume: resume, target_job: job })
            });

            if (!res.body) throw new Error("No readable stream");
            
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            
            let done = false;
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunk = decoder.decode(value);
                setStreamedText(prev => prev + chunk);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 mt-16">
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold font-heading flex gap-3 items-center">
                        <BotMessageSquare className="w-8 h-8 text-primary"/> AI Resume Enhancer
                    </h1>
                    <p className="text-muted-foreground mt-2">Iteratively rewrite your profile using LangChain to guarantee a 100% Match Score.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Variables */}
                    <div className="space-y-4 shadow-sm border p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold">1. Input Context</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target Job Description</label>
                            <Textarea rows={3} value={job} onChange={e => setJob(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Current Resume Summary</label>
                            <Textarea rows={6} value={resume} onChange={e => setResume(e.target.value)} />
                        </div>
                        <Button disabled={loading} onClick={handleEnhance} className="w-full">
                            {loading ? "Streaming AI Analysis..." : "Optimize with AI"}
                        </Button>
                    </div>

                    {/* Generative Output stream */}
                    <div className="border rounded-2xl shadow-sm bg-muted/20 flex flex-col overflow-hidden relative">
                        <div className="bg-muted p-4 border-b flex justify-between items-center">
                            <span className="font-semibold text-sm">Dynamic Streaming Output</span>
                            <Copy className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" opacity={0.5}/>
                        </div>
                        <div className="p-6 overflow-y-auto h-full min-h-[300px] whitespace-pre-wrap font-mono text-sm leading-relaxed text-muted-foreground">
                            {streamedText || "Awaiting submission..."}
                            {loading && <span className="animate-pulse inline-block w-2 h-4 bg-primary ml-1"/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
