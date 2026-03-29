"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import type { Session, AuthChangeEvent } from "@supabase/supabase-js"

type UserRole = "user" | "company" | "admin"

interface User {
    id: string
    name: string
    email: string
    role: UserRole
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    register: (name: string, email: string, password: string, role: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Listen to Supabase auth state changes on mount
    useEffect(() => {
        // Check existing session
        supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
            if (session?.user) {
                const role = (session.user.user_metadata?.role as UserRole) || "user"
                setUser({
                    id: session.user.id,
                    name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
                    email: session.user.email || "",
                    role,
                })
            }
            setIsLoading(false)
        })

        // Subscribe to auth changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            if (session?.user) {
                const role = (session.user.user_metadata?.role as UserRole) || "user"
                setUser({
                    id: session.user.id,
                    name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
                    email: session.user.email || "",
                    role,
                })
            } else {
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setIsLoading(false)
            toast.error(error.message)
            throw error
        }

        if (data.user) {
            const role = (data.user.user_metadata?.role as UserRole) || "user"
            const u: User = {
                id: data.user.id,
                name: data.user.user_metadata?.full_name || email.split("@")[0],
                email,
                role,
            }
            setUser(u)
            toast.success(`Welcome back, ${u.name}!`)

            if (role === "admin") router.push("/admin/dashboard")
            else if (role === "company") router.push("/company/dashboard")
            else router.push("/user/dashboard")
        }
        setIsLoading(false)
    }

    const register = async (name: string, email: string, password: string, role: UserRole) => {
        setIsLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    role: role,
                }
            }
        })

        if (error) {
            setIsLoading(false)
            toast.error(error.message)
            throw error
        }

        if (data.user) {
            setUser({
                id: data.user.id,
                name,
                email,
                role,
            })
            toast.success("Account created successfully! Check your email to confirm.")

            if (role === "company") router.push("/company/dashboard")
            else router.push("/user/dashboard")
        }
        setIsLoading(false)
    }

    const logout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        toast.info("Logged out successfully")
        router.push("/auth/login")
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
