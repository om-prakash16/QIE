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
        <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

            {/* Page Header */}
            <div className="container px-4 mx-auto mb-16 relative z-10 text-center">
                <div className="max-w-4xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-7xl font-black font-heading tracking-tighter uppercase text-white">
                        Partner <span className="text-gradient">Nodes</span>
                    </h1>
                    <p className="text-lg text-muted-foreground/80 font-medium max-w-2xl mx-auto">
                        Explore the network of verified corporate entities. Browse {COMPANIES.length}+ active organizations seeking top talent.
                    </p>
                </div>
            </div>

            <main className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-80 shrink-0 sticky top-32">
                        <div className="glass border-white/5 rounded-[2rem] p-8 shadow-2xl">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-white">
                                <div className="p-2 glass rounded-xl bg-primary/10 border-primary/20">
                                    <Search className="w-4 h-4 text-primary" />
                                </div>
                                Filter Matrix
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
                        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 pb-4 border-b border-white/5">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black tracking-tight text-white">Active Registry</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                    Displaying {filteredCompanies.length} partner nodes
                                </p>
                            </div>
                        </div>

                        {filteredCompanies.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {paginatedCompanies.map((company) => (
                                        <CompanyCard key={company.id} company={company} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-16 flex justify-center items-center gap-4">
                                        <Button
                                            variant="outline"
                                            className="glass border-white/10 hover:border-white/20 hover:text-primary font-black uppercase tracking-[0.2em] text-[10px] h-12 px-6 rounded-xl transition-all"
                                            disabled={currentPage === 1}
                                            onClick={() => {
                                                setCurrentPage(p => Math.max(1, p - 1))
                                                window.scrollTo({ top: 300, behavior: 'smooth' })
                                            }}
                                        >
                                            Previous
                                        </Button>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 glass px-6 h-12 rounded-xl border border-white/5">
                                            Page <span className="text-primary text-xs mx-1">{currentPage}</span> of {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="glass border-white/10 hover:border-white/20 hover:text-primary font-black uppercase tracking-[0.2em] text-[10px] h-12 px-6 rounded-xl transition-all"
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
                            <div className="text-center py-32 glass rounded-[3rem] border border-dashed border-white/10 shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-24 h-24 mb-6 rounded-3xl glass bg-white/5 border border-white/10 flex items-center justify-center shadow-xl">
                                        <Building2 className="w-10 h-10 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight text-white mb-2">No active nodes found</h3>
                                    <p className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground/60 mb-8 max-w-md mx-auto">
                                        The filter matrix returned zero results. Adjust your parameters to discover more organizations.
                                    </p>
                                    <Button 
                                        variant="premium" 
                                        className="h-12 px-8 rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                        onClick={() => {
                                            setSearchQuery("")
                                            setSelectedIndustries([])
                                            setSelectedSizes([])
                                            setOnlyHiring(false)
                                        }}
                                    >
                                        RESET MATRIX
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
