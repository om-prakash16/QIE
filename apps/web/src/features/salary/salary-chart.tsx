"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useTheme } from "next-themes"

interface SalaryChartProps {
    data: { range: string; count: number }[]
}

export function SalaryChart({ data }: SalaryChartProps) {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis
                    dataKey="range"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Range
                                            </span>
                                            <span className="font-bold text-muted-foreground">
                                                {payload[0].payload.range}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Count
                                            </span>
                                            <span className="font-bold">
                                                {payload[0].value}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Bar
                    dataKey="count"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                    maxBarSize={50}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
