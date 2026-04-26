"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserProfile } from "@/types/profile"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface SettingsTabProps {
    data: UserProfile
    onUpdateSettings?: (field: string, value: any) => void
}

export function SettingsTab({ data, onUpdateSettings }: SettingsTabProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <Card className="glass border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 pb-8 pt-8 px-10">
                <CardTitle className="text-3xl font-black tracking-tighter text-gradient">Protocol Settings</CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pt-2">
                    Manage your platform preferences and visibility.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-10">
                <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-2">
                        <Label className="text-sm font-black uppercase tracking-[0.1em] text-foreground">Nexus Notifications</Label>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Receive cryptographic alerts about new matches.</p>
                    </div>
                    <Switch defaultChecked={data.settings.notifications} onCheckedChange={(checked) => onUpdateSettings?.('notifications', checked)} className="data-[state=checked]:bg-primary" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-black uppercase tracking-[0.1em] text-foreground">Identity Visibility</Label>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Control the exposure of your Matrix Profile.</p>
                    </div>
                    <Select defaultValue={data.settings.visibility.toLowerCase()} onValueChange={(val) => onUpdateSettings?.('visibility', val === "public" ? "Public" : "Private")}>
                        <SelectTrigger className="w-full md:w-[220px] h-12 glass border-white/10 rounded-xl focus:ring-primary/20 text-xs font-black uppercase tracking-widest">
                            <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/10 rounded-xl">
                            <SelectItem value="public" className="text-xs font-bold uppercase tracking-widest focus:bg-primary/20">Public Node</SelectItem>
                            <SelectItem value="private" className="text-xs font-bold uppercase tracking-widest focus:bg-primary/20">Private Enclave</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-black uppercase tracking-[0.1em] text-foreground">Interface Theme</Label>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Select your preferred terminal environment.</p>
                    </div>
                    <Select
                        value={mounted ? theme : "system"}
                        onValueChange={setTheme}
                    >
                        <SelectTrigger className="w-full md:w-[220px] h-12 glass border-white/10 rounded-xl focus:ring-primary/20 text-xs font-black uppercase tracking-widest">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/10 rounded-xl">
                            <SelectItem value="light" className="text-xs font-bold uppercase tracking-widest focus:bg-primary/20">Light Energy</SelectItem>
                            <SelectItem value="dark" className="text-xs font-bold uppercase tracking-widest focus:bg-primary/20">Deep Space (Dark)</SelectItem>
                            <SelectItem value="system" className="text-xs font-bold uppercase tracking-widest focus:bg-primary/20">System Default</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 p-8 flex justify-between bg-white/[0.02]">
                <Button variant="ghost" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 font-black uppercase text-[10px] tracking-widest h-12 px-6 rounded-xl transition-all">Deactivate Identity</Button>
                <Button variant="outline" className="glass border-white/10 hover:border-white/20 font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-xl transition-all">Disconnect</Button>
            </CardFooter>
        </Card>
    )
}
