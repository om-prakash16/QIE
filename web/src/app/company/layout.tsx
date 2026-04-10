"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function CompanyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/auth/login")
            } else if (user.role !== "company") {
                router.push("/user/dashboard")
            }
        }
    }, [user, isLoading, router])

    if (isLoading || !user || user.role !== "company") {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar role="company" className="hidden lg:flex" />
            <main className="flex-1 w-full pt-16">
                <div className="container mx-auto p-4 md:p-8 max-w-7xl w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
