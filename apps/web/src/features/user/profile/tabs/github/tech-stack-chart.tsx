"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface TechStackChartProps {
    data: { name: string; value: number; color: string }[]
}

export function TechStackChart({ data }: TechStackChartProps) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0)

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-popover border border-border p-2 rounded-lg shadow-md text-sm">
                    <p className="font-semibold">{payload[0].name}</p>
                    <p className="text-muted-foreground">{payload[0].value} repos ({Math.round((payload[0].value / total) * 100)}%)</p>
                </div>
            )
        }
        return null
    }

    const renderLegend = (props: any) => {
        const { payload } = props;
        return (
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mt-4">
                {payload.map((entry: any, index: number) => {
                    const item = data.find(d => d.name === entry.value);
                    const percentage = item ? Math.round((item.value / total) * 100) : 0;

                    return (
                        <div key={`item-${index}`} className="flex items-center justify-between min-w-[120px]">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-muted-foreground">{entry.value}</span>
                            </div>
                            <span className="font-bold">{percentage}%</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="w-full h-[250px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={renderLegend} verticalAlign="bottom" height={80} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
