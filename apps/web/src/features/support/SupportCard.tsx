import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface SupportCardProps {
    icon: LucideIcon
    title: string
    description: string
}

export function SupportCard({ icon: Icon, title, description }: SupportCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader className="text-center pt-8">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground text-sm">
                {description}
            </CardContent>
        </Card>
    )
}
