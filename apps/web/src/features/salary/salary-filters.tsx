"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "Product Manager", "UI/UX Designer", "DevOps Engineer"]
const EXPERIENCES = ["0-2", "3-5", "6-10", "10+"]
const LOCATIONS = ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Remote"]
const COMPANY_TYPES = ["Startup", "MNC", "Product-based", "Service-based"]

export function SalaryFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "all") {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/salary?${params.toString()}`, { scroll: false })
    }

    const clearFilters = () => {
        router.push("/salary", { scroll: false })
    }

    const currentRole = searchParams.get("role") || ""
    const currentExp = searchParams.get("experience") || ""
    const currentLoc = searchParams.get("location") || ""
    const currentType = searchParams.get("companyType") || ""

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 text-muted-foreground hover:text-foreground px-0"
                >
                    <RotateCcw className="w-3.5 h-3.5 mr-2" />
                    Reset
                </Button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Job Role</Label>
                    <Select value={currentRole} onValueChange={(val) => updateFilter("role", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {ROLES.map(role => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Experience</Label>
                    <Select value={currentExp} onValueChange={(val) => updateFilter("experience", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Any Experience" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Experience</SelectItem>
                            {EXPERIENCES.map(exp => (
                                <SelectItem key={exp} value={exp}>{exp} Years</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Location</Label>
                    <Select value={currentLoc} onValueChange={(val) => updateFilter("location", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Any Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Location</SelectItem>
                            {LOCATIONS.map(loc => (
                                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Company Type</Label>
                    <Select value={currentType} onValueChange={(val) => updateFilter("companyType", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Any Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Type</SelectItem>
                            {COMPANY_TYPES.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
