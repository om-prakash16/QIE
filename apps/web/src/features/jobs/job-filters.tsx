"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { RotateCcw, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface JobFiltersProps {
    filters: {
        type: string[]
        workMode: string[]
        experience: string[]
        salary: string[]
        companyType: string[]
        education: string[]
        postedDate: string[]
    }
    setFilters: (filters: any) => void
}

export function JobFilters({ filters, setFilters }: JobFiltersProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const handleCheckboxChange = (category: keyof typeof filters, value: string) => {
        const current = filters[category] as string[]
        const newValues = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value]

        setFilters({ ...filters, [category]: newValues })
    }

    const resetFilters = () => {
        setFilters({
            type: [],
            workMode: [],
            experience: [],
            salary: [],
            companyType: [],
            education: [],
            postedDate: []
        })
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }

    const sections = [
        {
            id: "type",
            title: "Job Type",
            options: ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Freelance"]
        },
        {
            id: "workMode",
            title: "Work Mode",
            options: ["On-site", "Remote", "Hybrid"]
        },
        {
            id: "experience",
            title: "Experience Level",
            options: ["Fresher (0–1 year)", "Junior (1–3 years)", "Mid-level (3–6 years)", "Senior (6–10 years)", "Lead / Manager (10+ years)"]
        },
        {
            id: "salary",
            title: "Salary Range",
            options: ["Below 3 LPA", "3–6 LPA", "6–10 LPA", "10–20 LPA", "20+ LPA"]
        },
        {
            id: "companyType",
            title: "Company Type",
            options: ["Startup", "Product-based", "Service-based", "MNC", "Government", "NGO"]
        },
        {
            id: "education",
            title: "Education",
            options: ["High School", "Diploma", "Bachelor’s Degree", "Master’s Degree", "PhD"]
        },
        {
            id: "postedDate",
            title: "Posted Date",
            options: ["Last 24 hours", "Last 3 days", "Last 7 days", "Last 30 days"]
        }
    ]

    return (
        <div className="space-y-6 [scrollbar-gutter:stable]">
            <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground hover:text-foreground hover:bg-transparent px-0"
                    onClick={resetFilters}
                >
                    <RotateCcw className="w-3.5 h-3.5 mr-2" />
                    Reset
                </Button>
            </div>

            <ScrollArea 
                className="h-[calc(100vh-200px)] pr-4" 
                viewportRef={scrollRef}
                data-lenis-prevent
                style={{ scrollBehavior: 'smooth' } as React.CSSProperties}
            >
                <div className="space-y-1 pb-8">
                    {sections.map((section, index) => (
                        <FilterSection
                            key={section.id}
                            section={section}
                            filters={filters}
                            onMapChange={handleCheckboxChange}
                            isLast={index === sections.length - 1}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

function FilterSection({
    section,
    filters,
    onMapChange,
    isLast
}: {
    section: { id: string, title: string, options: string[] },
    filters: any,
    onMapChange: any,
    isLast: boolean
}) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className="py-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors group"
            >
                {section.title}
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                )}
            </button>

            <div className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}>
                <div className="overflow-hidden">
                    <div className="space-y-2 pt-1 pb-2">
                        {section.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${section.id}-${option}`}
                                    checked={filters[section.id].includes(option)}
                                    onCheckedChange={() => onMapChange(section.id, option)}
                                />
                                <Label
                                    htmlFor={`${section.id}-${option}`}
                                    className="text-sm font-normal text-muted-foreground hover:text-foreground cursor-pointer transition-colors leading-none py-1 block"
                                >
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {!isLast && <Separator className="mt-2" />}
        </div>
    )
}
