"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
    Code, 
    Plus, 
    Trash2, 
    Copy, 
    Check, 
    ShieldCheck, 
    ExternalLink, 
    Loader2, 
    Key, 
    Activity, 
    Lock,
    Globe,
    Zap,
    AlertCircle
} from "lucide-react"
import { companyApi } from "@/lib/api/company-api"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function EnterpriseApiPage() {
    const [keys, setKeys] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [company, setCompany] = useState<any>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [newKeyLabel, setNewKeyLabel] = useState("")
    const [generatedKey, setGeneratedKey] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const profile = await companyApi.profile.get()
            setCompany(profile.data || profile)
            
            const companyId = profile.data?.id || profile.id
            if (companyId) {
                const keysData = await companyApi.enterprise.listKeys(companyId)
                setKeys(keysData)
            }
        } catch (err) {
            console.error("Failed to load API keys", err)
            toast.error("Failed to load enterprise data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateKey = async () => {
        if (!newKeyLabel.trim()) return
        setIsCreating(true)
        try {
            const companyId = company?.id
            const res = await companyApi.enterprise.createKey(companyId, newKeyLabel)
            setGeneratedKey(res.api_key)
            toast.success("API Key generated successfully")
            fetchData()
            setNewKeyLabel("")
        } catch (err) {
            toast.error("Failed to generate API key")
        } finally {
            setIsCreating(false)
        }
    }

    const handleRevokeKey = async (keyId: string) => {
        if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) return
        try {
            const companyId = company?.id
            await companyApi.enterprise.revokeKey(companyId, keyId)
            toast.success("API Key revoked")
            fetchData()
        } catch (err) {
            toast.error("Failed to revoke API key")
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success("Copied to clipboard")
        setTimeout(() => setCopied(false), 2000)
    }

    if (isLoading && !company) {
        return (
            <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20">Syncing Protocol Keys...</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <Code className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                            Enterprise Protocol
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase italic">Developer <span className="text-primary">Interface</span></h1>
                    <p className="text-muted-foreground text-sm max-w-xl italic">Securely integrate Best Hiring Tool's verification engine into your own ATS or custom talent pipelines.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-[10px] h-12 px-6">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Documentation
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Management */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Keys List */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-black uppercase italic tracking-tight">Active Access Nodes</CardTitle>
                                <Lock className="w-4 h-4 text-primary/40" />
                            </div>
                            <CardDescription className="text-xs">Authorized API keys currently granting access to your company's talent metrics.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {keys.length === 0 ? (
                                    <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-3xl">
                                        <div className="bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Key className="w-6 h-6 text-white/10" />
                                        </div>
                                        <p className="text-white/20 text-xs italic font-bold">No active API keys found.</p>
                                        <p className="text-[10px] text-white/10 mt-1 uppercase tracking-widest">Generate a key to begin integration.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {keys.map((key) => (
                                            <div key={key.id} className={cn(
                                                "group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                                                key.is_active ? "bg-white/5 border-white/10 hover:border-primary/30" : "bg-red-500/5 border-red-500/10 opacity-50"
                                            )}>
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "p-3 rounded-xl border",
                                                        key.is_active ? "bg-primary/10 border-primary/20" : "bg-red-500/10 border-red-500/20"
                                                    )}>
                                                        <Zap className={cn("w-4 h-4", key.is_active ? "text-primary" : "text-red-400")} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-black text-white/90">{key.label}</h4>
                                                            {!key.is_active && <Badge variant="destructive" className="text-[8px] h-4 uppercase font-black">Revoked</Badge>}
                                                        </div>
                                                        <p className="text-[10px] text-white/30 font-bold mt-0.5 flex items-center gap-2">
                                                            ID: {key.id.split("-")[0]}... • Created {new Date(key.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="hidden md:block text-right">
                                                        <p className="text-[9px] uppercase tracking-widest font-black text-white/20 mb-0.5">Last Signal</p>
                                                        <p className="text-[10px] font-bold text-white/60">
                                                            {key.last_used_at ? new Date(key.last_used_at).toLocaleTimeString() : "Never Used"}
                                                        </p>
                                                    </div>
                                                    {key.is_active && (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon"
                                                            className="text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                                                            onClick={() => handleRevokeKey(key.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* New Key Generation Overlay/Modal */}
                    <AnimatePresence>
                        {generatedKey && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60"
                            >
                                <Card className="w-full max-w-lg bg-[#0a0a0a] border-primary/30 shadow-[0_0_50px_rgba(var(--primary),0.2)] overflow-hidden">
                                    <div className="h-1 bg-gradient-to-r from-primary to-blue-500" />
                                    <CardHeader className="text-center pt-8">
                                        <div className="bg-primary/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                                            <ShieldCheck className="w-8 h-8 text-primary" />
                                        </div>
                                        <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Security Credentials Generated</CardTitle>
                                        <CardDescription className="text-red-400 font-bold uppercase text-[10px] tracking-widest mt-2 flex items-center justify-center gap-2">
                                            <AlertCircle className="w-3 h-3" /> Important: Copy this key now. It will not be shown again.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-4">
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                                            <div className="relative bg-black rounded-xl p-6 font-mono text-sm break-all border border-white/10 text-primary-foreground/90 selection:bg-primary/30">
                                                {generatedKey}
                                            </div>
                                            <Button 
                                                className="absolute right-3 bottom-3 h-10 px-4 rounded-lg bg-primary hover:bg-primary/80"
                                                onClick={() => copyToClipboard(generatedKey)}
                                            >
                                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                                {copied ? "Copied" : "Copy Key"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-white/5 border-t border-white/10 flex justify-center py-6">
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] border-white/10 hover:bg-white/10"
                                            onClick={() => setGeneratedKey(null)}
                                        >
                                            I've safely stored this key
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column: Actions & Docs */}
                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20 backdrop-blur-xl rounded-[2rem] overflow-hidden group">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary italic">Initiate Access Node</CardTitle>
                            <CardDescription className="text-[10px] uppercase font-black text-primary/40">New Credentials Generation</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-1">Identity Label</label>
                                <Input 
                                    placeholder="e.g. Greenhouse Integration" 
                                    className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary/50 text-xs font-bold"
                                    value={newKeyLabel}
                                    onChange={(e) => setNewKeyLabel(e.target.value)}
                                />
                            </div>
                            <Button 
                                className="w-full h-14 rounded-xl gap-3 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                onClick={handleCreateKey}
                                disabled={isCreating || !newKeyLabel.trim()}
                            >
                                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Generate API Key
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Specs */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] px-2 text-white/20 italic">Protocol Specs</h3>
                        <div className="grid gap-3">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <Globe className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Endpoint</span>
                                </div>
                                <code className="text-[10px] font-mono text-blue-300/60 block bg-black/40 p-2 rounded-lg truncate group-hover:text-blue-300 transition-colors">
                                    https://api.besthiringtool.com/v1/enterprise
                                </code>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <Activity className="w-3 h-3 text-amber-400" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Rate Limits</span>
                                </div>
                                <p className="text-[10px] font-bold text-white/40 leading-relaxed italic">
                                    1,000 requests / minute per access node. Synchronous burst allowed up to 100 req.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Security Alert */}
                    <Card className="p-6 bg-red-500/5 border-red-500/20 rounded-3xl">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" /> Security Protocol
                        </h4>
                        <p className="text-[10px] text-white/50 leading-relaxed italic">
                            All API requests must be signed with the <code className="text-red-400 font-mono">X-API-KEY</code> header. Never share your secret keys or commit them to public repositories.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}
