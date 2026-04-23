"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import type { Session } from "@supabase/supabase-js"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

type UserRole = "user" | "company" | "admin"

interface User {
    id: string
    name: string
    email: string
    role: UserRole
    wallet_address: string
    profile_data: any
    dynamic_profile_data?: any
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    walletLogin: (role?: string) => Promise<void>
    demoLogin: (role?: string) => Promise<void>
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Hydrate user state from an active Supabase session on mount.
    // Also subscribes to auth state changes for SSO / magic link flows.
    useEffect(() => {
        const hydrateUser = async (session: Session) => {
            const metaRole = (session.user.user_metadata?.role as UserRole) || "user"

            const { data: profile } = await supabase
                .from("users")
                .select("role, full_name, wallet_address, profile_data, dynamic_profile_data")
                .eq("id", session.user.id)
                .single()

            const role = (profile?.role as UserRole) || metaRole
            const name =
                profile?.full_name ||
                session.user.user_metadata?.full_name ||
                session.user.email?.split("@")[0] ||
                "User"

            setUser({
                id: session.user.id,
                name,
                email: session.user.email || "",
                role,
                wallet_address: profile?.wallet_address || "",
                profile_data: profile?.profile_data || {},
                dynamic_profile_data: profile?.dynamic_profile_data || {},
            })
            setIsLoading(false)
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                hydrateUser(session)
            } else {
                setIsLoading(false)
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                hydrateUser(session)
            } else {
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    // Also check for our custom JWT in localStorage (wallet auth path).
    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token")
        if (storedToken) setToken(storedToken)
        setIsLoading(false)
    }, [])

    const { publicKey, signMessage, connected, disconnect } = useWallet()
    const { setVisible } = useWalletModal()

    const walletLogin = async (role = "user") => {
        // If no wallet is connected, open the selection modal rather than
        // throwing an error — much better UX for first-time users.
        if (!publicKey || !signMessage) {
            setVisible(true)
            return
        }

        setIsLoading(true)
        try {
            const address = publicKey.toBase58()
            const message = `Sign in to Best Hiring Tool\n\nWallet: ${address}\nTime: ${Date.now()}`
            const signature = await signMessage(new TextEncoder().encode(message))
            const sigHex = Array.from(signature)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_address: address,
                    message,
                    signature: sigHex,
                    requested_role: role,
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || "Authentication failed")

            localStorage.setItem("auth_token", data.access_token)
            document.cookie = `auth_token=${data.access_token}; path=/; max-age=86400`
            setToken(data.access_token)
            
            setUser({
                id: "wallet-user",
                name: `${address.slice(0, 4)}...${address.slice(-4)}`,
                email: "",
                role: data.role as UserRole,
                wallet_address: address,
                profile_data: {},
            })

            toast.success("Signed in")
            
            const normalizedRole = (data.role || role).toLowerCase()
            if (normalizedRole === "admin") {
                router.push("/admin/profile")
            } else if (normalizedRole === "company") {
                router.push("/company/profile")
            } else {
                router.push("/user/profile")
            }
        } catch (err: any) {
            console.error("[auth] wallet login failed:", err)
            toast.error(err.message || "Sign in failed")
        } finally {
            setIsLoading(false)
        }
    }

    const demoLogin = async (role = "user") => {
        setIsLoading(true)
        try {
            // Check if we have a saved mock wallet for this specific role,
            // otherwise generate a unique one. This ensures identities don't mix.
            const storageKey = `sp_demo_wallet_${role.toLowerCase()}`
            let mockWallet = localStorage.getItem(storageKey)
            if (!mockWallet) {
                const randomId = Math.random().toString(36).substring(2, 6)
                mockWallet = `DEV_${role.toUpperCase()}_${randomId}`
                localStorage.setItem(storageKey, mockWallet)
            }

            const message = `Sign in to Best Hiring Tool (DEMO MODE)\n\nRole: ${role}\nWallet: ${mockWallet}\nTime: ${Date.now()}`
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_address: mockWallet,
                    message,
                    signature: "MOCK_DEMO_SIGNATURE",
                    requested_role: role,
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || "Authentication failed")

            localStorage.setItem("auth_token", data.access_token)
            document.cookie = `auth_token=${data.access_token}; path=/; max-age=86400`
            setToken(data.access_token)
            
            setUser({
                id: "demo-user",
                name: `Demo User (${mockWallet.slice(4)})`,
                email: "",
                role: data.role as UserRole,
                wallet_address: mockWallet,
                profile_data: {},
            })

            toast.success("Signed in (Demo Mode)")
            
            const normalizedRole = (data.role || role).toLowerCase()
            if (normalizedRole === "admin") {
                router.push("/admin/profile")
            } else if (normalizedRole === "company") {
                router.push("/company/profile")
            } else {
                router.push("/user/profile")
            }
        } catch (err: any) {
            console.error("[auth] demo login failed:", err)
            toast.error(err.message || "Sign in failed")
        } finally {
            setIsLoading(false)
        }
    }
    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
            if (!data.session) throw new Error("Login failed")

            // Store token for fetchWithAuth compatibility
            localStorage.setItem("auth_token", data.session.access_token)
            setToken(data.session.access_token)

            const metaRole = (data.user?.user_metadata?.role as string)?.toLowerCase() || "user"
            
            toast.success("Welcome back!")
            if (metaRole === "admin") {
                router.push("/admin/profile")
            } else if (metaRole === "company") {
                router.push("/company/profile")
            } else {
                router.push("/user/profile")
            }
        } catch (err: any) {
            console.error("[auth] login failed:", err)
            toast.error(err.message || "Login failed")
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        localStorage.removeItem("auth_token")
        setToken(null)
        setUser(null)
        await supabase.auth.signOut()
        if (connected) await disconnect()
        toast.info("Signed out")
        router.push("/auth/login")
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoading, walletLogin, demoLogin, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
    return ctx
}
