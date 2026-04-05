"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterValues } from "@/lib/validations/auth"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RoleSelector } from "@/components/auth/role-selector"
import Link from "next/link"
import { Briefcase, Loader2, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"


export default function RegisterPage() {
    const { register } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "user",
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: RegisterValues) {
        setIsLoading(true)
        try {
            await register(data.name, data.email, data.password, data.role)
        } catch {
            // Error toast is already shown by auth-context
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-background/95">
            <CardHeader className="space-y-1 items-center text-center">
                <CardTitle className="text-2xl font-bold font-heading">Create an account</CardTitle>
                <CardDescription>
                    Choose your role and start your journey
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RoleSelector value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input 
                                                type={showPassword ? "text" : "password"} 
                                                className="pr-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20 h-12 transition-all"
                                                {...field} 
                                            />
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground/60 hover:text-primary transition-colors bg-white/5 rounded-lg border border-white/5 hover:border-primary/20"
                                            >
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={showPassword ? "eye-off" : "eye"}
                                                        initial={{ opacity: 0, rotate: -30 }}
                                                        animate={{ opacity: 1, rotate: 0 }}
                                                        exit={{ opacity: 0, rotate: 30 }}
                                                        transition={{ duration: 0.15 }}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </motion.button>

                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input 
                                                type={showConfirmPassword ? "text" : "password"} 
                                                className="pr-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20 h-12 transition-all"
                                                {...field} 
                                            />
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground/60 hover:text-primary transition-colors bg-white/5 rounded-lg border border-white/5 hover:border-primary/20"
                                            >
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={showConfirmPassword ? "eye-off" : "eye"}
                                                        initial={{ opacity: 0, rotate: -30 }}
                                                        animate={{ opacity: 1, rotate: 0 }}
                                                        exit={{ opacity: 0, rotate: 30 }}
                                                        transition={{ duration: 0.15 }}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </motion.button>

                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="justify-center text-sm text-muted-foreground">
                Already have an account? <Link href="/auth/login" className="text-primary hover:underline ml-1 font-medium">Log in</Link>
            </CardFooter>
        </Card>
    )
}
