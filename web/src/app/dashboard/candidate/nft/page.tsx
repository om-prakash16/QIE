"use client"
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShieldAlert, Cpu, Trophy, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DynamicSkillNFTDashboard() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState("Bronze");
  
  const handleSimulateAssessment = async () => {
    setLoading(true);
    try {
        const response = await fetch("http://localhost:8000/api/v1/nft/update-skill-nft", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                wallet_address: publicKey ? publicKey.toBase58() : "mock_wallet",
                github_link: "https://github.com/om-prakash16/Skillsutra",
                quiz_score: 95
            })
        });
        const data = await response.json();
        
        // Mock the logic to update Solana IPFS mapping after Python generates it
        setTimeout(() => {
            setLevel(data.metadata.attributes[0].value);
            setLoading(false);
        }, 1500);

    } catch (err) {
        console.error(err);
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 mt-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <h1 className="text-4xl font-bold font-heading flex items-center gap-2">
                <Trophy className="w-8 h-8 text-primary"/> Soulbound Skill NFTs 
            </h1>
            <p className="text-muted-foreground mt-2">Dynamic Web3 certificates that evolve via AI milestones.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            
            {/* 3D NFT Visual representation */}
            <motion.div 
                animate={{ rotateY: level === "Silver" ? 360 : 0 }}
                transition={{ duration: 1.5 }}
                className={`relative h-64 border-2 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${
                    level === "Bronze" ? "border-amber-700 bg-amber-700/5 shadow-amber-700/20" : 
                    "border-slate-300 bg-slate-300/10 shadow-slate-300/20"
                }`}
            >
                <div className="text-center space-y-2">
                    <ShieldAlert className={`w-20 h-20 mx-auto ${level === "Bronze" ? "text-amber-700" : "text-slate-300"}`} />
                    <h2 className="text-2xl font-bold font-heading">Level 1: {level}</h2>
                    <p className="text-xs tracking-wider opacity-60">ID: QmHash...{level}</p>
                </div>
            </motion.div>

            {/* Assessment UI */}
            <div className="p-6 border rounded-xl shadow-sm space-y-4 flex flex-col justify-center">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Cpu className="w-5 h-5"/> AI Assessor Node
                </h3>
                <p className="text-sm text-muted-foreground">
                    Connect your GitHub Repository and take algorithmic quizzes to evolve your Solana NFT metadata automatically.
                </p>
                
                <div className="pt-4">
                    <Button 
                        disabled={loading || level === "Silver"} 
                        onClick={handleSimulateAssessment} 
                        className="w-full font-semibold shadow-sm transition-transform active:scale-95"
                    >
                        {loading ? "Analyzing Github Commits..." : level === "Bronze" ? "Trigger API: Evolve to Silver" : "Max Level Reached"}
                        {!loading && level === "Bronze" && <ArrowUpRight className="ml-2 w-4 h-4"/>}
                    </Button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
