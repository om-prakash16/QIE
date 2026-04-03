"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

interface AdminTableProps {
    headers: string[]
    children: React.ReactNode
    className?: string
    showCheckbox?: boolean
    onSelectAll?: (checked: boolean) => void
    isAllSelected?: boolean
}

export function AdminTable({ 
    headers, 
    children, 
    className, 
    showCheckbox, 
    onSelectAll, 
    isAllSelected 
}: AdminTableProps) {
    return (
        <div className={cn("relative overflow-hidden rounded-[2rem] border border-white/5 bg-background/20 backdrop-blur-3xl shadow-2xl transition-all duration-500 hover:border-white/10", className)}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-50" />
            
            <div className="overflow-x-auto custom-scrollbar">
                <Table>
                    <TableHeader className="bg-white/[0.02] border-b border-white/5">
                        <TableRow className="border-b-white/5 hover:bg-transparent transition-none">
                            {showCheckbox && (
                                <TableHead className="w-12 px-8">
                                    <Checkbox 
                                        checked={isAllSelected} 
                                        onCheckedChange={(checked) => onSelectAll?.(!!checked)}
                                        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                </TableHead>
                            )}
                            {headers.map((header, i) => (
                                <TableHead 
                                    key={i} 
                                    className="font-black text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40 py-7 px-8 whitespace-nowrap"
                                >
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {children || (
                                <TableRow>
                                    <TableCell colSpan={headers.length + (showCheckbox ? 1 : 0)} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/30 animate-spin" />
                                            </div>
                                            <p className="text-xs font-black uppercase tracking-[0.3em]">No Data Nodes Found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

interface AdminTableRowProps {
    children: React.ReactNode
    index: number
    className?: string
    onClick?: () => void
    showCheckbox?: boolean
    isSelected?: boolean
    onSelect?: (checked: boolean) => void
}

export function AdminTableRow({ 
    children, 
    index, 
    className, 
    onClick,
    showCheckbox,
    isSelected,
    onSelect
}: AdminTableRowProps) {
    return (
        <motion.tr
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClick}
            className={cn(
                "border-b border-white/5 hover:bg-white/[0.02] transition-all duration-300 group/row cursor-pointer relative",
                isSelected && "bg-primary/[0.03] border-primary/20",
                className
            )}
        >
            {showCheckbox && (
                <TableCell className="w-12 px-8" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                        checked={isSelected} 
                        onCheckedChange={(checked) => onSelect?.(!!checked)}
                        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-transform active:scale-90"
                    />
                </TableCell>
            )}
            {children}
            {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
            )}
        </motion.tr>
    )
}

export function AdminTableCell({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <TableCell className={cn("py-7 px-8 text-sm font-medium transition-colors group-hover/row:text-foreground text-muted-foreground/80", className)}>
            {children}
        </TableCell>
    )
}
