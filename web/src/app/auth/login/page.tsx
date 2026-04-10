"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginValues } from "@/lib/validations/auth"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { Briefcase, Eye, EyeOff, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
    const { demoLogin, login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    async function onSubmit(data: LoginValues) {
        setIsLoading(true)
        try {
            await login(data.email, data.password)
        } catch {
            // Error toast is already shown by auth-context
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-background/95">
            <CardHeader className="space-y-1 items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold font-heading">Welcome back</CardTitle>
                <CardDescription>
                    Enter your email to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <Link href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
                                    </div>
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
                            name="rememberMe"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Remember me
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                        </Button>
                        
                        <div className="pt-4 space-y-3">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
                                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-background px-4 text-muted-foreground/60">Professional Identity</span></div>
                            </div>
                            
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full h-12 border-primary/20 hover:bg-primary/10 hover:border-primary/50 transition-all font-black uppercase text-xs tracking-widest"
                                onClick={() => demoLogin("USER")}
                                disabled={isLoading}
                            >
                                Demo Login: Job Seeker
                            </Button>

                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full h-12 border-primary/20 hover:bg-primary/10 hover:border-primary/50 transition-all font-black uppercase text-xs tracking-widest"
                                onClick={() => demoLogin("COMPANY")}
                                disabled={isLoading}
                            >
                                Demo Login: Company
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="justify-center text-sm text-muted-foreground">
                Don't have an account? <Link href="/auth/register" className="text-primary hover:underline ml-1 font-medium">Sign up</Link>
            </CardFooter>
        </Card>
    )
}
