"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SalaryTableProps {
    title: string
    data: {
        label: string
        avg: number
        subtext?: string
    }[]
}

export function SalaryTable({ title, data }: SalaryTableProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px] pl-6">Category</TableHead>
                            <TableHead className="text-right pr-6">Avg Salary</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium pl-6">
                                    {item.label}
                                    {item.subtext && <p className="text-xs text-muted-foreground font-normal">{item.subtext}</p>}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <Badge variant="outline" className="font-mono">
                                        ₹{item.avg.toLocaleString()} LPA
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
