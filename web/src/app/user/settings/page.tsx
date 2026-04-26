"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { Loader2, Shield, Bell, Eye, Palette, Key, Trash2, Lock, Smartphone, Globe } from "lucide-react"
import { toast } from "sonner"
import { useEffect } from "react"

export default function UserSettingsPage() {
    const { user, logout } = useAuth()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    if (!user) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

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
                            <Label className="text-sm font-black uppercase tracking-wide text-white">Email Notifications</Label>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Receive alerts about new job matches and applications</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-black uppercase tracking-wide text-white">Push Notifications</Label>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Real-time alerts in your browser</p>
                        </div>
                        <Switch className="data-[state=checked]:bg-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-black uppercase tracking-wide text-white">Marketing Emails</Label>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Product updates and career insights</p>
                        </div>
                        <Switch className="data-[state=checked]:bg-primary" />
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
                        <Select defaultValue="public">
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
                    <div className="flex items-center justify-between">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-black uppercase tracking-wide text-white">Show Profile to Search Engines</Label>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Allow indexing by Google, Bing, etc.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
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
                                <p className="text-sm font-black uppercase tracking-wide text-white">Password</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Last changed 30 days ago</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="glass border-white/10 text-[10px] font-black uppercase tracking-widest rounded-xl h-10 px-6">
                            Change
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-6 glass rounded-2xl border-white/5">
                        <div className="flex items-center gap-4">
                            <Smartphone className="w-5 h-5 text-white/20" />
                            <div className="space-y-1">
                                <p className="text-sm font-black uppercase tracking-wide text-white">Two-Factor Authentication</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Add an extra layer of security</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-amber-500/20 text-amber-400 bg-amber-500/5 text-[9px] font-black uppercase tracking-widest">
                            Not Enabled
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 glass rounded-2xl border-rose-500/10">
                        <div className="space-y-1.5">
                            <p className="text-sm font-black uppercase tracking-wide text-white">Delete Account</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="outline" className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-xl">
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
