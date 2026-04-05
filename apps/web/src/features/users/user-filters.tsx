"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RotateCcw } from "lucide-react"

interface UserFiltersProps {
    filters: {
        role: string[]
        availability: string[]
        skills: string[]
    }
    setFilters: (filters: any) => void
}

export function UserFilters({ filters, setFilters }: UserFiltersProps) {
    const handleCheckboxChange = (category: string, value: string) => {
        const current = filters[category as keyof typeof filters] as string[]
        const newValues = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value]

        setFilters({ ...filters, [category]: newValues })
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setFilters({
                        role: [],
                        availability: [],
                        skills: []
                    })}
                >
                    <RotateCcw className="w-3.5 h-3.5 mr-2" />
                    Reset
                </Button>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-sm">Role</h4>
                <div className="space-y-2">
                    {["Frontend Engineer", "Backend Developer", "Full Stack Developer", "UI/UX Designer", "DevOps Engineer", "Data Scientist", "Mobile Developer"].map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                            <Checkbox
                                id={`role-${role}`}
                                checked={filters.role.includes(role)}
                                onCheckedChange={() => handleCheckboxChange("role", role)}
                            />
                            <Label htmlFor={`role-${role}`} className="text-sm font-normal text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                {role}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-sm">Availability</h4>
                <div className="space-y-2">
                    {["Immediate", "15 Days", "1 Month", "Not Looking"].map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                                id={`status-${status}`}
                                checked={filters.availability.includes(status)}
                                onCheckedChange={() => handleCheckboxChange("availability", status)}
                            />
                            <Label htmlFor={`status-${status}`} className="text-sm font-normal text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                {status}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-sm">Skills</h4>
                <div className="space-y-2">
                    {["React", "Node.js", "Python", "AWS", "Design", "Java"].map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                                id={`skill-${skill}`}
                                checked={filters.skills.includes(skill)}
                                onCheckedChange={() => handleCheckboxChange("skills", skill)}
                            />
                            <Label htmlFor={`skill-${skill}`} className="text-sm font-normal text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                {skill}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
