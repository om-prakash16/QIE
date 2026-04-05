"use client"

import { motion } from "framer-motion"
import { Terminal, Cpu, Database, Brain, Search, Code } from "lucide-react"

const mockAILogs = [
    { id: "LOG-01", module: "Resume Parser", action: "Skill Extraction", confidence: "0.98", status: "Success", time: "2m ago" },
    { id: "LOG-02", module: "Job Matcher", action: "Candidate Ranking", confidence: "0.85", status: "Success", time: "15m ago" },
    { id: "LOG-03", module: "Proof Scorer", action: "Reputation Calc", confidence: "N/A", status: "Error", time: "30m ago" },
    { id: "LOG-04", module: "Quiz Gen", action: "React Native Quiz", confidence: "0.92", status: "Success", time: "1h ago" },
]

export default function StaffAILogs() {
    return (
        <div className="space-y-12 pb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                            <Terminal className="w-6 h-6 text-primary" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 mb-1">Intelligence Monitor</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-white">
                                AI Metrics
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-white/60">Logic Engine: V4.2.0</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Code className="w-5 h-5 text-primary" />
                            Live Process Execution
                        </h3>
                        <div className="space-y-4 font-mono text-sm uppercase tracking-tighter">
                            {mockAILogs.map((log, i) => (
                                <motion.div 
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                                >
                                    <span className="text-white/20 w-16">{log.id}</span>
                                    <span className="text-primary font-black w-32">{log.module}</span>
                                    <span className="text-white/60 flex-1">{log.action}</span>
                                    <span className="text-white/20">Conf: {log.confidence}</span>
                                    <span className={log.status === 'Success' ? 'text-emerald-400' : 'text-red-400'}>{log.status}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 backdrop-blur-md">
                        <Brain className="w-12 h-12 text-primary mb-6" />
                        <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Neural Health</h4>
                        <p className="text-sm text-white/40 mb-6 font-medium">Platform-wide AI inference stability across all modules.</p>
                        <div className="space-y-4">
                            {[
                                { name: "Parser Stability", val: 99.4 },
                                { name: "Match Precision", val: 88.2 },
                                { name: "Quiz Generation", val: 94.7 }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-white/40">{stat.name}</span>
                                        <span className="text-primary">{stat.val}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.val}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-primary shadow-lg shadow-primary/20"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
