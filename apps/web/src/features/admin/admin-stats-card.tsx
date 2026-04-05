"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface AdminStatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: string
    trendUp?: boolean
    color?: string
    index?: number
}

export function AdminStatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    trendUp,
    color = "text-primary",
    index = 0
}: AdminStatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Card className={cn(
                "h-full relative overflow-hidden group border-white/5 bg-background/20 backdrop-blur-xl transition-all duration-500",
                "hover:border-white/20 hover:bg-background/30 shadow-2xl"
            )}>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                    <CardTitle className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">{title}</CardTitle>
                    <div className={cn(
                        "p-2.5 rounded-xl transition-all duration-300 bg-white/5 border border-white/5 group-hover:border-white/10 group-hover:scale-110",
                    )}>
                        <Icon className={cn("w-4 h-4", color)} />
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300">
                        {value}
                    </div>
                    {(trend || description) && (
                        <div className="flex items-center gap-1.5 mt-2">
                            {trend && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter",
                                    trendUp ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                                )}>
                                    {trend}
                                </span>
                            )}
                            <span className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-tight">
                                {description || "vs last metrics"}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}
