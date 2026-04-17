"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Key, 
    Plus, 
    Trash2, 
    Copy, 
    CheckCircle2, 
    Terminal, 
    ShieldCheck, 
    Code2,
    Eye,
    EyeOff,
    Info,
    ExternalLink
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { toast } from "sonner"

interface ApiKey {
    id: string
    label: string
    is_active: boolean
    last_used_at: string | null
    created_at: string
}

export function ApiDeveloperPortal() {
    const [keys, setKeys] = useState<ApiKey[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [newKeyLabel, setNewKeyLabel] = useState("")
    const [generatedKey, setGeneratedKey] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetchKeys()
    }, [])

    const fetchKeys = async () => {
        setIsLoading(true)
        try {
            // Placeholder: In a real app, this would be a real GET /api/v1/company/api-keys
            const mockKeys: ApiKey[] = [
                { id: "1", label: "Greenhouse Main Integration", is_active: true, last_used_at: "2024-04-16T10:00:00Z", created_at: "2024-03-01T08:00:00Z" },
                { id: "2", label: "Testing Key", is_active: false, last_used_at: null, created_at: "2024-04-10T15:00:00Z" }
            ]
            setKeys(mockKeys)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateKey = () => {
        // Mock generation
        const key = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
        setGeneratedKey(key)
        toast.success("API Key Generated Successfully")
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.info("Key copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="relative p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Terminal className="w-40 h-40 -rotate-12" />
                </div>
                
                <div className="relative z-10 space-y-4 max-w-2xl">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Enterprise API
                    </Badge>
                    <h1 className="text-5xl font-black font-heading tracking-tighter leading-none">
                        Connect Your <span className="text-primary italic">ATS</span>
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Integrate verified candidate Proof Scores and skill data directly into your existing hiring workflow with our secure REST API.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Key
                        </Button>
                        <Button variant="outline" className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest border-white/10 bg-white/5 backdrop-blur-md">
                            <Code2 className="w-5 h-5 mr-2" />
                            API Documentation
                        </Button>
                    </div>
                </div>
            </div>

            {/* Keys Table */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                        <Key className="w-6 h-6 text-primary" />
                        Active Integration Keys
                    </h2>
                </div>

                <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest px-8 h-14">Label</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Last Used</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Created At</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-14 text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {keys.map((key) => (
                                <TableRow key={key.id} className="border-white/5 hover:bg-white/[0.03] transition-all group">
                                    <TableCell className="px-8 font-bold text-sm h-16">{key.label}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-[10px] uppercase font-black",
                                            key.is_active ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                                        )}>
                                            {key.is_active ? "Active" : "Revoked"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground font-mono">
                                        {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(key.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/10">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-500/10 text-rose-500">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Quick Start Logic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 rounded-[2.5rem] border-white/10 bg-white/[0.02] space-y-6">
                    <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        API Security Best Practices
                    </h3>
                    <ul className="space-y-4">
                        {[
                            "Always use HTTPS for all API requests.",
                            "Rotate your keys every 90 days for better security.",
                            "Never expose live API keys in client-side code.",
                            "Restrict keys to specific IP addresses if possible."
                        ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card className="p-8 rounded-[2.5rem] border-white/10 bg-zinc-950 space-y-6 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                            <terminal className="w-6 h-6 text-primary" />
                            Example Implementation
                        </h3>
                        <Badge variant="outline" className="text-[9px] font-black uppercase text-zinc-500">cURL</Badge>
                    </div>
                    <div className="bg-black rounded-2xl p-6 font-mono text-xs leading-relaxed border border-white/5 text-zinc-400 group relative">
                        <pre className="whitespace-pre-wrap">
{`curl -X GET "https://api.skillsutra.io/v1/enterprise/candidates/user_wallet_address" \\
  -H "X-API-KEY: sk_live_your_secret_key" \\
  -H "Accept: application/json"`}
                        </pre>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                            onClick={() => copyToClipboard(`curl -X GET "https://api.skillsutra.io/v1/enterprise/candidates/user_wallet_address" -H "X-API-KEY: sk_live_your_secret_key" -H "Accept: application/json"`)}
                        >
                            <Copy className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 max-w-xl">
                    <DialogHeader className="space-y-4">
                        <DialogTitle className="text-3xl font-black italic tracking-tighter">
                            {generatedKey ? "Save Your Secret Key" : "New API Integration"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm">
                            {generatedKey 
                                ? "This key will only be shown once. If you lose it, you will need to generate a new one." 
                                : "Name this key to keep track of its usage (e.g. 'Greenhouse Production')."
                            }
                        </DialogDescription>
                    </DialogHeader>

                    {!generatedKey ? (
                        <div className="space-y-6 py-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Key Label</label>
                                <Input 
                                    placeholder="Enter integration name..." 
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold"
                                    value={newKeyLabel}
                                    onChange={(e) => setNewKeyLabel(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="py-6 space-y-4">
                            <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between group">
                                <code className="text-emerald-500 font-mono text-sm break-all pr-4">
                                    {generatedKey}
                                </code>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-10 w-10 shrink-0 text-emerald-500 hover:bg-emerald-500/10 rounded-xl"
                                    onClick={() => copyToClipboard(generatedKey)}
                                >
                                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </Button>
                            </div>
                            <div className="flex gap-2 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                                <Info className="w-5 h-5 text-orange-500 shrink-0" />
                                <p className="text-[10px] text-orange-500 font-bold leading-normal uppercase">
                                    Warning: Raw keys are NOT stored in our database. Store this securely in your environment variables.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-3 pt-4">
                        {!generatedKey ? (
                            <>
                                <Button variant="ghost" className="rounded-2xl h-12 px-8 font-black uppercase text-xs" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                                <Button className="rounded-2xl h-12 px-8 font-black uppercase text-xs bg-primary text-primary-foreground" onClick={handleCreateKey} disabled={!newKeyLabel}>Generate Key</Button>
                            </>
                        ) : (
                            <Button className="w-full rounded-2xl h-12 font-black uppercase text-xs" onClick={() => setIsCreateModalOpen(false)}>I have saved my key</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
