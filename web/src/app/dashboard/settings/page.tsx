"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Eye, EyeOff, Shield, Bell, Wallet, Download, History, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Visibility = "public" | "recruiter_only" | "private"

const visibilityOptions: { value: Visibility; label: string; icon: any; desc: string }[] = [
    { value: "public", label: "Public", icon: Eye, desc: "Visible to everyone" },
    { value: "recruiter_only", label: "Recruiter Only", icon: Shield, desc: "Only verified recruiters" },
    { value: "private", label: "Private", icon: EyeOff, desc: "Only you can see" },
]

const profileFields = [
    { key: "github_handle", label: "GitHub Username" },
    { key: "leetcode_url", label: "LeetCode URL" },
    { key: "kaggle_url", label: "Kaggle URL" },
    { key: "phone_number", label: "Phone Number" },
    { key: "salary_expectation", label: "Salary Expectation" },
    { key: "email", label: "Email Address" },
    { key: "location", label: "Location" },
]

export default function SettingsPage() {
    const { user } = useAuth()
    const [saving, setSaving] = useState(false)
    const [profileVisibility, setProfileVisibility] = useState<Visibility>("public")
    const [walletVisible, setWalletVisible] = useState(false)
    const [reputationVisible, setReputationVisible] = useState(true)
    const [nftVisible, setNftVisible] = useState(true)
    const [fieldVisibility, setFieldVisibility] = useState<Record<string, Visibility>>({
        github_handle: "public",
        leetcode_url: "recruiter_only",
        kaggle_url: "public",
        phone_number: "private",
        salary_expectation: "recruiter_only",
        email: "recruiter_only",
        location: "public",
    })
    const [notifications, setNotifications] = useState({
        job_matches: true,
        application_updates: true,
        skill_reminders: false,
        weekly_digest: true,
    })

    const handleSave = () => {
        setSaving(true)
        setTimeout(() => {
            setSaving(false)
            toast.success("Settings saved successfully!")
        }, 1000)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black font-heading tracking-tight flex items-center gap-3">
                        <Settings className="w-8 h-8 text-primary" />
                        Settings
                    </motion.h1>
                    <p className="text-muted-foreground text-sm">Privacy controls, notifications, and account management.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="rounded-xl font-bold gap-2 h-12 px-6">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <Tabs defaultValue="privacy" className="space-y-6">
                <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1 h-auto">
                    <TabsTrigger value="privacy" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">Privacy</TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">Notifications</TabsTrigger>
                    <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">Account</TabsTrigger>
                </TabsList>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6">
                    {/* Master Visibility */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-5">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Profile Visibility</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {visibilityOptions.map(opt => {
                                const isActive = profileVisibility === opt.value
                                const Icon = opt.icon
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => setProfileVisibility(opt.value)}
                                        className={cn(
                                            "p-4 rounded-xl border text-left transition-all",
                                            isActive ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-white/10 hover:border-white/20"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5 mb-2", isActive ? "text-primary" : "text-muted-foreground")} />
                                        <p className="text-sm font-bold">{opt.label}</p>
                                        <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Global Toggles */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-5">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Global Controls</h2>
                        <div className="space-y-4">
                            {[
                                { label: "Show wallet address", desc: "Display your Solana wallet publicly", checked: walletVisible, set: setWalletVisible },
                                { label: "Show reputation score", desc: "Display your proof-score on profile", checked: reputationVisible, set: setReputationVisible },
                                { label: "Show NFT credentials", desc: "Display verified skill NFTs publicly", checked: nftVisible, set: setNftVisible },
                            ].map(toggle => (
                                <div key={toggle.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <div>
                                        <Label className="text-sm font-bold">{toggle.label}</Label>
                                        <p className="text-[10px] text-muted-foreground">{toggle.desc}</p>
                                    </div>
                                    <Switch checked={toggle.checked} onCheckedChange={toggle.set} />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Per-Field Privacy */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-5">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Field-Level Privacy</h2>
                        <div className="space-y-3">
                            {profileFields.map(field => (
                                <div key={field.key} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <span className="text-sm font-medium">{field.label}</span>
                                    <div className="flex gap-1">
                                        {visibilityOptions.map(opt => {
                                            const isActive = fieldVisibility[field.key] === opt.value
                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setFieldVisibility(prev => ({ ...prev, [field.key]: opt.value }))}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                                        isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5"
                                                    )}
                                                >
                                                    {opt.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-5">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-primary" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Notification Preferences</h2>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(notifications).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <Label className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}</Label>
                                    <Switch checked={value} onCheckedChange={(v) => setNotifications(prev => ({ ...prev, [key]: v }))} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-5">
                        <div className="flex items-center gap-3">
                            <Wallet className="w-5 h-5 text-primary" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Connected Wallet</h2>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-xs text-muted-foreground">Connected Address</p>
                            <p className="text-sm font-mono font-bold mt-1">{user?.wallet_address || "Not connected"}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-5">
                        <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-primary" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Data Export</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">Download a complete export of your profile data, quiz history, and application records.</p>
                        <Button variant="outline" className="rounded-xl border-white/10 gap-2" onClick={() => toast.success("Data export started. You'll receive an email when ready.")}>
                            <Download className="w-4 h-4" />Export Data (JSON)
                        </Button>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
