"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
    Save, 
    Loader2, 
    AlertCircle, 
    CheckCircle2, 
    Sparkles,
    ShieldCheck,
    Globe,
    Briefcase,
    Eye,
    EyeOff
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
import { useEffect, useMemo } from "react"

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

    // 2. Dynamic Zod Schema Generation
    const dynamicZodSchema = useMemo(() => {
        if (!schema) return z.any()
        const shape: any = {}
        schema.forEach((field: any) => {
            let fieldSchema: any = z.string()
            
            if (field.field_type === 'number') fieldSchema = z.coerce.number()
            if (field.field_type === 'url') fieldSchema = z.string().url("Must be a valid protocol URL")
            if (field.field_type === 'multi-select') fieldSchema = z.array(z.string())
            
            if (!field.required) {
                fieldSchema = fieldSchema.optional().nullable()
            } else {
                fieldSchema = fieldSchema.min(1, `${field.field_label} is mandatory`)
            }
            
            shape[field.field_name] = fieldSchema
        })
        return z.object(shape)
    }, [schema])

    // 3. Initialize Form
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(dynamicZodSchema),
        defaultValues: user?.dynamic_profile_data || {}
    })

    const watchedValues = watch()

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/v1/user/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_address: user?.wallet_address,
                    profile_data: data
                })
            })
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] })
            toast.success("Identity profile synchronized with the mesh")
        },
        onError: (error: any) => {
            toast.error(`Sync failure: ${error.message}`)
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
        const section = field.section || "professional info"
        if (!acc[section]) acc[section] = []
        
        // Conditional Visibility Logic
        let isVisible = true
        if (field.visible_if) {
            const { field: targetField, equals, one_of } = field.visible_if
            const targetValue = watchedValues[targetField]
            if (equals !== undefined) isVisible = targetValue === equals
            if (one_of !== undefined) isVisible = one_of.includes(targetValue)
        }

        if (isVisible) acc[section].push(field)
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
                                        {field.field_label}
                                        {field.required && <span className="text-rose-500 ml-1">*</span>}
                                    </Label>
                                    {field.field_type === 'file' && <ShieldCheck className="w-3 h-3 text-emerald-400 opacity-40" />}
                                </div>

                                {field.field_type === 'select' ? (
                                    <Select 
                                        defaultValue={user?.dynamic_profile_data?.[field.field_name]} 
                                        onValueChange={(val) => setValue(field.field_name, val, { shouldValidate: true })}
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
                                ) : field.field_type === 'textarea' ? (
                                    <Textarea 
                                        placeholder={field.placeholder}
                                        className="bg-white/5 border-white/5 rounded-2xl min-h-[120px] font-bold focus:ring-primary/20 backdrop-blur-md"
                                        {...register(field.field_name)}
                                    />
                                ) : (
                                    <Input 
                                        type={field.field_type === 'number' ? 'number' : 'text'}
                                        placeholder={field.placeholder}
                                        className="bg-white/5 border-white/5 rounded-2xl h-14 font-bold focus:ring-primary/20 backdrop-blur-md transition-all group-hover/field:border-white/10"
                                        {...register(field.field_name)}
                                    />
                                )}
                                
                                {errors[field.field_name] && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1 mt-1 ml-2">
                                        <AlertCircle className="w-3 h-3" />
                                        Protocol Violation: {errors[field.field_name]?.message as string}
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
