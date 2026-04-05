"use client"

import { CATEGORIES } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Palette, Megaphone, Banknote, Box, Briefcase, Users, Settings } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

// Map icon strings to components
const iconMap: Record<string, any> = {
    Code, Palette, Megaphone, Banknote, Box, Briefcase, Users, Settings
}

export function Categories() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
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
        <section className="py-24 bg-muted/30 overflow-hidden">
            <div className="container px-4 mx-auto">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-foreground">Explore by Category</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Browse opportunities across various industries and find the perfect fit for your skills.</p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {CATEGORIES.map((cat: any) => {
                        const Icon = iconMap[cat.icon] || Briefcase
                        return (
                            <motion.div key={cat.id} variants={itemVariants}>
                                <Link href={`/jobs?category=${encodeURIComponent(cat.name)}`}>
                                    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-border/50 hover:border-primary/50 h-full bg-background/50 backdrop-blur-sm overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500" />
                                        <CardContent className="p-8 flex flex-col items-center text-center gap-6 relative z-10">
                                            <div className="p-5 rounded-2xl bg-primary/5 group-hover:bg-primary text-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                                                <Icon className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                                                <p className="text-sm font-medium text-muted-foreground group-hover:text-muted-foreground/80">{cat.count} open positions</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
