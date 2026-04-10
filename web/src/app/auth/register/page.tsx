"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { RoleSelector } from "@/components/auth/role-selector"
import Link from "next/link"
import { Briefcase, Loader2, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function RegisterPage() {
    const { walletLogin, demoLogin } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState("user")

    async function handleRegister() {
        setIsLoading(true)
        try {
            await walletLogin(selectedRole)
        } catch {
            // Error managed by context
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-border/50 shadow-2xl backdrop-blur-xl bg-background/95 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
            
            <CardHeader className="space-y-2 items-center text-center pb-8 border-b border-border/50">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
                    <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-black font-heading tracking-tight italic">Initialize Identity</CardTitle>
                <CardDescription className="max-w-[280px]">
                    Select your organizational role and securely anchor your profile to the Solana network.
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-8 space-y-8">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Identity Selection</label>
                    <RoleSelector value={selectedRole} onChange={setSelectedRole} />
                </div>

                <div className="space-y-4">
                    <Button 
                        className="w-full h-14 text-lg font-black bg-white text-black hover:bg-neutral-200 transition-all rounded-2xl gap-3 shadow-[0_8px_30px_rgb(255,255,255,0.1)] group-hover:shadow-[0_8px_30px_rgb(255,255,255,0.2)]" 
                        onClick={handleRegister} 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                REGISTER WITH WALLET 
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                    
                    <button 
                        type="button"
                        onClick={() => demoLogin(selectedRole)}
                        className="w-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest py-2"
                    >
                        Demo Mode: Skip Wallet Check
                    </button>

                    <p className="text-[10px] text-center text-muted-foreground/60 px-4">
                        By registering, you are anchoring your cryptographic identity to Best Hiring Tool protocols.
                    </p>
                </div>
            </CardContent>

            <CardFooter className="justify-center text-sm text-muted-foreground border-t border-border/50 bg-white/[0.02] py-4">
                Already have an identity? <Link href="/auth/login" className="text-primary hover:underline ml-1 font-bold">Log in</Link>
            </CardFooter>
        </Card>
    )
}
