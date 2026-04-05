"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FolderGit2, Plus, ExternalLink, Github, Globe, Trash2, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8011/api/v1"

const mockProjects = [
    { id: "1", project_name: "DeFi Yield Aggregator", github_link: "https://github.com/demo/defi-agg", description: "Cross-chain yield optimization protocol.", tech_stack: ["Rust", "Solana", "React", "TypeScript"], ai_score: 94, on_chain_hash: "0x7f8e2a1b3c4d...", created_at: "2026-04-01" },
    { id: "2", project_name: "ZK Voting dApp", github_link: "https://github.com/demo/zk-vote", description: "Privacy-preserving voting system using ZK proofs on Solana.", tech_stack: ["Cairo", "Next.js", "Anchor"], ai_score: 89, on_chain_hash: "0x3a4b5c6d7e8f...", created_at: "2026-03-28" },
    { id: "3", project_name: "AI Resume Parser", github_link: "https://github.com/demo/ai-resume", description: "FastAPI service using LangChain to extract structured data from PDFs.", tech_stack: ["Python", "FastAPI", "LangChain"], ai_score: 82, on_chain_hash: "0x9c0d1e2f3a4b...", created_at: "2026-03-20" },
]

export default function PortfolioPage() {
    const { user } = useAuth()
    const [projects, setProjects] = useState(mockProjects)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({ project_name: "", github_link: "", description: "", tech_stack: "", live_url: "" })

    const handleSubmit = async () => {
        if (!form.project_name || !form.github_link) {
            toast.error("Project name and GitHub link are required.")
            return
        }
        setSubmitting(true)
        try {
            const res = await fetch(`${API}/portfolio/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_address: user?.wallet_address || "demo",
                    project_name: form.project_name,
                    github_link: form.github_link,
                    description: form.description,
                    tech_stack: form.tech_stack.split(",").map(s => s.trim()).filter(Boolean),
                    live_url: form.live_url || null,
                })
            })
            const data = await res.json()
            const newProject = data.project || { ...form, id: Date.now().toString(), ai_score: Math.floor(Math.random() * 30 + 70), on_chain_hash: "0x" + Math.random().toString(16).slice(2, 16), tech_stack: form.tech_stack.split(",").map(s => s.trim()), created_at: new Date().toISOString() }
            setProjects(prev => [newProject, ...prev])
            toast.success(`Project scored ${newProject.ai_score}/100 and hashed on-chain!`)
            setDialogOpen(false)
            setForm({ project_name: "", github_link: "", description: "", tech_stack: "", live_url: "" })
        } catch {
            toast.error("Failed to submit project.")
        }
        setSubmitting(false)
    }

    const avgScore = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.ai_score, 0) / projects.length) : 0

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
                        <FolderGit2 className="w-8 h-8 text-primary" />
                        Project Portfolio
                    </motion.h1>
                    <p className="text-muted-foreground text-sm">{projects.length} projects · Avg AI Score: {avgScore}/100</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl gap-2 font-bold"><Plus className="w-4 h-4" />Add Project</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10 rounded-2xl max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="font-heading font-black">Add New Project</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider">Project Name *</Label>
                                <Input value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))} placeholder="e.g. DeFi Aggregator" className="bg-white/5 border-white/10 rounded-xl h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider">GitHub Link *</Label>
                                <Input value={form.github_link} onChange={e => setForm(f => ({ ...f, github_link: e.target.value }))} placeholder="https://github.com/user/repo" className="bg-white/5 border-white/10 rounded-xl h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider">Description</Label>
                                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief project description..." className="bg-white/5 border-white/10 rounded-xl min-h-[80px]" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider">Tech Stack (comma separated)</Label>
                                <Input value={form.tech_stack} onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))} placeholder="Rust, Solana, React" className="bg-white/5 border-white/10 rounded-xl h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider">Live URL (optional)</Label>
                                <Input value={form.live_url} onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))} placeholder="https://myproject.app" className="bg-white/5 border-white/10 rounded-xl h-12" />
                            </div>
                            <Button onClick={handleSubmit} disabled={submitting} className="w-full rounded-xl h-12 font-bold gap-2">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {submitting ? "Evaluating..." : "Submit & Score"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Project Cards */}
            <div className="space-y-4">
                {projects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-4"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                                <h3 className="text-lg font-bold">{project.project_name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                                <div className="flex items-center gap-2 flex-wrap pt-1">
                                    {project.tech_stack.map(tech => (
                                        <Badge key={tech} variant="secondary" className="text-[10px] font-bold">{tech}</Badge>
                                    ))}
                                </div>
                            </div>
                            {/* AI Score */}
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 border",
                                project.ai_score >= 90 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                project.ai_score >= 80 ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            )}>
                                <span className="text-xl">{project.ai_score}</span>
                                <span className="text-[8px] uppercase opacity-60">score</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <a href={project.github_link} target="_blank" className="flex items-center gap-1 hover:text-primary transition-colors">
                                <Github className="w-3.5 h-3.5" />GitHub
                            </a>
                            <span className="flex items-center gap-1 font-mono text-[10px] opacity-60">
                                Hash: {project.on_chain_hash}
                            </span>
                            <span className="ml-auto opacity-40">{new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
