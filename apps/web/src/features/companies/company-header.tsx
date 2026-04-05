import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Company } from "@/lib/mock-api/companies"
import { MapPin, Building2, Users, Calendar, Globe, Plus } from "lucide-react"
import Link from "next/link"

interface CompanyHeaderProps {
    company: Company
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
    return (
        <div className="bg-background border rounded-2xl shadow-sm overflow-hidden">
            {/* Cover Image Placeholder - could be dynamic later */}
            <div className="h-32 md:h-48 bg-gradient-to-r from-primary/10 via-primary/5 to-background w-full" />

            <div className="px-6 md:px-10 pb-8">
                <div className="relative flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-12 md:-mt-16 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-lg rounded-xl">
                            <AvatarImage src={company.logo} alt={company.name} className="object-cover" />
                            <AvatarFallback className="rounded-xl bg-primary/5 text-primary text-3xl font-bold">
                                {company.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold font-heading">{company.name}</h1>
                            <p className="text-lg text-muted-foreground">{company.tagline}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none">
                            <Plus className="w-4 h-4 mr-2" />
                            Follow
                        </Button>
                        <Link href={company.website} target="_blank" className="flex-1 md:flex-none">
                            <Button variant="outline" className="w-full">
                                <Globe className="w-4 h-4 mr-2" />
                                Website
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 md:gap-8 border-t pt-6">
                    <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Industry</span>
                        <span className="font-medium">{company.industry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-medium">{company.size}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Founded</span>
                        <span className="font-medium">{company.founded}</span>
                    </div>
                    <div className="ml-auto">
                        {company.hiringStatus === "Actively Hiring" && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20">
                                ⭐ Actively Hiring
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
