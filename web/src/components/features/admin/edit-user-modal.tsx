"use client"

import { useState, useEffect } from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { Loader2, ShieldCheck, User as UserIcon, Mail, ShieldAlert } from "lucide-react"

interface EditUserModalProps {
    user: any | null
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        role: "",
        status: ""
    })

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || "",
                email: user.email || "",
                role: user.role || "talent",
                status: user.status || "active"
            })
        }
    }, [user])

    const handleSave = async () => {
        if (!user) return
        setIsLoading(true)
        
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: formData.full_name,
                    role: formData.role,
                    status: formData.status
                })
                .eq('id', user.id)

            if (error) throw error
            
            toast.success("Identity profile updated successfully")
            onSuccess()
            onClose()
        } catch (err: any) {
            toast.error(`Protocol update failed: ${err.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-background/80 backdrop-blur-3xl border-white/10 rounded-[2.5rem] max-w-lg shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-50" />
                
                <DialogHeader className="pt-6 px-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black font-heading tracking-tight text-foreground">
                                Identity Override
                            </DialogTitle>
                            <DialogDescription className="text-xs font-black uppercase tracking-[0.2em] text-primary/50">
                                Manual Node Reconfiguration
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-8 py-8 px-8 border-y border-white/5 bg-white/[0.01]">
                    <div className="grid gap-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Protocol Name</Label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                <Input 
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="bg-background/40 border-white/5 rounded-2xl pl-12 h-14 font-bold focus:ring-primary/20 transition-all"
                                    placeholder="Enter entity name..."
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Access Point (Read-Only)</Label>
                            <div className="relative group opacity-60">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                <Input 
                                    value={formData.email}
                                    disabled
                                    className="bg-white/5 border-white/5 rounded-2xl pl-12 h-14 font-bold cursor-not-allowed italic"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Classification</Label>
                                <Select 
                                    value={formData.role} 
                                    onValueChange={(val) => setFormData({ ...formData, role: val })}
                                >
                                    <SelectTrigger className="bg-background/40 border-white/5 rounded-2xl h-14 font-bold focus:ring-primary/20">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 rounded-2xl">
                                        <SelectItem value="talent" className="font-bold">Talent</SelectItem>
                                        <SelectItem value="company" className="font-bold">Company</SelectItem>
                                        <SelectItem value="admin" className="font-bold">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Operational Status</Label>
                                <Select 
                                    value={formData.status} 
                                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger className="bg-background/40 border-white/5 rounded-2xl h-14 font-bold focus:ring-primary/20">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 rounded-2xl">
                                        <SelectItem value="active" className="font-bold text-emerald-400">Active</SelectItem>
                                        <SelectItem value="suspended" className="font-bold text-rose-400">Suspended</SelectItem>
                                        <SelectItem value="pending" className="font-bold text-amber-400">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-8 py-6 bg-[#0c0c0c]/50">
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] hover:bg-white/5"
                    >
                        Abort
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-14 px-10 border-t border-white/20 shadow-2xl font-black uppercase tracking-widest text-[10px] group overflow-hidden relative"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <ShieldAlert className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        )}
                        <span className="relative z-10">{isLoading ? "Applying..." : "Confirm Protocol"}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
