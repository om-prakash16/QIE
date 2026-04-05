"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface CompanyFiltersProps {
    searchQuery: string
    setSearchQuery: (value: string) => void
    selectedIndustries: string[]
    setSelectedIndustries: (value: string[]) => void
    selectedSizes: string[]
    setSelectedSizes: (value: string[]) => void
    onlyHiring: boolean
    setOnlyHiring: (value: boolean) => void
}

export function CompanyFilters({
    searchQuery,
    setSearchQuery,
    selectedIndustries,
    setSelectedIndustries,
    selectedSizes,
    setSelectedSizes,
    onlyHiring,
    setOnlyHiring
}: CompanyFiltersProps) {

    const toggleIndustry = (item: string) => {
        if (selectedIndustries.includes(item)) {
            setSelectedIndustries(selectedIndustries.filter(i => i !== item))
        } else {
            setSelectedIndustries([...selectedIndustries, item])
        }
    }

    const toggleSize = (item: string) => {
        if (selectedSizes.includes(item)) {
            setSelectedSizes(selectedSizes.filter(i => i !== item))
        } else {
            setSelectedSizes([...selectedSizes, item])
        }
    }

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedIndustries([])
        setSelectedSizes([])
        setOnlyHiring(false)
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search companies..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-sm">Industry</h3>
                <div className="space-y-2">
                    {[
                        "Information Technology (IT)",
                        "FinTech & Financial Services",
                        "Healthcare & Life Sciences",
                        "Education (EdTech)",
                        "E-commerce & Retail",
                        "Manufacturing & Engineering",
                        "Media & Entertainment",
                        "Professional Services"
                    ].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                            <Checkbox
                                id={`industry-${item}`}
                                checked={selectedIndustries.includes(item)}
                                onCheckedChange={() => toggleIndustry(item)}
                            />
                            <Label htmlFor={`industry-${item}`} className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                {item}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-sm">Company Size</h3>
                <div className="space-y-2">
                    {["Startup", "SME", "Enterprise"].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                            <Checkbox
                                id={`size-${item}`}
                                checked={selectedSizes.includes(item)}
                                onCheckedChange={() => toggleSize(item)}
                            />
                            <Label htmlFor={`size-${item}`} className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                                {item}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-sm">Status</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="hiring"
                        checked={onlyHiring}
                        onCheckedChange={(checked) => setOnlyHiring(checked as boolean)}
                    />
                    <Label htmlFor="hiring" className="text-sm font-normal cursor-pointer">Actively Hiring</Label>
                </div>
            </div>

            <Button
                className="w-full"
                variant="outline"
                onClick={clearFilters}
            >
                Clear Filters
            </Button>
        </div>
    )
}
