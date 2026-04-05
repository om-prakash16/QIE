"use client"

import { motion } from "framer-motion"
import { DynamicSchemaBuilder } from "@/features/admin/DynamicSchemaBuilder"
import { Sparkles } from "lucide-react"

export default function AdminSchemaPage() {
    return (
        <div className="space-y-12 pb-24 max-w-[1200px] mx-auto relative">
            {/* Background Accent Glow */}
            <div className="absolute -top-40 -left-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 mb-1">Architecture Node</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-foreground">
                                Profile Schema
                            </h1>
                        </div>
                    </div>
                </motion.div>
            </header>

            <div className="relative z-20">
                <DynamicSchemaBuilder />
            </div>
        </div>
    )
}
