"use client"

import { Button } from "@/components/ui/button"

export default function EscrowButton({ bountyId }: { bountyId?: string }) {
    return (
        <Button 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-[10px]"
            onClick={() => alert("Escrow verification pending for current dev cycle.")}
        >
            Initialize Escrow
        </Button>
    )
}
