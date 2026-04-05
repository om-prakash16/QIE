"use client"
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Lock } from "lucide-react";

export default function EscrowButton({ amount, bountyId }: { amount: number, bountyId: string }) {
    const { publicKey, connected } = useWallet();
    const [loading, setLoading] = useState(false);

    const handleCreateEscrow = async () => {
        if (!connected) {
            alert("Connect your wallet to lock funds in Escrow.");
            return;
        }
        
        setLoading(true);
        try {
            // Placeholder: Here we would trigger the Solana Anchor Program CPI.
            // Example workflow:
            // const tx = await program.methods.createBounty(new BN(amount * LAMPORTS_PER_SOL), bountyId)
            //   .accounts({ employer: publicKey, bounty: bountyPDA })
            //   .rpc();
            
            setTimeout(() => {
                alert(`Successfully locked ${amount} SOL in Escrow Vault for Bounty [${bountyId}]`);
                setLoading(false);
            }, 1000);
            
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleCreateEscrow} disabled={loading || !connected} className="w-full flex gap-2">
            <Lock className="w-4 h-4" /> {loading ? "Locking Funds..." : `Escrow ${amount} SOL`}
        </Button>
    )
}
