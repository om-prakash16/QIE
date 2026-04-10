"use client";

import { useAuth } from "@/context/auth-context";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ship, Loader2, ArrowRight, Building2, Plus, Users, Shield } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateCompany() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!name) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("sp_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/company/create`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ name })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Organization created! It is now pending administrator approval.");
        router.push(`/dashboard/company/team?id=${data.company_id}`);
      } else {
        throw new Error(data.detail || "Failed to create company");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 space-y-12">
      <div className="text-center space-y-4">
         <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-2">
            <Building2 className="w-10 h-10 text-primary" />
         </div>
         <h1 className="text-5xl font-black font-heading tracking-tight italic">Scale Your Organization</h1>
         <p className="text-muted-foreground max-w-xl mx-auto">Initialize an enterprise workspace on Best Hiring Tool to hire and verify talent with on-chain reputation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
         <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10 overflow-hidden relative">
            <CardHeader className="space-y-4">
                <CardTitle className="text-2xl font-black">Workspace Identity</CardTitle>
                <CardDescription>Enter your official entity name as it will appear on job listings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Input 
                    placeholder="e.g. Best Hiring Tool Labs" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-transparent border-white/10 h-14 text-lg font-bold"
                />
                <Button 
                    onClick={handleCreate} 
                    disabled={isLoading || !name}
                    className="w-full h-14 text-lg font-black bg-white text-black hover:bg-neutral-200"
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Plus className="w-5 h-5 mr-1" /> CREATE ORGANIZATION <ArrowRight className="w-5 h-5 ml-2" /></>}
                </Button>
            </CardContent>
         </Card>

         <div className="space-y-6">
            <div className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
                <div className="p-3 h-fit rounded-xl bg-primary/10 border border-primary/20">
                    <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-black text-white">Multi-Tenant Team</h3>
                    <p className="text-sm text-neutral-400">Invite up to 10 colleagues to your organization and assign HR or Interviewer roles.</p>
                </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
                <div className="p-3 h-fit rounded-xl bg-primary/10 border border-primary/20">
                    <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-black text-white">Verified Badge</h3>
                    <p className="text-sm text-neutral-400">Unlock the 'Verified Recruiter' badge to increase application quality by 40%.</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
