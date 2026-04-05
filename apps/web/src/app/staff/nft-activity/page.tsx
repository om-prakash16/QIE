"use client"

import { motion } from "framer-motion"
import { Activity, Cpu, ExternalLink, RefreshCcw, ShieldCheck, Zap } from "lucide-react"

const mockNFTLogs = [
    { mint: "7xWz...2pQ", owner: "0x12...abc", type: "Mint", asset: "Skill NFT: Python", status: "Success", time: "5m ago" },
    { mint: "9bYy...4mK", owner: "0x44...efg", type: "Update", asset: "Profile NFT", status: "Success", time: "12m ago" },
    { mint: "1zAq...9vL", owner: "0x98...zyx", type: "Mint", asset: "Achievement: Hackathon", status: "Success", time: "1h ago" },
    { mint: "3rTx...5sW", owner: "0x33...lmn", type: "Sync", asset: "Skill NFT: Rust", status: "Warning", time: "3h ago" },
]

export default function StaffNFTActivity() {
    return (
        <div className="space-y-12 pb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 backdrop-blur-md shadow-lg shadow-indigo-500/5">
                            <Activity className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400/70 mb-1">On-Chain Ledger</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-white">
                                NFT Activity
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest">
                        <RefreshCcw className="w-4 h-4" />
                        Live Update
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400 text-xs font-bold uppercase tracking-widest">
                        <ExternalLink className="w-4 h-4" />
                        Solana Explorer
                    </button>
                </div>
            </header>

            <div className="bg-black/20 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-bottom border-white/5">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Transaction</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Asset</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Owner</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Time</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockNFTLogs.map((log, i) => (
                            <motion.tr 
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-white/[0.02] transition-colors"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${log.type === 'Mint' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-white/80">{log.type}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-sm font-black tracking-tight text-white/90">{log.asset}</span>
                                </td>
                                <td className="px-8 py-6 font-mono text-xs text-white/40">{log.owner}</td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                        <span className={`text-[10px] font-black uppercase ${log.status === 'Success' ? 'text-emerald-400' : 'text-orange-400'}`}>{log.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-white/30">{log.time}</td>
                                <td className="px-8 py-6 text-right">
                                    <button className="text-primary hover:text-white transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
