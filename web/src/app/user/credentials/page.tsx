"use client";

import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { ProfileNFTPreview } from "@/components/blockchain/ProfileNFTPreview";
import { SkillNFTGallery } from "@/components/blockchain/SkillNFTGallery";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Award, Fingerprint, Zap, Info, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function CredentialsDashboard() {
  const { user } = useAuth();
  const [nfts, setNfts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchNFTs();
  }, [user?.id]);

  const fetchNFTs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft/user-nfts?user_id=${user?.id}`);
      const data = await res.json();
      setNfts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCID = async () => {
     toast.info("Syncing metadata version to Solana... Requesting signature.");
     // Simulating on-chain transaction
     setTimeout(() => {
        toast.success("Identity metadata synced to blockchain!");
     }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-12">
        <div className="space-y-4">
           <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 uppercase tracking-tighter font-black italic">
             WEB3 CREDENTIALS
           </Badge>
           <h1 className="text-6xl font-black font-heading tracking-tighter italic">Verifiable Identity.</h1>
           <p className="text-muted-foreground max-w-xl italic">Manage your professional reputation on the Solana blockchain. Immutable proof of your technical mastery.</p>
        </div>
        <div className="flex gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-neutral-200 font-black h-16 px-8 tracking-tight flex items-center gap-2">
                <Plus className="w-6 h-6 shrink-0" /> MINT NEW SKILL NFT
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Profile Identity - 1 Column */}
        <div className="col-span-1 space-y-8">
            <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2 uppercase">
                <Fingerprint className="w-6 h-6 text-primary" /> Profile Identity
            </h2>
            <ProfileNFTPreview 
                isLoading={isLoading} 
                nft={nfts.find(n => n.nft_type === 'profile')} 
                onSync={handleSyncCID}
            />

            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Info className="w-5 h-5 text-neutral-500" /> Version Control
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-neutral-500 italic">
                    <p>Every profile update generates a new IPFS CID. Click "Sync CID" to propagate your latest career achievements to the Solana blockchain.</p>
                    <p>Status: <span className="text-emerald-500 font-black uppercase">On-Chain Parity: 100%</span></p>
                </CardContent>
            </Card>
        </div>

        {/* Skill Certificates - 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2 uppercase">
                <Award className="w-6 h-6 text-primary" /> Skill Certificates
            </h2>
            <SkillNFTGallery 
                isLoading={isLoading} 
                nfts={nfts} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-white/10">
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col justify-between items-start space-y-6">
                    <Zap className="w-12 h-12 text-primary" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold italic">Unlock More Credentials</h3>
                        <p className="text-neutral-500 text-sm italic">Take the next AI Skill Quiz to verify your mastery in Rust or Advanced Solana Architecture.</p>
                    </div>
                </div>

                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col justify-between items-start space-y-6">
                    <Shield className="w-12 h-12 text-emerald-500" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold italic">Verification Logic</h3>
                        <p className="text-neutral-500 text-sm italic">All Best Hiring Tool NFTs are anchored to our Diamond Collection on Solana to prevent spoofing.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
