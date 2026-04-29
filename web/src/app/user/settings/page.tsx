"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/auth-context"
import { userApi } from "@/lib/api/user-api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { Loader2, Shield, Bell, Eye, Palette, Lock, Smartphone, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function UserSettingsPage() {
    const { user, logout } = useAuth()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const queryClient = useQueryClient()

    useEffect(() => { setMounted(true) }, [])

    // 1. Fetch User Settings
    const { data: settings, isLoading } = useQuery({
        queryKey: ["user-settings"],
        queryFn: () => userApi.settings.get(),
        enabled: !!user
    })

    // 2. Update Mutation
    const updateMutation = useMutation({
        mutationFn: (newData: any) => userApi.settings.update(newData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-settings"] })
            toast.success("Security protocols synchronized.")
        },
        onError: () => {
            toast.error("Handshake failed. Protocol mismatch.")
        }
    })

    const handlePrefChange = (prefKey: string, value: boolean) => {
        const currentPrefs = settings?.notification_prefs || {}
        updateMutation.mutate({
            notification_prefs: {
                ...currentPrefs,
                [prefKey]: value
            }
        })
    }

    const handleVisibilityChange = (value: string) => {
        updateMutation.mutate({ profile_visibility: value })
    }

    if (!user || isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const notification_prefs = settings?.notification_prefs || {}

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 md:px-8 space-y-16 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full" />
            
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-6xl font-black font-heading tracking-tighter italic uppercase leading-none text-white">Settings</h1>
                <div className="flex items-center gap-4">
                    <div className="h-px w-24 bg-primary" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Account configuration & security protocols</p>
                </div>
            </div>

            {/* Notifications */}
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-white/5 p-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Bell className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black italic uppercase tracking-tight text-white">Notifications</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Manage your alert preferences</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-black uppercase tracking-wide text-white">Application Updates</Label>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Alerts for view, interview, and feedback status.</p>
                        </div>
                        <Switch 
                            checked={!!notification_prefs.application_updates} 
                            onCheckedChange={(v) => handlePrefChange('application_updates', v)}
                            className="data-[state=checked]:bg-primary" 
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-black uppercase tracking-wide text-white">AI Job Recommendations</Label>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Proactive alerts for roles with high skill resonance.</p>
                        </div>
                        <Switch 
                            checked={!!notification_prefs.ai_recommendations} 
                            onCheckedChange={(v) => handlePrefChange('ai_recommendations', v)}
                            className="data-[state=checked]:bg-primary" 
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-black uppercase tracking-wide text-white">Skill Verification</Label>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Results from automated GitHub audits and quizzes.</p>
                        </div>
                        <Switch 
                            checked={!!notification_prefs.skill_verification} 
                            onCheckedChange={(v) => handlePrefChange('skill_verification', v)}
                            className="data-[state=checked]:bg-primary" 
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-black uppercase tracking-wide text-white">Interview Requests</Label>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Direct scheduling invites from verified recruiters.</p>
                        </div>
                        <Switch 
                            checked={!!notification_prefs.interview_requests} 
                            onCheckedChange={(v) => handlePrefChange('interview_requests', v)}
                            className="data-[state=checked]:bg-primary" 
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Privacy & Visibility */}
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-white/5 p-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black italic uppercase tracking-tight text-white">Privacy & Visibility</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Control who sees your profile</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-black uppercase tracking-wide text-white">Profile Visibility</Label>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Control the exposure of your profile to recruiters</p>
                        </div>
                        <Select value={settings?.profile_visibility || 'public'} onValueChange={handleVisibilityChange}>
                            <SelectTrigger className="w-full md:w-[240px] h-12 glass border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-white/10">
                                <SelectItem value="public" className="text-xs font-bold uppercase tracking-widest">Public — Visible to All</SelectItem>
                                <SelectItem value="recruiters" className="text-xs font-bold uppercase tracking-widest">Recruiters Only</SelectItem>
                                <SelectItem value="private" className="text-xs font-bold uppercase tracking-widest">Private — Hidden</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-white/5 p-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <Palette className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black italic uppercase tracking-tight text-white">Appearance</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Customize your interface</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-black uppercase tracking-wide text-white">Interface Theme</Label>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Select your preferred visual environment</p>
                        </div>
                        <Select value={mounted ? theme : "system"} onValueChange={setTheme}>
                            <SelectTrigger className="w-full md:w-[240px] h-12 glass border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-white/10">
                                <SelectItem value="light" className="text-xs font-bold uppercase tracking-widest">Light Mode</SelectItem>
                                <SelectItem value="dark" className="text-xs font-bold uppercase tracking-widest">Dark Mode</SelectItem>
                                <SelectItem value="system" className="text-xs font-bold uppercase tracking-widest">System Default</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-white/5 p-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-rose-400" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black italic uppercase tracking-tight text-white">Security</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Protect your account</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                    <div className="flex items-center justify-between p-6 glass rounded-2xl border-white/5">
                        <div className="flex items-center gap-4">
                            <Lock className="w-5 h-5 text-white/20" />
                            <div className="space-y-1">
                                <p className="text-sm font-black uppercase tracking-wide text-white">Wallet Connection</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Authenticated via Solana Protocol</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 text-[9px] font-black uppercase tracking-widest">
                            Secure
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="glass border-rose-500/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-rose-500/10 p-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                            <Trash2 className="w-6 h-6 text-rose-400" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black italic uppercase tracking-tight text-rose-400">Danger Zone</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Irreversible actions</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 glass rounded-2xl border-rose-500/10">
                        <div className="space-y-1.5">
                            <p className="text-sm font-black uppercase tracking-wide text-white">Sign Out of All Devices</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Terminate all active sessions</p>
                        </div>
                        <Button variant="outline" className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl" onClick={logout}>
                            Sign Out Everywhere
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
