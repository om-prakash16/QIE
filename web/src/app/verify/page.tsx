"use client"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, FileText, CheckCircle, Loader2, ArrowRight, ShieldCheck, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAuth } from "@/context/auth-context"

interface ParsedData {
    skills: string[]
    experience_years: number
    roles: string[]
    education: string[]
}

export default function VerifyPage() {
    const { connected, publicKey } = useWallet()
    const { user } = useAuth()
    
    const [file, setFile] = useState<File | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [parsedData, setParsedData] = useState<ParsedData | null>(null)
    const [isMinting, setIsMinting] = useState(false)
    const [minted, setMinted] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0]
            if (selected.type !== "application/pdf") {
                toast.error("Please explicitly upload a PDF file.")
                return
            }
            setFile(selected)
            setParsedData(null) // reset previous if any
        }
    }

    const handleAnalyze = async () => {
        if (!file) {
            toast.error("Please upload a file first.")
            return
        }

        setIsAnalyzing(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            // Using placeholder localhost for hackathon MVP. 
            const response = await fetch("http://localhost:8000/api/v1/ai/analyze-resume", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.detail || "Failed to analyze resume")
            }

            const data = await response.json()
            if (data.status === "mock") {
                toast.info("Using mock AI data (OpenAI Key not set in backend).")
            } else {
                toast.success("Resume parsed successfully using AI Oracle!")
            }
            setParsedData(data.parsed_data)
        } catch (error: any) {
            console.error("Analysis error:", error)
            toast.error(error.message || "A server error occurred.")
            // Fallback for demo purposes if backend isn't running
            setParsedData({
                skills: ["React", "Rust", "Solana", "TypeScript", "Node.js (Fallback)"],
                experience_years: 4,
                roles: ["Frontend Engineer", "Smart Contract Developer"],
                education: ["B.Sc. Computer Science"]
            })
            toast.info("Applied fallback mock data for testing UI.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleMint = async () => {
        if (!connected || !publicKey) {
            toast.error("Please connect your Solana wallet first!")
            return
        }
        setIsMinting(true)
        
        // Simulating the Anchor smart contract interaction
        // Expected flow: backend signs -> frontend confirms -> broadcast to network
        setTimeout(() => {
            setIsMinting(false)
            setMinted(true)
            toast.success("Profile SBT Minted successfully to your wallet!")
        }, 3000)
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 flex flex-col items-center relative overflow-hidden bg-[#020617] text-white">
            <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="text-center max-w-2xl mb-12 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                    <Cpu className="w-4 h-4" /> Waitless Verification
                </div>
                <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-4">
                    Prove Your Potential
                </h1>
                <p className="text-muted-foreground text-lg">
                    Upload your standard resume. Our AI Engine extracts the cryptographic proof we need to mint your verified Profile NFT.
                </p>
            </div>

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 relative z-10">
                {/* Upload Section */}
                <motion.div 
                    className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {!file ? (
                        <label className="cursor-pointer flex flex-col items-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <UploadCloud className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Upload Resume</h3>
                            <p className="text-sm text-muted-foreground mb-6">PDF max 5MB</p>
                            <Button variant="outline" className="pointer-events-none relative z-10">Browse Files</Button>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />
                        </label>
                    ) : (
                        <div className="flex flex-col items-center w-full">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 text-blue-400">
                                <FileText className="w-8 h-8" />
                            </div>
                            <p className="font-medium text-sm truncate w-full max-w-[200px] mb-6">{file.name}</p>
                            
                            <Button 
                                onClick={handleAnalyze} 
                                disabled={isAnalyzing}
                                className="w-full relative z-10"
                            >
                                {isAnalyzing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deep Scanning...</>
                                ) : (
                                    <>Initiate AI Scan <ArrowRight className="ml-2 w-4 h-4" /></>
                                )}
                            </Button>
                            
                            <button 
                                onClick={() => { setFile(null); setParsedData(null); }}
                                className="text-xs text-muted-foreground mt-4 hover:text-white"
                            >
                                Remove File
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Results Section */}
                <motion.div 
                    className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {!parsedData ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <Cpu className="w-12 h-12 mb-4" />
                            <p>Awaiting Neural Input</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                <h3 className="text-lg font-bold">Verified Extraction</h3>
                            </div>
                            
                            <div className="flex-1 space-y-6">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Detected Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {parsedData.skills.map((skill, i) => (
                                            <span key={i} className="px-2 py-1 text-xs rounded-md bg-primary/20 text-primary border border-primary/30">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Experience</p>
                                        <p className="font-medium">{parsedData.experience_years} Years</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Roles</p>
                                        <p className="font-medium text-sm">{parsedData.roles.join(", ")}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Education</p>
                                    <p className="font-medium text-sm text-blue-300">{parsedData.education.join(", ")}</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <AnimatePresence mode="wait">
                                    {minted ? (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="w-full py-3 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 font-bold"
                                        >
                                            <CheckCircle className="w-5 h-5" /> Secured On-Chain
                                        </motion.div>
                                    ) : (
                                        <Button 
                                            onClick={handleMint}
                                            disabled={isMinting}
                                            className="w-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                        >
                                            {isMinting ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Awaiting Network Signature...</>
                                            ) : (
                                                'Mint Profile Record (SBT)'
                                            )}
                                        </Button>
                                    )}
                                </AnimatePresence>
                                {!connected && !minted && (
                                    <p className="text-xs text-destructive mt-2 text-center">Wallet not connected. Connection required to mint.</p>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
