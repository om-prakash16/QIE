import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Company } from "@/lib/mock-api/companies"
import { MapPin, Building2, Briefcase } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CompanyCardProps {
    company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow duration-300 overflow-hidden group border-border/50">
            <CardHeader className="p-6 pb-4 flex flex-row items-start justify-between space-y-0 relative">
                {/* Top Decorator */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex gap-4">
                    <Avatar className="h-16 w-16 rounded-lg border bg-background shadow-sm">
                        <AvatarImage src={company.logo} alt={company.name} className="object-cover" />
                        <AvatarFallback className="rounded-lg bg-primary/5 text-primary text-xl font-bold">
                            {company.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                            {company.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {company.tagline}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                        <Building2 className="h-3.5 w-3.5" />
                        {company.industry}
                    </div>
                    <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                        <Briefcase className="h-3.5 w-3.5" />
                        {company.size}
                    </div>
                    <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                        <MapPin className="h-3.5 w-3.5" />
                        {company.location}
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Open Positions</span>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{company.jobCount}</span>
                            {company.hiringStatus === "Actively Hiring" && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <Link href={`/companies/${company.slug}`} className="block mt-4">
                    <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                        View Details
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}
