"use client"

import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts'
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Briefcase, Zap } from "lucide-react"

const data = [
    { name: 'Jan', userGrowth: 400, jobVelocity: 240, volume: 600 },
    { name: 'Feb', userGrowth: 300, jobVelocity: 539, volume: 700 },
    { name: 'Mar', userGrowth: 600, jobVelocity: 980, volume: 1200 },
    { name: 'Apr', userGrowth: 878, jobVelocity: 390, volume: 1100 },
    { name: 'May', userGrowth: 489, jobVelocity: 480, volume: 1300 },
    { name: 'Jun', userGrowth: 1239, jobVelocity: 380, volume: 1600 },
    { name: 'Jul', userGrowth: 1549, jobVelocity: 430, volume: 1900 },
]

export function PlatformActivityChart() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="h-full"
        >
            <Card className="h-full bg-background/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] group overflow-hidden relative">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
                
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
                    <div>
                        <CardTitle className="text-2xl font-bold font-heading tracking-tight flex items-center gap-2">
                            Platform Vitality
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">Real-time talent vs opportunity orchestration</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Live Data</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[380px] w-full pt-2 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUserGrowth" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }} 
                                dy={15}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }} 
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'rgba(15,15,20,0.95)', 
                                    borderRadius: '16px', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(16px)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                    padding: '12px 16px'
                                }}
                                itemStyle={{ padding: '2px 0' }}
                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="userGrowth" 
                                name="Talent Growth"
                                stroke="hsl(var(--primary))" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorUserGrowth)" 
                                animationDuration={2000}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="jobVelocity" 
                                name="Job Velocity"
                                stroke="#10b981" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorVelocity)" 
                                animationDuration={2500}
                                animationBegin={500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export function QuickStats({ stats }: { stats: any }) {
    const cards = [
        { title: "Verified Talent", value: stats?.totalUsers || "1,280", icon: Users, color: "text-primary", glow: "hover:shadow-primary/20", trend: "+14.2%" },
        { title: "Active Bounties", value: stats?.activeJobs || "432", icon: Briefcase, color: "text-emerald-500", glow: "hover:shadow-emerald-500/20", trend: "+8.1%" },
        { title: "Contract Value", value: "$42.5k", icon: Zap, color: "text-amber-500", glow: "hover:shadow-amber-500/20", trend: "+22.4%" },
        { title: "Network Uptime", value: "99.9%", icon: TrendingUp, color: "text-cyan-500", glow: "hover:shadow-cyan-500/20", trend: "Stable" },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                >
                    <Card className={cn(
                        "h-full relative overflow-hidden group border-white/5 bg-background/20 backdrop-blur-xl transition-all duration-500",
                        "hover:border-white/20 hover:bg-background/30",
                        card.glow
                    )}>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        
                        <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                            <CardTitle className="text-xs font-bold text-muted-foreground/70 uppercase tracking-[0.15em]">{card.title}</CardTitle>
                            <div className={cn(
                                "p-2.5 rounded-xl transition-all duration-300 bg-white/5 border border-white/5 group-hover:border-white/10 group-hover:scale-110",
                            )}>
                                <card.icon className={cn("w-4 h-4", card.color)} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300">
                                {card.value}
                            </div>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase",
                                    card.trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                                )}>
                                    {card.trend}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium">vs last month</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}

