"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle2 } from "lucide-react"

export function FileUploader({ onUploadComplete }: { onUploadComplete?: (url: string) => void }) {
    const [isUploaded, setIsUploaded] = useState(false)

    const handleSimulatedUpload = () => {
        setIsUploaded(true)
        if (onUploadComplete) onUploadComplete("https://example.com/resume.pdf")
    }

    return (
        <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center bg-white/[0.02]">
            {isUploaded ? (
                <div className="space-y-4 animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <p className="text-sm font-bold">Resume Synthesized Successfully</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-white/20" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-bold">Drag and drop your technical resume</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">PDF or DOCX (Max 10MB)</p>
                    </div>
                    <Button 
                        onClick={handleSimulatedUpload}
                        className="font-black uppercase tracking-widest text-[10px] px-8"
                    >
                        Select Artifacts
                    </Button>
                </div>
            )}
        </div>
    )
}
