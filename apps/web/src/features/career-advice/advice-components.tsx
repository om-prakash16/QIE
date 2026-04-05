import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon, FileText, Users, TrendingUp, DollarSign, GraduationCap, Repeat } from "lucide-react"

export interface CategoryCardProps {
    id: string
    label: string
    count: number
    onClick: (id: string) => void
    isActive: boolean
}

// Map IDs to icons
const ICONS: Record<string, LucideIcon> = {
    "resume": FileText,
    "interviews": Users,
    "growth": TrendingUp,
    "salary": DollarSign,
    "freshers": GraduationCap,
    "switching": Repeat
}

export function CategoryCard({ id, label, count, onClick, isActive }: CategoryCardProps) {
    const Icon = ICONS[id] || FileText

    return (
        <Card
            className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-sm ${isActive ? 'border-primary bg-primary/5' : ''}`}
            onClick={() => onClick(id)}
        >
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                <div className={`p-2 rounded-full ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className={`font-semibold text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>{label}</h3>
                    <p className="text-xs text-muted-foreground">{count} Articles</p>
                </div>
            </CardContent>
        </Card>
    )
}

// --- Career Stage Card ---

import { Award, Sprout, Briefcase } from "lucide-react"

interface CareerStageCardProps {
    title: string
    description: string
    icon: string
}

const STAGE_ICONS: Record<string, LucideIcon> = {
    "GraduationCap": GraduationCap,
    "Sprout": Sprout,
    "Briefcase": Briefcase,
    "Award": Award
}

export function CareerStageCard({ title, description, icon }: CareerStageCardProps) {
    const Icon = STAGE_ICONS[icon] || Briefcase

    return (
        <Card className="hover:border-primary/50 transition-colors group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-24 h-24" />
            </div>
            <CardContent className="p-6 space-y-4">
                <div className="bg-primary/10 w-fit p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
