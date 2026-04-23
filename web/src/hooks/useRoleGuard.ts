"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

type AllowedRole = "user" | "company" | "admin"

/**
 * Client-side role guard hook.
 * 
 * Redirects users who are not authenticated or lack the required role.
 * Works alongside the middleware.ts server-side guard for defense-in-depth.
 * 
 * @param allowedRoles - Array of roles that are permitted access
 * @returns { user, isLoading, isAuthorized } 
 * 
 * @example
 * ```tsx
 * const { user, isLoading, isAuthorized } = useRoleGuard(["admin"])
 * if (isLoading || !isAuthorized) return <Loader />
 * ```
 */
export function useRoleGuard(allowedRoles: AllowedRole[]) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    const isAuthorized = !!user && allowedRoles.includes(user.role)

    useEffect(() => {
        if (isLoading) return

        if (!user) {
            router.push("/auth/login")
            return
        }

        if (!allowedRoles.includes(user.role)) {
            // Redirect to the appropriate dashboard based on actual role
            switch (user.role) {
                case "admin":
                    router.push("/admin")
                    break
                case "company":
                    router.push("/company/dashboard")
                    break
                default:
                    router.push("/dashboard")
            }
        }
    }, [user, isLoading, router, allowedRoles])

    return { user, isLoading, isAuthorized }
}
