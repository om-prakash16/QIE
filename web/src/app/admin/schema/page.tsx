"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
    Plus, 
    Trash2, 
    GripVertical, 
    Settings2, 
    Type, 
    Hash, 
    ListFilter, 
    Calendar, 
    Link as LinkIcon, 
    FileUp,
    ChevronUp,
    ChevronDown,
    Save,
    Sparkles,
    Layout
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const FIELD_TYPES = [
    { value: "text", label: "Text Input", icon: Type },
    { value: "textarea", label: "Long Text", icon: Layout },
    { value: "number", label: "Number", icon: Hash },
    { value: "select", label: "Dropdown", icon: ListFilter },
    { value: "multiselect", label: "Multi-Select", icon: Plus },
    { value: "date", label: "Date Picker", icon: Calendar },
    { value: "file", label: "File Upload", icon: FileUp },
    { value: "url", label: "URL/Link", icon: LinkIcon },
]

export default function SchemaBuilderPage() {
    const queryClient = useQueryClient()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newField, setNewField] = useState({
        label: "",
        key: "",
        type: "text",
        required: false,
        placeholder: "",
        section_name: "Professional Info"
    })

    const { data: fields, isLoading } = useQuery({
        queryKey: ["profileSchema"],
        queryFn: async () => {
            const res = await fetch("/api/v1/schema/profile")
            if (!res.ok) throw new Error("Failed to load matrix schema")
            return res.json()
        }
    })

    const createMutation = useMutation({
        mutationFn: async (field: any) => {
            const res = await fetch("/api/v1/schema/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(field)
            })
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profileSchema"] })
            toast.success("Protocol field integrated into mesh")
            setIsAddModalOpen(false)
            setNewField({ label: "", key: "", type: "text", required: false, placeholder: "", section_name: "Professional Info" })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/v1/schema/profile/${id}`, { method: "DELETE" })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profileSchema"] })
            toast.success("Identity protocol purged")
        }
    })

    const reorderMutation = useMutation({
        mutationFn: async (orders: any[]) => {
            await fetch("/api/v1/schema/profile/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orders)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profileSchema"] })
            toast.success("Mesh order recalibrated")
        }
    })

    const moveField = (id: string, direction: 'up' | 'down') => {
        if (!fields) return
        const currentIndex = fields.findIndex((f: any) => f.id === id)
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
        
        if (newIndex < 0 || newIndex >= fields.length) return

        const newFields = [...fields]
        const [movedField] = newFields.splice(currentIndex, 1)
        newFields.splice(newIndex, 0, movedField)

        const orders = newFields.map((f, i) => ({ id: f.id, display_order: i }))
        reorderMutation.mutate(orders)
    }

    return (
        <div className="space-y-12 pb-24 max-w-[1200px] mx-auto relative">
             {/* Background Accent Glow */}
             <div className="absolute -top-40 -left-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 mb-1">Architecture Node</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-foreground">
                                Profile Schema
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-10 h-14 shadow-2xl border-t border-white/20 font-black tracking-tight text-lg group overflow-hidden relative">
                            <Plus className="w-5 h-5 mr-3" />
                            <span className="relative z-10">Inject Field</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background/80 backdrop-blur-3xl border-white/5 rounded-[2.5rem] max-w-xl shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black font-heading">New Protocol Field</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Label Name</Label>
                                    <Input 
                                        placeholder="e.g., LeetCode Rank" 
                                        className="bg-white/5 border-white/5 rounded-2xl h-12 font-bold"
                                        value={newField.label}
                                        onChange={(e) => setNewField({ ...newField, label: e.target.value, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Matrix Key (Auto)</Label>
                                    <Input 
                                        className="bg-white/5 border-white/5 rounded-2xl h-12 font-mono text-xs opacity-60"
                                        value={newField.key}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Data Type</Label>
                                    <Select 
                                        value={newField.type} 
                                        onValueChange={(val) => setNewField({ ...newField, type: val })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/5 rounded-2xl h-12 font-bold focus:ring-primary/20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 rounded-2xl">
                                            {FIELD_TYPES.map(t => (
                                                <SelectItem key={t.value} value={t.value} className="font-bold">
                                                    <div className="flex items-center gap-2">
                                                        <t.icon className="w-4 h-4 text-primary/60" />
                                                        {t.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Section</Label>
                                    <Input 
                                        className="bg-white/5 border-white/5 rounded-2xl h-12 font-bold"
                                        value={newField.section_name}
                                        onChange={(e) => setNewField({ ...newField, section_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="space-y-0.5">
                                    <Label className="font-black">Mandatory Protocol</Label>
                                    <p className="text-xs text-muted-foreground">Require this data for profile verification.</p>
                                </div>
                                <Switch 
                                    checked={newField.required} 
                                    onCheckedChange={(val) => setNewField({ ...newField, required: val })}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                onClick={() => createMutation.mutate(newField)}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-14 font-black uppercase tracking-widest text-xs"
                            >
                                Confirm Injection
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="bg-background/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative z-20">
                <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <GripVertical className="text-muted-foreground/30" />
                        <h2 className="text-xl font-black font-heading">Protocol Hierarchy</h2>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary font-black px-4">{fields?.length || 0} Total Fields</Badge>
                </div>

                <div className="divide-y divide-white/5">
                    {fields?.map((field: any, idx: number) => {
                        const Icon = FIELD_TYPES.find(t => t.value === field.type)?.icon || Type
                        return (
                            <motion.div 
                                key={field.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group/row flex items-center gap-8 px-10 py-6 hover:bg-white/[0.02] transition-all"
                            >
                                <div className="flex flex-col gap-2">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 rounded-md hover:bg-primary/20 text-muted-foreground/40 hover:text-primary transition-colors"
                                        onClick={() => moveField(field.id, 'up')}
                                        disabled={idx === 0}
                                    >
                                        <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 rounded-md hover:bg-primary/20 text-muted-foreground/40 hover:text-primary transition-colors"
                                        onClick={() => moveField(field.id, 'down')}
                                        disabled={idx === fields.length - 1}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover/row:border-primary/20 transition-colors">
                                    <Icon className="w-5 h-5 text-muted-foreground/60 group-hover/row:text-primary transition-colors" />
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-lg tracking-tight">{field.label}</span>
                                        {field.required && <Badge variant="destructive" className="text-[8px] uppercase tracking-tighter h-4 px-1.5">Required</Badge>}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/40">
                                        <code className="bg-white/5 px-2 py-0.5 rounded border border-white/5 font-mono text-primary/60">{field.key}</code>
                                        <span>/</span>
                                        <span className="uppercase tracking-[0.2em]">{field.section_name}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="rounded-xl hover:bg-white/10 group/btn"
                                    >
                                        <Settings2 className="w-4 h-4 text-muted-foreground/40 group-hover/btn:text-foreground" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="rounded-xl hover:bg-rose-500/10 group/del"
                                        onClick={() => {
                                            if (confirm("Purge this protocol field from the matrix? This cannot be undone.")) {
                                                deleteMutation.mutate(field.id)
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 text-muted-foreground/40 group-hover/del:text-rose-400" />
                                    </Button>
                                </div>
                            </motion.div>
                        )
                    })}

                    {fields?.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <div className="inline-flex p-6 bg-white/5 rounded-full border border-white/10 opacity-20">
                                <Layout className="w-12 h-12" />
                            </div>
                            <p className="font-black text-muted-foreground/40 uppercase tracking-widest text-sm">No protocols initialized in current mesh</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
