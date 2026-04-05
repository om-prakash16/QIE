"use client"

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface ActivityChartProps {
    data: { year: string; value: number }[]
}

export function ActivityChart({ data }: ActivityChartProps) {
    // Find the max value to highlight the highest bar if desired, OR just use primary color
    // User image shows blue bars.

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-popover border border-border p-2 rounded-lg shadow-md text-sm">
                    <p className="font-semibold">{label}</p>
                    <p className="text-muted-foreground">{payload[0].value} contributions</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="w-full h-[180px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        dy={10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
