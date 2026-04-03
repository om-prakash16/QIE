"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { 
    Save, 
    Loader2, 
    AlertCircle, 
    CheckCircle2, 
    Sparkles,
    ShieldCheck,
    Globe,
    Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

export function DynamicProfileForm() {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    
    // 1. Fetch Dynamic Schema
    const { data: schema, isLoading: isSchemaLoading } = useQuery({
        queryKey: ["profileSchema"],
        queryFn: async () => {
            const res = await fetch("/api/v1/schema/profile")
            if (!res.ok) throw new Error("Failed to load identity schema")
            return res.json()
        }
    })

    // 2. Fetch/Initialize Form State
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: user?.profile_data || {}
    })

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`/api/v1/db/users/${user?.wallet_address}/profile`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] })
            toast.success("Identity profile synchronized with the mesh")
        }
    })

    if (isSchemaLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 opacity-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest">Hydrating dynamic protocols...</p>
            </div>
        )
    }

    if (!schema || schema.length === 0) {
        return (
            <div className="p-8 bg-white/5 border border-white/5 rounded-3xl text-center space-y-4 opacity-60">
                <Globe className="w-8 h-8 mx-auto text-primary" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No dynamic protocols assigned by network admin</p>
            </div>
        )
    }

    // Group fields by section
    const sections = schema.reduce((acc: any, field: any) => {
        const section = field.section_name || "Professional Info"
        if (!acc[section]) acc[section] = []
        acc[section].push(field)
        return acc
    }, {})

    return (
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-12 transition-all duration-700">
            {Object.entries(sections).map(([sectionName, fields]: [string, any], sectionIdx: number) => (
                <motion.div 
                    key={sectionName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIdx * 0.1 }}
                    className="space-y-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 whitespace-nowrap">{sectionName}</h3>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {fields.map((field: any) => (
                            <div key={field.id} className="space-y-3 group/field">
                                <div className="flex justify-between items-center ml-1">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 group-focus-within/field:text-primary transition-colors">
                                        {field.label}
                                        {field.required && <span className="text-rose-500 ml-1">*</span>}
                                    </Label>
                                    {field.type === 'file' && <ShieldCheck className="w-3 h-3 text-emerald-400 opacity-40" />}
                                </div>

                                {field.type === 'select' ? (
                                    <Select 
                                        defaultValue={user?.profile_data?.[field.key]} 
                                        onValueChange={(val) => setValue(field.key, val)}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/5 rounded-2xl h-14 font-bold focus:ring-primary/20 backdrop-blur-md">
                                            <SelectValue placeholder={field.placeholder || "Select option"} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 rounded-2xl">
                                            {field.validation_rules?.options?.map((opt: any) => (
                                                <SelectItem key={opt} value={opt} className="font-bold">{opt}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : field.type === 'textarea' ? (
                                    <Textarea 
                                        placeholder={field.placeholder}
                                        className="bg-white/5 border-white/5 rounded-2xl min-h-[120px] font-bold focus:ring-primary/20 backdrop-blur-md"
                                        {...register(field.key, { required: field.required })}
                                    />
                                ) : (
                                    <Input 
                                        type={field.type === 'number' ? 'number' : 'text'}
                                        placeholder={field.placeholder}
                                        className="bg-white/5 border-white/5 rounded-2xl h-14 font-bold focus:ring-primary/20 backdrop-blur-md transition-all group-hover/field:border-white/10"
                                        {...register(field.key, { required: field.required })}
                                    />
                                )}
                                
                                {errors[field.key] && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1 mt-1 ml-2">
                                        <AlertCircle className="w-3 h-3" />
                                        Protocol Violation: {field.label} is mandatory
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}

            <div className="pt-8 border-t border-white/5">
                <Button 
                    type="submit" 
                    disabled={mutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-16 shadow-2xl border-t border-white/20 font-black tracking-tighter text-xl group overflow-hidden relative"
                >
                    {mutation.isPending ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Save className="w-6 h-6 mr-3" />}
                    <span className="relative z-10">{mutation.isPending ? "Synchronizing Mesh..." : "Update Identity Node"}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>
                
                <div className="flex items-center justify-center gap-2 mt-6 text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
                    <Sparkles className="w-3 h-3" />
                    <span>Profile structure managed dynamically by Super Admin</span>
                    <Sparkles className="w-3 h-3" />
                </div>
            </div>
        </form>
    )
}
