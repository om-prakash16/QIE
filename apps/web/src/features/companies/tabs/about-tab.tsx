import { Company } from "@/lib/mock-api/companies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Lightbulb, Heart } from "lucide-react"

export function AboutTab({ company }: { company: Company }) {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            Our Mission
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-medium leading-relaxed text-primary/80">
                            "{company.about.mission}"
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-muted-foreground" />
                            Our Vision
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                            "{company.about.vision}"
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Core Values
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {company.about.values.map((value, i) => (
                            <div key={i} className="p-4 rounded-lg bg-muted/50 border flex items-center justify-center text-center font-medium">
                                {value}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
