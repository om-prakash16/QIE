"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 20
            }
        }
    }

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Pattern - Subtle Grid */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 -z-10 bg-background/95 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <motion.div
                className="container px-4 mx-auto text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 font-heading text-foreground"
                    variants={itemVariants}
                >
                    Find Your <span className="text-primary bg-clip-text">Dream Career</span> Today
                </motion.h1>
                <motion.p
                    className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
                    variants={itemVariants}
                >
                    Connect with 1000+ top companies and startups. Your next big opportunity is just a search away.
                </motion.p>

                {/* Search Bar */}
                <motion.div
                    className="bg-background/50 backdrop-blur-md border p-2 rounded-[2rem] md:rounded-full shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2 relative z-10"
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Job title, keywords, or company"
                            className="pl-12 border-0 shadow-none bg-transparent focus-visible:ring-0 text-base md:text-lg py-6 md:py-7"
                        />
                    </div>
                    <div className="hidden md:block w-px bg-border my-2" />
                    <div className="w-full h-px bg-border md:hidden" />
                    <div className="relative flex-1">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="City, state, or remote"
                            className="pl-12 border-0 shadow-none bg-transparent focus-visible:ring-0 text-base md:text-lg py-6 md:py-7"
                        />
                    </div>
                    <Button size="lg" className="rounded-full w-full md:w-auto px-10 py-6 md:py-7 text-base md:text-lg font-bold shadow-lg hover:shadow-primary/20 transition-all duration-300 mt-2 md:mt-0">
                        Search Jobs
                    </Button>
                </motion.div>

                <motion.div
                    className="mt-12 flex justify-center gap-4 text-sm text-muted-foreground"
                    variants={itemVariants}
                >
                    <span className="hidden md:inline font-medium">Popular Searches:</span>
                    <div className="flex gap-3 flex-wrap justify-center">
                        {["Frontend", "Backend", "Design", "Remote"].map(tag => (
                            <motion.span
                                key={tag}
                                className="bg-secondary/50 backdrop-blur-sm border px-4 py-1.5 rounded-full cursor-pointer hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
