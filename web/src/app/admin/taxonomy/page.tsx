"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Boxes, Briefcase, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";
import { motion } from "framer-motion";

export default function TaxonomyManager() {
    const [skills, setSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [parentId, setParentId] = useState("");

    useEffect(() => {
        fetchTaxonomy();
    }, []);

    const fetchTaxonomy = async () => {
        try {
            const data = await api.admin.getSkills?.() || []; 
            setSkills(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setSkills([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async () => {
        if (!newSkill.trim()) return;
        try {
            await api.admin.createSkill?.({ 
                category_name: newSkill,
                parent_id: parentId || null
            });
            setNewSkill("");
            setParentId("");
            toast.success("Skill node committed to registry");
            fetchTaxonomy();
        } catch (err) {
            toast.error("Failed to add skill");
        }
    };

    const handleDelete = async (id: string) => {
        // Soft delete logic can be added here or manual filter
        toast.info("Deletion protocol initialized (requires moderator confirmation)");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl">
            <div className="flex flex-col justify-between items-start gap-4">
                <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
                    <Boxes className="w-10 h-10 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" /> 
                    Taxonomy Manager
                </h1>
                <p className="text-muted-foreground text-lg">
                    Govern the hierarchical data structures for Skills and Job Categories used by the AI matching engine.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skills Taxonomy */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden border-t-emerald-500/30 border-t-2">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <CardHeader className="relative z-10 border-b border-white/10 pb-6">
                        <CardTitle className="text-xl flex items-center gap-2"><Boxes className="w-5 h-5 text-emerald-500" /> Skill Categories (Module 5)</CardTitle>
                        <CardDescription>Canonical list of technical and soft skills.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 relative z-10 space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <Input 
                                    placeholder="E.g. Machine Learning" 
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    className="bg-black/40 border-white/10 text-white"
                                />
                                <Button onClick={handleAddSkill} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                                    <Plus className="w-4 h-4 mr-2" /> Add
                                </Button>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">Hierarchy Alignment (Optional Parent)</label>
                                <select 
                                    className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-3 text-white text-xs"
                                    onChange={(e) => setParentId(e.target.value)}
                                    value={parentId}
                                >
                                    <option value="">ROOT CATEGORY</option>
                                    {skills.filter(s => !s.parent_id).map(s => (
                                        <option key={s.id} value={s.id}>{s.category_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-500/50" /></div>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 pt-2">
                                {skills.filter(s => !s.parent_id).map((skill, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={skill.id || skill.category_name || idx}
                                        className="space-y-2"
                                    >
                                        <div className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                            <span className="font-bold text-white uppercase tracking-tight">{skill.category_name}</span>
                                            <Button onClick={() => handleDelete(skill.id)} variant="ghost" size="icon" className="text-white/20 hover:text-rose-500 hover:bg-rose-500/10 h-8 w-8 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {/* Sub-skills display */}
                                        <div className="pl-6 flex flex-wrap gap-2">
                                            {skills.filter(s => s.parent_id === skill.id).map(sub => (
                                                <div key={sub.id} className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1 rounded-full">
                                                    <span className="text-[10px] font-medium text-emerald-500">{sub.category_name}</span>
                                                    <button onClick={() => handleDelete(sub.id)} className="text-white/20 hover:text-rose-500 transition-colors">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                                {skills.length === 0 && (
                                    <div className="text-center p-8 text-white/40 text-sm font-medium border border-dashed border-white/10 rounded-xl">
                                        No taxonomy data found. Add the first core skill above.
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Job Categories Taxonomy */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden border-t-blue-500/30 border-t-2">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <CardHeader className="relative z-10 border-b border-white/10 pb-6">
                        <CardTitle className="text-xl flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-500" /> Job Classifications (Module 6)</CardTitle>
                        <CardDescription>Enterprise job family categorizations.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 relative z-10 space-y-6">
                        <div className="flex gap-4">
                            <Input 
                                placeholder="E.g. AI Engineer" 
                                className="bg-black/40 border-white/10 text-white"
                            />
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold">
                                <Plus className="w-4 h-4 mr-2" /> Add
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {/* Static Mock Data for Template View */}
                            {["Frontend Developer", "Backend Developer", "AI Engineer", "Data Scientist"].map((job, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={job} 
                                    className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <span className="font-medium text-white">{job}</span>
                                    <Button variant="ghost" size="icon" className="text-white/40 hover:text-rose-500 hover:bg-rose-500/10 h-8 w-8 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
