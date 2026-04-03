"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
    Loader2, 
    Trash2, 
    ShieldAlert, 
    Search,
    UserPlus,
    Filter,
    MoreHorizontal,
    ArrowUpRight,
    Users,
    ShieldCheck
} from "lucide-react"
import { toast } from "sonner"
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/features/admin/admin-table"
import { AdminStatsCard } from "@/components/features/admin/admin-stats-card"
import { EditUserModal } from "@/components/features/admin/edit-user-modal"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

export default function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [userToEdit, setUserToEdit] = useState<any | null>(null)
    
    const { data: users, isLoading, refetch } = useQuery({
        queryKey: ["adminAllUsers"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (error) throw error
            return data
        }
    })

    const filteredUsers = users?.filter(u => 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (u.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelectAll = (checked: boolean) => {
        if (checked && filteredUsers) {
            setSelectedUsers(filteredUsers.map(u => u.id))
        } else {
            setSelectedUsers([])
        }
    }

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId) 
                : [...prev, userId]
        )
    }

    const handleBulkDelete = async () => {
        if (selectedUsers.length === 0) return
        if (!confirm(`Purge ${selectedUsers.length} selected nodes from the mesh?`)) return
        
        try {
            const { error } = await supabase.from('users').delete().in('id', selectedUsers)
            if (error) throw error
            toast.success(`${selectedUsers.length} identities purged and de-synced`)
            setSelectedUsers([])
            refetch()
        } catch (err: any) {
            toast.error(`Mass deletion protocol failed: ${err.message}`)
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        
        try {
            const { error } = await supabase.from('users').delete().eq('id', userId)
            if (error) throw error
            toast.success("User removed successfully")
            refetch()
        } catch (err: any) {
            toast.error(`Error deleting user: ${err.message}`)
        }
    }

    const handleEditUser = (user: any) => {
        setUserToEdit(user)
        setIsEditModalOpen(true)
    }

    if (isLoading) {
        return (
            <div className="flex h-[70vh] w-full items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
                </div>
            </div>
        )
    }

    const totalUsers = users?.length || 0
    const companyCount = users?.filter(u => u.role === 'company').length || 0
    const talentCount = totalUsers - companyCount

    return (
        <div className="space-y-12 pb-24 max-w-[1600px] mx-auto relative">
            <EditUserModal 
                user={userToEdit}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={refetch}
            />

            {/* Background Accent Glow */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-md shadow-lg shadow-primary/5">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70 mb-1">Security Node</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-foreground">
                                Identity Management
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center gap-4"
                >
                    <AnimatePresence mode="wait">
                        {selectedUsers.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-3 px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl"
                            >
                                <span className="text-xs font-black uppercase tracking-widest text-rose-400">{selectedUsers.length} nodes selected</span>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleBulkDelete}
                                    className="h-8 rounded-xl hover:bg-rose-500/20 text-rose-400 font-bold px-4"
                                >
                                    Purge Data
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Locate identity..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-background/20 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold placeholder:text-muted-foreground/30 shadow-2xl"
                                />
                            </div>
                        )}
                    </AnimatePresence>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-8 h-14 shadow-2xl border-t border-white/20 font-black tracking-tight group overflow-hidden relative">
                        <UserPlus className="w-5 h-5 mr-3" />
                        <span className="relative z-10">Provision Identity</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Button>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AdminStatsCard 
                    title="Total Identities" 
                    value={totalUsers} 
                    icon={Users} 
                    index={0}
                />
                <AdminStatsCard 
                    title="Verified Talent" 
                    value={talentCount} 
                    icon={ArrowUpRight} 
                    color="text-emerald-400"
                    description="Protocols locked"
                    index={1}
                />
                <AdminStatsCard 
                    title="Registered Nodes" 
                    value={companyCount} 
                    icon={ShieldAlert} 
                    color="text-blue-400"
                    description="Company entities"
                    index={2}
                />
            </div>

            <AdminTable 
                headers={["Matrix Identity", "Access Point", "Classification", "Protocol Sync", "Actions"]}
                showCheckbox
                isAllSelected={(filteredUsers?.length ?? 0) > 0 && selectedUsers.length === filteredUsers?.length}
                onSelectAll={handleSelectAll}
            >
                {filteredUsers?.map((u, i) => (
                    <AdminTableRow 
                        key={u.id} 
                        index={i}
                        showCheckbox
                        isSelected={selectedUsers.includes(u.id)}
                        onSelect={() => toggleUserSelection(u.id)}
                        onClick={() => handleEditUser(u)}
                    >
                        <AdminTableCell>
                            <div className="flex items-center gap-4">
                                <div className="relative group/avatar">
                                    <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 border border-white/10 flex items-center justify-center font-black text-primary text-xl relative shadow-lg">
                                        {u.full_name?.charAt(0) || u.email.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-base text-foreground/90 tracking-tight group-hover/row:text-primary transition-colors">{u.full_name || 'Anonymous Entity'}</span>
                                    <span className="text-[10px] text-primary/60 font-black uppercase tracking-[0.1em]">{u.id.substring(0, 12)}</span>
                                </div>
                            </div>
                        </AdminTableCell>
                        <AdminTableCell className="text-muted-foreground font-bold tracking-tight italic opacity-70 group-hover/row:opacity-100 transition-opacity">
                            {u.email}
                        </AdminTableCell>
                        <AdminTableCell>
                            <Badge variant="outline" className={cn(
                                "rounded-xl px-4 py-1.5 border border-white/5 shadow-xl transition-all duration-500 font-black text-[10px] uppercase tracking-widest",
                                u.role === 'company' 
                                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover/row:bg-blue-500/20' 
                                    : u.role === 'admin'
                                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover/row:bg-purple-500/20'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover/row:bg-emerald-500/20'
                            )}>
                                {u.role}
                            </Badge>
                        </AdminTableCell>
                        <AdminTableCell className="text-muted-foreground/60 font-black text-xs uppercase tracking-tighter">
                            {new Date(u.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </AdminTableCell>
                        <AdminTableCell className="text-right">
                            <div className="flex justify-end gap-3">
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={(e) => { e.stopPropagation(); handleEditUser(u); }}
                                    className="h-10 w-10 rounded-xl hover:bg-primary/10 border border-white/5 group/btn"
                                >
                                    <ShieldCheck className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.id); }}
                                    disabled={u.role === 'admin'}
                                    className="h-10 w-10 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-transparent hover:border-destructive/20 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </AdminTableCell>
                    </AdminTableRow>
                ))}
            </AdminTable>
        </div>
    )
}

