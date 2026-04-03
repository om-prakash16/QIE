"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import type { Session, AuthChangeEvent } from "@supabase/supabase-js"
import { useWallet } from "@solana/wallet-adapter-react"

type UserRole = "user" | "company" | "admin"

interface User {
    id: string
    name: string
    email: string
    role: UserRole
    wallet_address: string
    profile_data: any
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
        const fetchUserData = async (session: Session) => {
            // First get basic data from metadata
            const metaRole = (session.user.user_metadata?.role as UserRole) || "user"
            
            // Try to fetch real role from 'users' table
            const { data: profile } = await supabase
                .from('users')
                .select('role, full_name, wallet_address, profile_data')
                .eq('id', session.user.id)
                .single()


            const role = (profile?.role as UserRole) || metaRole
            const name = profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User"

            setUser({
                id: session.user.id,
                name,
                email: session.user.email || "",
                role,
                wallet_address: profile?.wallet_address || "",
                profile_data: profile?.profile_data || {},
            })
            setIsLoading(false)

        }

        // Check existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchUserData(session)
            } else {
                setIsLoading(false)
            }
        })

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchUserData(session)
            } else {
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const { publicKey, connected, disconnecting } = useWallet()

    // Sync wallet connection with Supabase Session
    useEffect(() => {
        const handleWalletAuth = async () => {
            if (connected && publicKey && !user && !isLoading) {
                // Wallet connected, but no user logged in. Let's auto-login or register.
                setIsLoading(true)
                const walletAddress = publicKey.toString()
                const pseudoEmail = `${walletAddress}@solana.local`
                const pseudoPassword = `SP-${walletAddress.substring(0, 10)}!Auth`

                try {
                    // Try to sign in first
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email: pseudoEmail,
                        password: pseudoPassword,
                    })

                    if (signInError) {
                        if (signInError.message.includes("Invalid login credentials") || signInError.status === 400) {
                            // Account doesn't exist, auto-register
                            toast.info("New wallet detected. Creating your verified canvas...")
                            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                                email: pseudoEmail,
                                password: pseudoPassword,
                                options: {
                                    data: {
                                        full_name: `User-${walletAddress.substring(0, 4)}`,
                                        role: "user", // Default to user, they can change to company later
                                    }
                                }
                            })

                            if (signUpError) throw signUpError

                            if (signUpData.user) {
                                // Create profile
                                await supabase.from('users').insert({
                                    id: signUpData.user.id,
                                    wallet_address: walletAddress,
                                    email: pseudoEmail,
                                    role: "user",
                                    full_name: `User-${walletAddress.substring(0, 4)}`,
                                })
                                toast.success("Wallet fully connected and verified!")
                                router.push("/user/dashboard")
                            }
                        } else {
                            throw signInError
                        }
                    } else if (signInData.user) {
                        toast.success("Wallet connected! Welcome back.")
                        const role = (signInData.user.user_metadata?.role as UserRole) || "user"
                        if (role === "admin") router.push("/admin/dashboard")
                        else if (role === "company") router.push("/company/dashboard")
                        else router.push("/user/dashboard")
                    }
                } catch (err: any) {
                    console.error("Wallet Auth Error:", err)
                    toast.error("Failed to authenticate wallet securely.")
                } finally {
                    setIsLoading(false)
                }
            } else if (disconnecting && user) {
                // Wallet disconnected, log out
                logout()
            }
        }

        handleWalletAuth()
    }, [connected, publicKey, disconnecting])

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })

            if (error) {
                if (error.message.includes("Email not confirmed")) {
                    toast.error("Please confirm your email before logging in. (Check your inbox/spam)")
                } else if (error.status === 429) {
                    toast.error("Rate limit exceeded. Please wait a few minutes before trying again.")
                } else {
                    toast.error(error.message)
                }
                setIsLoading(false)
                return
            }

            if (data.user) {
                const role = (data.user.user_metadata?.role as UserRole) || "user"
                const u: User = {
                    id: data.user.id,
                    name: data.user.user_metadata?.full_name || email.split("@")[0],
                    email,
                    role,
                    wallet_address: `pending-${data.user.id.substring(0, 8)}`,
                    profile_data: {},
                }
                setUser(u)

                toast.success(`Welcome back, ${u.name}!`)

                if (role === "admin") router.push("/admin/dashboard")
                else if (role === "company") router.push("/company/dashboard")
                else router.push("/user/dashboard")
            }
        } catch (err: any) {
            toast.error("An unexpected error occurred during login.")
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (name: string, email: string, password: string, role: UserRole) => {
        setIsLoading(true)
        try {
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
                if (error.status === 429) {
                    toast.error("Signup rate limit exceeded. Please try again after some time.")
                } else {
                    toast.error(error.message)
                }
                setIsLoading(false)
                return
            }

            if (data.user) {
                // Also create a profile in the 'users' table
                try {
                    const { error: profileError } = await supabase
                        .from('users')
                        .insert({
                            id: data.user.id,
                            full_name: name,
                            email: email,
                            role: role,
                            location: "Remote",
                            bio: `Hi, I am ${name}. Welcome to my profile!`,
                            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`,
                            skills: [],
                            experience: [],
                            education: [],
                            projects: [],
                            wallet_address: `pending-${data.user.id.substring(0, 8)}`
                        })
                    if (profileError) console.warn("Profile creation warning:", profileError.message)
                } catch (e) {
                    console.error("Failed to create profile record:", e)
                }

                setUser({
                    id: data.user.id,
                    name,
                    email,
                    role,
                    wallet_address: `pending-${data.user.id.substring(0, 8)}`,
                    profile_data: {},
                })

                toast.success("Account created successfully! Please check your email for verification.")

                if (role === "company") router.push("/company/dashboard")
                else router.push("/user/dashboard")
            }
        } catch (err: any) {
            toast.error("An unexpected error occurred during registration.")
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            await supabase.auth.signOut()
            setUser(null)
            toast.info("Logged out successfully")
            router.push("/auth/login")
        } catch (err) {
            setUser(null)
            router.push("/auth/login")
        }
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
