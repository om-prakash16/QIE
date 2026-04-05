"use client"

import { useState, useMemo } from "react"
import { COMPANIES } from "@/lib/mock-api/companies"
import { CompanyFilters } from "@/components/features/companies/company-filters"
import { CompanyCard } from "@/components/features/companies/company-card"
import { Button } from "@/components/ui/button"
import { Search, Building2 } from "lucide-react"

const ITEMS_PER_PAGE = 12

export default function CompaniesPage() {
    // Filter State
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [onlyHiring, setOnlyHiring] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    // Filtering Logic
    const filteredCompanies = useMemo(() => {
        return COMPANIES.filter(company => {
            // Search Query
            if (searchQuery && !company.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false
            }
            // Industry Filter
            if (selectedIndustries.length > 0 && !selectedIndustries.includes(company.industry)) {
                return false
            }
            // Size Filter
            if (selectedSizes.length > 0 && !selectedSizes.includes(company.size)) {
                return false
            }
            // Hiring Status
            if (onlyHiring && company.hiringStatus !== "Actively Hiring") {
                return false
            }
            return true
        })
    }, [searchQuery, selectedIndustries, selectedSizes, onlyHiring])

    // Pagination Logic
    const paginatedCompanies = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredCompanies, currentPage])

    const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE)

    // Reset page when filters change
    useMemo(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedIndustries, selectedSizes, onlyHiring])

    return (
        <div className="min-h-screen bg-muted/5 pt-16">
            {/* Page Header */}
            <div className="bg-background border-b py-16 mb-8 mt-2">
                <div className="container px-4 mx-auto text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 tracking-tight">
                            Explore Top <span className="text-primary">Companies</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Discover the best places to work based on industry, size, and hiring status. Browse {COMPANIES.length}+ world-class organizations.
                        </p>
                    </div>
                </div>
            </div>

            <main className="container px-4 mx-auto py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 shrink-0 sticky top-24">
                        <div className="bg-background rounded-xl border p-6 shadow-sm">
                            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <Search className="w-5 h-5 text-primary" />
                                Filters
                            </h2>
                            <CompanyFilters
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                selectedIndustries={selectedIndustries}
                                setSelectedIndustries={setSelectedIndustries}
                                selectedSizes={selectedSizes}
                                setSelectedSizes={setSelectedSizes}
                                onlyHiring={onlyHiring}
                                setOnlyHiring={setOnlyHiring}
                            />
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 w-full min-w-0">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">Directory</h2>
                                <p className="text-sm text-muted-foreground">
                                    Showing {filteredCompanies.length} companies
                                </p>
                            </div>
                        </div>

                        {filteredCompanies.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paginatedCompanies.map((company) => (
                                        <CompanyCard key={company.id} company={company} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center items-center gap-3">
                                        <Button
                                            variant="outline"
                                            disabled={currentPage === 1}
                                            onClick={() => {
                                                setCurrentPage(p => Math.max(1, p - 1))
                                                window.scrollTo({ top: 300, behavior: 'smooth' })
                                            }}
                                        >
                                            Previous
                                        </Button>
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            Page <span className="text-primary">{currentPage}</span> of {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            disabled={currentPage === totalPages}
                                            onClick={() => {
                                                setCurrentPage(p => Math.min(totalPages, p + 1))
                                                window.scrollTo({ top: 300, behavior: 'smooth' })
                                            }}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-24 bg-background rounded-2xl border border-dashed">
                                <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                                <h3 className="text-xl font-medium mb-2">No companies found</h3>
                                <p className="text-muted-foreground mb-6">
                                    Try adjusting your search or filters to see more results.
                                </p>
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setSearchQuery("")
                                        setSelectedIndustries([])
                                        setSelectedSizes([])
                                        setOnlyHiring(false)
                                    }}
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
