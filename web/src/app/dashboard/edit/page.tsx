"use client"

import { DynamicProfileForm } from "@/components/features/profile/DynamicProfileForm"
import { useAuth } from "@/context/auth-context"
import { motion } from "framer-motion"
import { UserPen, History, ArrowUpRight, RefreshCw } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export default function EditProfilePage() {
    const { user } = useAuth()
    const [syncing, setSyncing] = useState(false)

    const { data: snapshots } = useQuery({
        queryKey: ["profileSnapshots", user?.wallet_address],
        queryFn: async () => {
            const res = await fetch(`${API}/user/profile/snapshots?wallet=${user?.wallet_address}`)
            return res.json()
        },
        enabled: !!user?.wallet_address,
    })

    const { data: initialProfile, isLoading } = useQuery({
        queryKey: ["userProfile", user?.id],
        queryFn: async () => {
            const token = localStorage.getItem("auth_token")
            const res = await fetch(`${API}/users/`, {
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
            })
            return res.json()
        },
        enabled: !!user?.id
    })

    const handleSync = async () => {
        setSyncing(true)
        // Simulate blockchain sync
        setTimeout(() => {
            setSyncing(false)
            toast.success("Profile NFT metadata updated on Solana!")
        }, 2000)
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-black font-heading tracking-tight flex items-center gap-3"
                    >
                        <UserPen className="w-8 h-8 text-primary" />
                        Edit Profile
                    </motion.h1>
                    <p className="text-muted-foreground text-sm">Update your identity. Changes are stored off-chain until you sync to Solana.</p>
                </div>
                <Button
                    onClick={handleSync}
                    disabled={syncing}
                    className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold rounded-xl h-12 px-6 gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                    {syncing ? "Syncing..." : "Sync to Blockchain"}
                </Button>
            </div>

            {/* Dynamic Profile Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
            >
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <RefreshCw className="w-10 h-10 text-primary animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Recruiting Identity...</span>
                    </div>
                ) : (
                    <DynamicProfileForm initialData={initialProfile?.profile_data} />
                )}
            </motion.div>

            {/* Version History */}
            {snapshots && snapshots.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-5"
                >
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-primary" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Profile Version History</h2>
                    </div>
                    <div className="space-y-3">
                        {snapshots.map((snap: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
                                    v{snap.version}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-mono text-muted-foreground truncate">CID: {snap.ipfs_cid}</p>
                                    <p className="text-[10px] text-muted-foreground/60">{new Date(snap.created_at).toLocaleDateString()}</p>
                                </div>
                                {snap.on_chain_tx_sig ? (
                                    <a
                                        href={`https://explorer.solana.com/tx/${snap.on_chain_tx_sig}?cluster=devnet`}
                                        target="_blank"
                                        className="text-[10px] text-primary flex items-center gap-1 font-bold"
                                    >
                                        On-chain <ArrowUpRight className="w-3 h-3" />
                                    </a>
                                ) : (
                                    <span className="text-[10px] text-muted-foreground/40">Pending sync</span>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
