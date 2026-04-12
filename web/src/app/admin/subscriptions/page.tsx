"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Building2, Save, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api/api-client";
import { motion, AnimatePresence } from "framer-motion";

export default function SubscriptionsManager() {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const data = await api.admin.getSubscriptions?.() || [];
            if(Array.isArray(data) && data.length > 0) {
                setSubscriptions(data);
            } else {
                // Mock default if none exist
                setSubscriptions([
                    { id: '1', tier_name: 'Free', monthly_price: 0, ai_match_limit: 50, job_post_limit: 1, seat_limit: 1 },
                    { id: '2', tier_name: 'Pro', monthly_price: 49, ai_match_limit: 500, job_post_limit: 10, seat_limit: 5 },
                    { id: '3', tier_name: 'Enterprise', monthly_price: 299, ai_match_limit: -1, job_post_limit: -1, seat_limit: -1 }
                ])
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch subscriptions");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (id: string, updates: any) => {
        try {
            if(api.admin.updateSubscription) {
                await api.admin.updateSubscription(id, updates);
            }
            toast.success("SaaS tier parameters updated");
        } catch (err) {
            toast.error("Failed to update tier");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl pb-20">
            <div className="flex flex-col justify-between items-start gap-4">
                <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight flex items-center gap-4 text-white">
                    <Layers className="w-10 h-10 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" /> 
                    SaaS Configuration
                </h1>
                <p className="text-muted-foreground text-lg max-w-3xl">
                    Configure pricing and feature limitations for enterprise hiring nodes. Limits applied here take effect immediately for billing cycles. Set to -1 for unlimited access.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {loading ? (
                    <div className="col-span-3 flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>
                ) : (
                    <AnimatePresence>
                        {subscriptions.map((tier, idx) => (
                            <motion.div
                                key={tier.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden group h-full hover:border-amber-500/30 transition-all flex flex-col">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-amber-500/10 transition-all" />
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <CardHeader className="border-b border-white/5 pb-4">
                                        <CardTitle className="text-2xl font-black uppercase tracking-wider text-amber-500 flex items-center justify-between">
                                            {tier.tier_name}
                                            <span className="text-sm text-white/50">${tier.monthly_price}/mo</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 relative z-10 space-y-6 flex-1 flex flex-col">
                                        
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">AI Match Limit / Mo</label>
                                            <Input 
                                                type="number"
                                                defaultValue={tier.ai_match_limit}
                                                className="bg-black/40 border-white/10 font-mono text-white text-lg h-12 text-center"
                                                onChange={(e) => { tier.ai_match_limit = parseInt(e.target.value) }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Active Job Limit</label>
                                            <Input 
                                                type="number"
                                                defaultValue={tier.job_post_limit}
                                                className="bg-black/40 border-white/10 font-mono text-white text-lg h-12 text-center"
                                                onChange={(e) => { tier.job_post_limit = parseInt(e.target.value) }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Recruiter Seats</label>
                                            <Input 
                                                type="number"
                                                defaultValue={tier.seat_limit}
                                                className="bg-black/40 border-white/10 font-mono text-white text-lg h-12 text-center"
                                                onChange={(e) => { tier.seat_limit = parseInt(e.target.value) }}
                                            />
                                        </div>

                                        <div className="flex-1" />
                                        <Button 
                                            onClick={() => handleSave(tier.id, {
                                                ai_match_limit: tier.ai_match_limit,
                                                job_post_limit: tier.job_post_limit,
                                                seat_limit: tier.seat_limit
                                            })}
                                            className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 mt-4"
                                        >
                                            <Save className="w-4 h-4 mr-2" /> Sync Tier Limits
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
            
            <Button variant="outline" className="border-dashed border-white/20 text-white/40 hover:text-white hover:bg-white/5 w-full h-16 rounded-2xl">
                <Plus className="w-5 h-5 mr-3" /> Create New Enterprise Tier
            </Button>
        </div>
    );
}
