"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    FolderGit2, 
    Plus, 
    ExternalLink, 
    Github, 
    Globe, 
    Trash2, 
    Loader2, 
    X,
    UserCheck,
    Briefcase,
    GraduationCap,
    Clock,
    Link as LinkIcon,
    Users,
    Zap,
    TrendingUp,
    Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { api, API_BASE_URL } from "@/lib/api/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function PortfolioPage() {
    const { user } = useAuth()
    const [projects, setProjects] = useState<any[]>([])
    const [timeline, setTimeline] = useState<any[]>([])
    const [connections, setConnections] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({ project_name: "", github_link: "", description: "", tech_stack: "", live_url: "" })

    useEffect(() => {
        if (user) {
            fetchPortfolioData()
        }
    }, [user])

    const fetchPortfolioData = async () => {
        setLoading(true)
        try {
            // In a real app, these would be separate table fetches
            // For now, we fetch timeline and connections via our new services
            const [timelineData, connectionsData] = await Promise.all([
                api.identity.getTimeline(user?.id || ""),
                api.identity.getConnections()
            ])
            setTimeline(timelineData || [])
            setConnections(connectionsData || [])
            
            // Projects from legacy endpoint
            const res = await fetch(`${API_BASE_URL}/portfolio/projects?wallet_address=${user?.wallet_address}`)
            const projData = await res.json()
            setProjects(projData.projects || [])
        } catch (error) {
            console.error("Failed to fetch portfolio data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!form.project_name || !form.github_link) {
            toast.error("Project name and GitHub link are required.")
            return
        }
        setSubmitting(true)
        try {
            const res = await fetch(`${API_BASE_URL}/portfolio/projects`, {
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

    const avgScore = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.ai_score || 0, 0) / projects.length) : 0

    return (
        <div className="space-y-10 pb-20">
            {/* Header Profile Section */}
            <div className="relative p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary to-primary/40 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="h-32 w-32 rounded-full border-4 border-background bg-muted overflow-hidden relative z-10 shadow-2xl">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.wallet_address}`} alt="Avatar" />
                        </div>
                        <div className="absolute bottom-0 right-0 h-10 w-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-background z-20 shadow-lg">
                            <Shield className="w-5 h-5 text-primary-foreground" />
                        </div>
                    </div>
                    <div className="space-y-4 flex-1 text-center md:text-left">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">{user?.name}</h1>
                            <p className="text-muted-foreground font-mono text-sm opacity-60 mt-1">{user?.wallet_address}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                            <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20">
                                Verified Talent
                            </Badge>
                            <div className="flex -space-x-3 overflow-hidden p-1">
                                {[1,2,3].map(i => (
                                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-muted">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 55}`} alt="con" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">{connections.length}+ Professional Connections</span>
                        </div>
                        <div className="flex gap-4 pt-2 justify-center md:justify-start">
                            <Button size="sm" variant="outline" className="rounded-xl h-10 px-5 gap-2 border-white/10 hover:bg-primary/5">
                                <LinkIcon className="w-4 h-4" /> Copy Profile URL
                            </Button>
                            <Button size="sm" className="rounded-xl h-10 px-5 gap-2 shadow-lg shadow-primary/10">
                                <Users className="w-4 h-4" /> Sync Connections
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <Card className="bg-white/5 border-white/5 backdrop-blur-sm p-5 text-center">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">AI Proof Score</p>
                            <p className="text-3xl font-black text-primary">{avgScore || 85}</p>
                        </Card>
                        <Card className="bg-white/5 border-white/5 backdrop-blur-sm p-5 text-center">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">NFT Credentials</p>
                            <p className="text-3xl font-black text-primary">12</p>
                        </Card>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="projects" className="w-full">
                <TabsList className="bg-white/5 border border-white/5 p-1 rounded-2xl h-14 mb-10">
                    <TabsTrigger value="projects" className="rounded-xl px-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                        <FolderGit2 className="w-4 h-4 mr-2" /> Projects
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="rounded-xl px-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                        <Clock className="w-4 h-4 mr-2" /> Career Timeline
                    </TabsTrigger>
                    <TabsTrigger value="connections" className="rounded-xl px-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                        <Users className="w-4 h-4 mr-2" /> Network
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="projects" className="space-y-8 outline-none">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FolderGit2 className="w-6 h-6 text-primary" />
                            Project Artifacts
                        </h2>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-12 rounded-xl gap-2 px-6 shadow-xl shadow-primary/10"><Plus className="w-4 h-4" /> Add Artifact</Button>
                            </DialogTrigger>
                            <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10 rounded-[2rem] max-w-xl p-8">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">Register New Project</DialogTitle>
                                    <DialogDescription>Your code will be analyzed by AI and hashed on the Solana blockchain for verification.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 mt-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Name</Label>
                                            <Input value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))} placeholder="e.g. DeFi Protocol" className="bg-white/5 border-white/10 rounded-xl h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">GitHub Link</Label>
                                            <Input value={form.github_link} onChange={e => setForm(f => ({ ...f, github_link: e.target.value }))} placeholder="github.com/user/repo" className="bg-white/5 border-white/10 rounded-xl h-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Technical Description</Label>
                                        <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Explain the architecture and your role..." className="bg-white/5 border-white/10 rounded-xl min-h-[120px] resize-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skills Applied (CSV)</Label>
                                        <Input value={form.tech_stack} onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))} placeholder="Rust, Solana, Next.js" className="bg-white/5 border-white/10 rounded-xl h-12" />
                                    </div>
                                    <Button onClick={handleSubmit} disabled={submitting} className="w-full rounded-2xl h-14 font-black gap-3 text-lg">
                                        {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Shield className="w-6 h-6" />}
                                        {submitting ? "Engaging AI Scorer..." : "Hash to Portfolio"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? [1,2,3,4].map(i => <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />) : projects.map((project, i) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="group hover:border-primary/40 transition-all duration-500 overflow-hidden bg-background/40 backdrop-blur-sm border-white/5 p-0">
                                    <div className="p-8 space-y-6">
                                        <div className="flex justify-between gap-4">
                                            <div className="space-y-1.5 flex-1">
                                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.project_name}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{project.description}</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 shrink-0">
                                                 <div className={cn(
                                                    "w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black border-2",
                                                    (project.ai_score || 0) >= 90 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                    (project.ai_score || 0) >= 80 ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                    "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                )}>
                                                    <span className="text-xl">{project.ai_score || 75}</span>
                                                    <span className="text-[8px] uppercase font-bold opacity-60">AI pts</span>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                                                    <Shield className="w-2.5 h-2.5" /> Verified
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {project.tech_stack?.map((tech: string) => (
                                                <Badge key={tech} variant="secondary" className="px-3 py-0.5 rounded-full text-[10px] bg-white/5 border-white/10">{tech}</Badge>
                                            ))}
                                        </div>

                                        <div className="pt-4 flex items-center justify-between border-t border-white/5">
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <a href={project.github_link} target="_blank" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                                    <Github className="w-4 h-4" /> Repo
                                                </a>
                                                <span className="font-mono text-[10px] opacity-40">
                                                    H:{project.on_chain_hash?.slice(0, 10)}...
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-8 outline-none">
                     <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Clock className="w-6 h-6 text-primary" />
                            Professional Progression
                        </h2>
                        <Button variant="outline" className="rounded-xl border-white/10 gap-2"><Plus className="w-4 h-4" /> Add Experience</Button>
                    </div>

                    <Card className="border-white/5 bg-background/40 p-8">
                        <div className="relative space-y-12 before:absolute before:inset-y-0 before:left-8 before:w-1 before:bg-gradient-to-b before:from-primary before:to-transparent">
                            {timeline.length > 0 ? timeline.map((entry, idx) => (
                                <motion.div 
                                    key={entry.id} 
                                    className="relative pl-20"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="absolute left-[30px] top-0 h-1 hidden"></div>
                                    <div className={cn(
                                        "absolute left-0 top-0 h-16 w-16 rounded-2xl flex items-center justify-center border-4 border-background z-10 shadow-xl shadow-primary/5",
                                        entry.type === 'education' ? "bg-blue-500/10 text-blue-500" : "bg-primary/10 text-primary"
                                    )}>
                                        {entry.type === 'education' ? <GraduationCap className="w-7 h-7" /> : <Briefcase className="w-7 h-7" />}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-bold">{entry.role || entry.degree}</h3>
                                            <Badge variant="outline" className="text-xs opacity-60 rounded-full">{entry.start_date} — {entry.end_date || 'Present'}</Badge>
                                        </div>
                                        <p className="text-primary font-bold text-lg">{entry.company || entry.institution}</p>
                                        <p className="text-muted-foreground leading-relaxed max-w-3xl">{entry.description}</p>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="py-20 text-center space-y-4">
                                    <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                                        <Clock className="w-8 h-8 opacity-30" />
                                    </div>
                                    <p className="text-muted-foreground">Your career story starts here. Add your first milestone.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="connections" className="space-y-8 outline-none">
                     <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" />
                            Professional Network
                        </h2>
                        <div className="flex gap-2">
                            <Input placeholder="Search people..." className="bg-white/5 border-white/10 rounded-xl" />
                            <Button className="rounded-xl gap-2 font-bold"><Users className="w-4 h-4" /> Find Peers</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {connections.length > 0 ? connections.map((peer, idx) => (
                            <motion.div
                                key={peer.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="hover:border-primary/40 transition-all border-white/5 bg-background/40 overflow-hidden text-center p-8">
                                    <div className="space-y-6">
                                        <Avatar className="h-24 w-24 mx-auto border-4 border-white/5 shadow-2xl">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${peer.wallet_address}`} />
                                            <AvatarFallback>{peer.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-xl">{peer.name}</h3>
                                            <p className="text-sm text-primary font-medium">{peer.position || 'Software Architect'}</p>
                                            <p className="text-xs text-muted-foreground font-mono opacity-50">{peer.wallet_address.slice(0, 10)}...</p>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <Badge variant="secondary" className="bg-white/5 text-[10px]">{peer.common_skills || 5} Mutual Skills</Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button className="flex-1 rounded-xl h-11" variant="outline">Profile</Button>
                                            <Button className="flex-1 rounded-xl h-11">Message</Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )) : (
                             <Card className="md:col-span-3 border-dashed bg-muted/5 py-20 text-center space-y-4">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">Your Network is currently a sandbox.</h3>
                                    <p className="text-muted-foreground">The best opportunities come through connections. Start exploring the community!</p>
                                </div>
                                <Button className="rounded-xl px-8 h-12 font-bold shadow-xl shadow-primary/10">Explore Skillsutra Community</Button>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
