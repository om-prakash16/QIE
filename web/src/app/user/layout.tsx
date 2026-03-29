"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/context/auth-context"
import { redirect } from "next/navigation"
import { Footer } from "@/components/layout/footer"

export default function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()

    // ... auth checks ...

    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar role="user" className="hidden lg:flex" />
            <main className="flex-1 w-full pt-16">
                <div className="container mx-auto p-8 max-w-6xl min-h-[calc(100vh-200px)]">
                    {children}
                </div>
                <Footer forceVisible />
            </main>
        </div>
    )
}
