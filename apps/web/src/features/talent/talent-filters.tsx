"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RotateCcw, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useRef } from "react"

export function TalentFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const scrollRef = useRef<HTMLDivElement>(null)

    // Helper to get current filters from URL
    const getFilter = (key: string) => {
        const param = searchParams.get(key)
        return param ? param.split(",") : []
    }

    // Helper to update URL
    const updateFilter = (key: string, value: string) => {
        const current = getFilter(key)
        const newValues = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value]

        const params = new URLSearchParams(searchParams.toString())
        if (newValues.length > 0) {
            params.set(key, newValues.join(","))
        } else {
            params.delete(key)
        }

        // Reset page on filter change
        params.set("page", "1")

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const clearFilters = () => {
        router.push(pathname, { scroll: false })
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }

    const sections = [
        {
            id: "role",
            title: "Role",
            options: ["Frontend", "Backend", "Full Stack", "Mobile", "DevOps", "Data", "Design", "Product"]
        },
        {
            id: "exp",
            title: "Experience Level",
            options: ["Fresher", "Junior", "Mid-Level", "Senior", "Lead"]
        },
        {
            id: "availability",
            title: "Availability",
            options: ["Immediate", "15 Days", "1 Month", "Not Looking"]
        },
        {
            id: "loc",
            title: "Location",
            options: ["Remote", "Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune"]
        },
        {
            id: "skills",
            title: "Skills",
            options: ["React", "Next.js", "Node.js", "Python", "Java", "AWS", "Figma", "TypeScript"]
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground hover:text-foreground px-0"
                    onClick={clearFilters}
                >
                    <RotateCcw className="w-3.5 h-3.5 mr-2" />
                    Reset
                </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-250px)] pr-4" viewportRef={scrollRef}>
                <div className="space-y-1 pb-8">
                    {sections.map((section, index) => (
                        <FilterSection
                            key={section.id}
                            title={section.title}
                            options={section.options}
                            selected={getFilter(section.id)}
                            onChange={(val) => updateFilter(section.id, val)}
                            isLast={index === sections.length - 1}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

function FilterSection({ title, options, selected, onChange, isLast }: any) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className="py-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors group"
            >
                {title}
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                )}
            </button>

            {isOpen && (
                <div className="space-y-2 pt-1 pb-2">
                    {options.map((option: string) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={`${title}-${option}`}
                                checked={selected.includes(option)}
                                onCheckedChange={() => onChange(option)}
                            />
                            <Label
                                htmlFor={`${title}-${option}`}
                                className="text-sm font-normal text-muted-foreground hover:text-foreground cursor-pointer transition-colors leading-none py-1 block"
                            >
                                {option}
                            </Label>
                        </div>
                    ))}
                </div>
            )}
            {!isLast && <Separator className="mt-2" />}
        </div>
    )
}
