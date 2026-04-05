"use client"

import { useState } from "react"
import { motion } from "react-router-dom"
import { Search, Filter, UserX, ShieldAlert, MoreVertical, ShieldCheck } from "lucide-react"
import { AdminTable } from "@/features/admin/admin-table"
import { EditUserModal } from "@/features/admin/edit-user-modal"

export default function StaffUserModeration() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)

    const handleEdit = (user: any) => {
        setSelectedUser(user)
        setIsEditModalOpen(true)
    }

    return (
        <div className="space-y-12 pb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 backdrop-blur-md shadow-lg shadow-red-500/5">
                            <UserX className="w-6 h-6 text-red-400" />
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400/70 mb-1">Enforcement</p>
                            <h1 className="text-5xl font-black font-heading tracking-tighter text-white">
                                User Moderation
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by wallet label or handle..." 
                            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all w-[300px] backdrop-blur-md"
                        />
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="bg-black/20 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
                <AdminTable 
                    onEdit={handleEdit}
                    columns={[
                        { label: "Talent", key: "full_name" },
                        { label: "Status", key: "status" },
                        { label: "Reputation", key: "reputation_score" },
                        { label: "Joined", key: "created_at" }
                    ]}
                />
            </div>

            {selectedUser && (
                <EditUserModal 
                    user={selectedUser}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </div>
    )
}
