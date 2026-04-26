import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UserProfile } from "@/types/profile"
import { Edit2, Save, X } from "lucide-react"

interface BasicInfoTabProps {
    data: UserProfile
    isEditing?: boolean
    onUpdate?: (field: string, value: string) => void
}

export function BasicInfoTab({ data, isEditing = false, onUpdate }: BasicInfoTabProps) {
    return (
        <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-10 pt-10 px-10">
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight">Identity Matrix</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                        Synchronize your core professional credentials with the network.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-10 px-10 pb-12">
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Legal First Name</Label>
                        <Input 
                            id="firstName" 
                            defaultValue={data.basic.firstName} 
                            onChange={(e) => onUpdate?.('firstName', e.target.value)} 
                            disabled={!isEditing} 
                            className="h-14 glass border-white/10 rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Legal Last Name</Label>
                        <Input 
                            id="lastName" 
                            defaultValue={data.basic.lastName} 
                            onChange={(e) => onUpdate?.('lastName', e.target.value)} 
                            disabled={!isEditing} 
                            className="h-14 glass border-white/10 rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Primary Email Node</Label>
                        <Input 
                            id="email" 
                            defaultValue={data.basic.email} 
                            disabled 
                            className="h-14 bg-white/5 border-white/5 rounded-2xl text-white/40 font-bold text-sm px-6 cursor-not-allowed" 
                        />
                        <p className="text-[9px] text-white/20 italic font-black uppercase tracking-[0.1em] ml-1">Locked for security. Contact protocol admin to update.</p>
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Communications Link</Label>
                        <Input 
                            id="phone" 
                            defaultValue={data.basic.phone} 
                            onChange={(e) => onUpdate?.('phone', e.target.value)} 
                            disabled={!isEditing} 
                            className="h-14 glass border-white/10 rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Neural Bio-Signature</Label>
                    <Textarea
                        id="bio"
                        defaultValue={data.basic.bio}
                        onChange={(e) => onUpdate?.('bio', e.target.value)}
                        className="min-h-[160px] glass border-white/10 rounded-[2rem] focus:ring-primary/30 transition-all font-medium text-sm p-8 leading-relaxed"
                        placeholder="Define your professional resonance..."
                        disabled={!isEditing}
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Geographic Node</Label>
                        <Input 
                            id="location" 
                            defaultValue={data.basic.location} 
                            onChange={(e) => onUpdate?.('location', e.target.value)} 
                            disabled={!isEditing} 
                            className="h-14 glass border-white/10 rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Resonance Level</Label>
                        <Input 
                            id="exp" 
                            defaultValue={data.basic.experienceLevel} 
                            onChange={(e) => onUpdate?.('experienceLevel', e.target.value)} 
                            disabled={!isEditing} 
                            className="h-14 glass border-white/10 rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Engagement Type</Label>
                        <Input 
                            id="type" 
                            defaultValue={data.basic.jobType} 
                            onChange={(e) => onUpdate?.('jobType', e.target.value)} 
                            disabled={!isEditing} 
                            className="h-14 glass border-white/10 rounded-2xl focus:ring-primary/30 transition-all font-bold text-sm px-6"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
