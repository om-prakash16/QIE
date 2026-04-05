"use client"

import { useState } from "react"
import { Shield, CheckCircle2, XCircle, RefreshCw, AlertTriangle, Clock, ExternalLink } from "lucide-react"

type FlagStatus = "flagged" | "approved" | "rejected" | "retest_requested"
type FlagReason = "ai_score_mismatch" | "github_suspicious" | "duplicate_cert" | "invalid_proof" | "manual_review"

interface NftFlag {
    id: string
    nft_mint: string
    candidate: string
    skill:     string
    reason:    FlagReason
    ai_score:  number
    expected_score: number
    status:    FlagStatus
    flagged_by: string
    age:       string
}

const mockFlags: NftFlag[] = [
    { id: "f1", nft_mint: "So11...AaB", candidate:"0xabc...fake",  skill:"Python",          reason:"ai_score_mismatch", ai_score:22,  expected_score:75, status:"flagged",           flagged_by:"ver_priya", age:"2h"  },
    { id: "f2", nft_mint: "9XyZ...MnP", candidate:"0xdef...real",  skill:"React",           reason:"github_suspicious", ai_score:61,  expected_score:80, status:"flagged",           flagged_by:"mod_anita", age:"5h"  },
    { id: "f3", nft_mint: "7AbC...WeQ", candidate:"0xghi...test",  skill:"Machine Learning",reason:"duplicate_cert",    ai_score:88,  expected_score:88, status:"approved",          flagged_by:"ver_priya", age:"1d"  },
    { id: "f4", nft_mint: "KkLl...ZZa", candidate:"0xjkl...sus",   skill:"Rust",            reason:"invalid_proof",     ai_score:5,   expected_score:70, status:"retest_requested",  flagged_by:"ver_priya", age:"3h"  },
    { id: "f5", nft_mint: "BcDe...FgH", candidate:"0xmno...ok",    skill:"Solana",          reason:"manual_review",     ai_score:78,  expected_score:80, status:"flagged",           flagged_by:"mod_anita", age:"30m" },
]

const reasonLabels: Record<FlagReason, string> = {
    ai_score_mismatch: "AI Score Mismatch",
    github_suspicious:  "GitHub Suspicious",
    duplicate_cert:     "Duplicate Certificate",
    invalid_proof:      "Invalid Proof",
    manual_review:      "Manual Review",
}

const statusStyles: Record<FlagStatus, string> = {
    flagged:           "text-red-400 bg-red-500/10 border-red-500/30",
    approved:          "text-green-400 bg-green-500/10 border-green-500/30",
    rejected:          "text-slate-400 bg-slate-500/10 border-slate-500/30",
    retest_requested:  "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
}

const reasonStyles: Record<FlagReason, string> = {
    ai_score_mismatch:  "text-orange-400",
    github_suspicious:  "text-red-400",
    duplicate_cert:     "text-purple-400",
    invalid_proof:      "text-red-400",
    manual_review:      "text-blue-400",
}

export default function StaffNftMonitorPage() {
    const [flags, setFlags] = useState(mockFlags)
    const [filterStatus, setFilterStatus] = useState("all")

    const act = (id: string, status: FlagStatus) => {
        setFlags(prev => prev.map(f => f.id === id ? { ...f, status } : f))
    }

    const filtered = flags.filter(f => filterStatus === "all" || f.status === filterStatus)

    const summary = {
        flagged:  flags.filter(f => f.status === "flagged").length,
        approved: flags.filter(f => f.status === "approved").length,
        retest:   flags.filter(f => f.status === "retest_requested").length,
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">NFT Activity Monitor</h1>
                <p className="text-slate-400 text-sm mt-1">Review skill NFT flags — AI mismatches, duplicate certs, and suspicious GitHub activity.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-slate-400">Active Flags</span>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{summary.flagged}</p>
                </div>
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <RefreshCw className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-slate-400">Retest Pending</span>
                    </div>
                    <p className="text-3xl font-bold text-yellow-400">{summary.retest}</p>
                </div>
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-slate-400">Approved Today</span>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{summary.approved}</p>
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
                {["all", "flagged", "approved", "rejected", "retest_requested"].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${filterStatus === s ? "bg-violet-600/20 text-violet-300 border-violet-600/30" : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-100"}`}
                    >
                        {s.replace("_", " ")}
                    </button>
                ))}
            </div>

            {/* Flags Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-left">
                                {["NFT Mint", "Candidate", "Skill", "Flag Reason", "AI Score vs Expected", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(flag => (
                                <tr key={flag.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <Shield className="w-3 h-3 text-violet-400 shrink-0" />
                                            <span className="font-mono text-xs text-slate-300">{flag.nft_mint}</span>
                                            <a href="#" className="text-slate-600 hover:text-violet-400 transition-colors">
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-xs text-slate-400">{flag.candidate}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-white">{flag.skill}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium ${reasonStyles[flag.reason]}`}>
                                            {reasonLabels[flag.reason]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`font-bold ${flag.ai_score < 50 ? "text-red-400" : "text-yellow-400"}`}>
                                                {flag.ai_score}%
                                            </span>
                                            <span className="text-slate-600">vs</span>
                                            <span className="text-green-400">{flag.expected_score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyles[flag.status]}`}>
                                            {flag.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => act(flag.id, "approved")}
                                                title="Approve"
                                                className="p-1.5 rounded-lg hover:bg-green-500/10 text-slate-500 hover:text-green-400 transition-all">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => act(flag.id, "retest_requested")}
                                                title="Request Retest"
                                                className="p-1.5 rounded-lg hover:bg-yellow-500/10 text-slate-500 hover:text-yellow-400 transition-all">
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => act(flag.id, "rejected")}
                                                title="Reject"
                                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all">
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
