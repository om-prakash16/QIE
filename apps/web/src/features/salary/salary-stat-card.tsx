"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface SalaryStatCardProps {
    title: string
    value: string
    subtext?: string
    icon: LucideIcon
    sentiment?: "positive" | "negative" | "neutral"
}

export function SalaryStatCard({ title, value, subtext, icon: Icon, sentiment = "neutral" }: SalaryStatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtext && (
                    <p className={`text-xs mt-1 ${sentiment === "positive" ? "text-green-600 dark:text-green-400" :
                            sentiment === "negative" ? "text-red-500" : "text-muted-foreground"
                        }`}>
                        {subtext}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
