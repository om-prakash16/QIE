import { Company } from "@/lib/mock-api/companies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Users, Sparkles } from "lucide-react"

export function CultureTab({ company }: { company: Company }) {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Work Environment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            {company.culture.environment}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Diversity & Inclusion
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            {company.culture.diversity}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {company.culture.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/10 text-sm font-medium">
                                <span className="bg-green-500/20 text-green-700 p-1 rounded-full">
                                    <Check className="w-3 h-3" />
                                </span>
                                {benefit}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
