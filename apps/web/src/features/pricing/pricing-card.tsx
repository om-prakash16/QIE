import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export interface PricingPlan {
    name: string
    description: string
    monthlyPrice: number | string
    yearlyPrice: number | string
    features: string[]
    bestFor: string
    isPopular?: boolean
    ctaText: string
    ctaLink: string
    ctaVariant?: "default" | "outline"
}

interface PricingCardProps {
    plan: PricingPlan
    isYearly: boolean
}

export function PricingCard({ plan, isYearly }: PricingCardProps) {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
    const isContact = typeof price === "string"

    return (
        <Card className={`flex flex-col h-full relative ${plan.isPopular ? 'border-primary shadow-lg scale-105 z-10' : 'border-border'}`}>
            {plan.isPopular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-primary hover:bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
                </div>
            )}
            <CardHeader className="space-y-2">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm min-h-[40px]">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
                <div className="flex items-baseline gap-1">
                    {isContact ? (
                        <span className="text-3xl font-bold">{price}</span>
                    ) : (
                        <>
                            <span className="text-3xl font-bold">₹{price}</span>
                            <span className="text-muted-foreground text-sm font-medium">/month</span>
                        </>
                    )}
                </div>
                {isYearly && !isContact && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Billed yearly (Save 20%)
                    </p>
                )}

                <div className="space-y-2 text-sm text-foreground">
                    <p className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-3">Best For: {plan.bestFor}</p>
                    <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    variant={plan.ctaVariant || (plan.isPopular ? "default" : "outline")}
                    asChild
                >
                    <Link href={plan.ctaLink}>{plan.ctaText}</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
