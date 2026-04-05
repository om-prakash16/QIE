"use client"
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";

export default function RecruiterDashboard() {
  const { publicKey, connected } = useWallet();

  const handlePostJob = async () => {
    if (!connected) {
      alert("Please connect your wallet first.");
      return;
    }
    // Simulation mapping to our FastAPI match engine
    alert("Triggering Anchor contract to create Job PDA for: " + publicKey?.toBase58());
  };

  return (
    <div className="container mx-auto py-12 px-4 mt-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold font-heading">Recruiter Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Web3 AI Talent platform. Manage your job postings here.</p>
        
        <div className="p-8 border rounded-xl shadow-sm space-y-4">
          <h2 className="text-2xl font-semibold">Post a new position</h2>
          <p className="text-sm">Requirements will be matched automatically by RecruitAuto AI.</p>
          <div className="flex gap-4">
              <Button onClick={handlePostJob} size="lg" className="font-semibold shadow-sm transition-transform active:scale-95">
                Deploy Job to Solana
              </Button>
          </div>
        </div>

        <div className="p-8 border rounded-xl shadow-sm bg-muted/20">
            <h3 className="text-xl font-semibold mb-4">Active Applicants (AI Ranked)</h3>
            <p className="text-sm text-muted-foreground">Awaiting candidate submissions...</p>
        </div>
      </div>
    </div>
  );
}
