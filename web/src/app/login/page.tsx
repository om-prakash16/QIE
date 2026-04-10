"use client";

import { useAuth } from "@/context/auth-context";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Wallet, ArrowRight, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function LoginPage() {
  const { walletLogin, isLoading, user } = useAuth();
  const { connected, publicKey } = useWallet();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1a1a1a,transparent_70%)] opacity-50" />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8 space-y-2">
           <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
           </div>
           <h1 className="text-4xl font-black tracking-tighter text-white">Best Hiring Tool</h1>
           <p className="text-muted-foreground">The future of verified talent on Solana.</p>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">Identity Verification</CardTitle>
            <CardDescription className="text-center italic">Sign a secure message with your wallet to prove ownership.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
               <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-xl !h-12 !px-8 !font-bold transition-all" />
            </div>

            {connected ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                        <p className="text-xs text-primary font-black uppercase tracking-widest mb-1">Authenticated Wallet</p>
                        <p className="text-sm font-mono text-white truncate">{publicKey?.toBase58()}</p>
                    </div>
                    <Button 
                        onClick={walletLogin} 
                        disabled={isLoading}
                        className="w-full h-12 text-lg font-black bg-white text-black hover:bg-neutral-200"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <><Wallet className="w-5 h-5 mr-2" /> SIGN & LOGIN <ArrowRight className="w-5 h-5 ml-2" /></>}
                    </Button>
                </div>
            ) : (
                <div className="text-center p-8 space-y-4">
                    <p className="text-sm text-neutral-500 italic">Please connect a supported Solana wallet to continue.</p>
                </div>
            )}
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-neutral-600">
            By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span>.
            <br />
            No passwords. No intermediaries. Pure Proof.
        </p>
      </div>
    </div>
  );
}
