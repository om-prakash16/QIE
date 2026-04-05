
export interface SalaryEntry {
    id: string
    role: string
    experience: number // years
    location: string
    companyType: "Startup" | "MNC" | "Product-based" | "Service-based"
    salary: number // In Lakhs (LPA)
}

export interface SalaryInsights {
    stats: {
        min: number
        max: number
        avg: number
        median: number
        count: number
    }
    distribution: { range: string; count: number }[]
    byExperience: { range: string; avg: number; min: number; max: number }[]
    byLocation: { location: string; avg: number }[]
}

const ROLES = ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "Machine Learning Engineer", "DevOps Engineer", "UI/UX Designer", "Product Manager"]
const LOCATIONS = ["Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Remote"]
const COMPANY_TYPES = ["Startup", "MNC", "Product-based", "Service-based"] as const

// Real World Estimates (2025) - [Min, Max, AvgBase]
const BASE_RANGES: Record<string, Record<string, [number, number, number]>> = {
    "Software Engineer": {
        "0-2": [3.5, 9.0, 5.5],
        "3-5": [8.0, 18.0, 12.0],
        "6-10": [15.0, 35.0, 22.0],
        "10+": [28.0, 65.0, 38.0]
    },
    "Frontend Developer": {
        "0-2": [3.0, 8.5, 5.0],
        "3-5": [7.0, 16.0, 11.0],
        "6-10": [14.0, 32.0, 20.0],
        "10+": [25.0, 55.0, 35.0]
    },
    "Backend Developer": {
        "0-2": [3.5, 9.5, 6.0],
        "3-5": [9.0, 20.0, 13.5],
        "6-10": [16.0, 38.0, 24.0],
        "10+": [30.0, 70.0, 42.0]
    },
    "Full Stack Developer": {
        "0-2": [4.0, 10.0, 6.5],
        "3-5": [10.0, 22.0, 15.0],
        "6-10": [18.0, 42.0, 26.0],
        "10+": [32.0, 75.0, 45.0]
    },
    "Data Scientist": {
        "0-2": [5.0, 12.0, 8.0],
        "3-5": [12.0, 25.0, 17.0],
        "6-10": [22.0, 50.0, 32.0],
        "10+": [40.0, 90.0, 55.0]
    },
    "Machine Learning Engineer": {
        "0-2": [6.0, 14.0, 9.0],
        "3-5": [14.0, 30.0, 20.0],
        "6-10": [25.0, 60.0, 38.0],
        "10+": [45.0, 100.0, 65.0]
    },
    "DevOps Engineer": {
        "0-2": [4.0, 9.0, 6.0],
        "3-5": [8.0, 18.0, 12.0],
        "6-10": [15.0, 35.0, 22.0],
        "10+": [28.0, 60.0, 40.0]
    },
    "UI/UX Designer": {
        "0-2": [3.0, 8.0, 5.0],
        "3-5": [7.0, 15.0, 10.0],
        "6-10": [12.0, 28.0, 18.0],
        "10+": [20.0, 45.0, 30.0]
    },
    "Product Manager": {
        "0-2": [6.0, 15.0, 10.0], // APM
        "3-5": [14.0, 28.0, 20.0],
        "6-10": [24.0, 55.0, 35.0],
        "10+": [45.0, 95.0, 60.0]
    }
}

const getExperienceBucket = (years: number): string => {
    if (years <= 2) return "0-2"
    if (years <= 5) return "3-5"
    if (years <= 10) return "6-10"
    return "10+"
}

const generateSalaryData = (count: number): SalaryEntry[] => {
    const data: SalaryEntry[] = []

    // Ensure good spread across all buckets
    ROLES.forEach(role => {
        LOCATIONS.forEach(loc => {
            COMPANY_TYPES.forEach(type => {
                // Generate a few entries for each combination to ensure data density
                for (let i = 0; i < 3; i++) {
                    const exp = Math.floor(Math.random() * 15) // 0-14
                    const bucket = getExperienceBucket(exp)
                    const [min, max, avgBase] = BASE_RANGES[role]?.[bucket] || [3, 8, 5]

                    let base = avgBase

                    // Location impact
                    if (loc === "Bangalore" || loc === "Remote") base *= 1.15
                    if (loc === "Mumbai" || loc === "Delhi NCR") base *= 1.1
                    if (loc === "Hyderabad" || loc === "Pune") base *= 1.05

                    // Company Type impact
                    if (type === "Product-based") base *= 1.25
                    if (type === "MNC") base *= 1.15
                    if (type === "Startup") base *= 1.1 // Good startups pay well
                    if (type === "Service-based") base *= 0.85

                    // Randomize within reasonable bounds of the calculated base
                    // But clamp to min/max roughly (allowing some outliers based on modifiers)
                    const variance = (Math.random() * 0.4) - 0.2 // +/- 20%
                    let finalSalary = base * (1 + variance)

                    // Ensure constraints
                    if (finalSalary < min) finalSalary = min
                    // We allow max to err on high side for outliers (unicorns etc)

                    data.push({
                        id: `sal_${data.length + 1}`,
                        role,
                        experience: exp,
                        location: loc,
                        companyType: type,
                        salary: Math.round(finalSalary * 10) / 10
                    })
                }
            })
        })
    })

    // Add remaining random data to reach count
    while (data.length < count) {
        const role = ROLES[Math.floor(Math.random() * ROLES.length)]
        const exp = Math.floor(Math.random() * 15)
        const bucket = getExperienceBucket(exp)
        const [min, max, avgBase] = BASE_RANGES[role]?.[bucket] || [3, 8, 5]
        // ... (simplified generation similar to above or just pick random)
        // For simplicity reusing the logic implicitly by letting the loop continue if I extracted it, 
        // but let's just do a quick random one here.
        const finalSalary = avgBase * (0.8 + Math.random() * 0.4)
        data.push({
            id: `sal_rand_${data.length}`,
            role,
            experience: exp,
            location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
            companyType: COMPANY_TYPES[Math.floor(Math.random() * COMPANY_TYPES.length)],
            salary: Math.round(finalSalary * 10) / 10
        })
    }

    return data
}

export const RAW_SALARY_DATA = generateSalaryData(1500) // Increased data size for better filtering

// --- Helper aggregators ---

export const getAggregatedInsights = async (filters: {
    role?: string
    location?: string
    experience?: string // "0-2", "3-5", "6-10", "10+"
    companyType?: string
}): Promise<SalaryInsights> => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800))

    let filtered = [...RAW_SALARY_DATA]

    if (filters.role && filters.role !== "all") {
        filtered = filtered.filter(d => d.role === filters.role)
    }
    if (filters.location && filters.location !== "all") {
        filtered = filtered.filter(d => d.location === filters.location)
    }
    if (filters.companyType && filters.companyType !== "all") {
        filtered = filtered.filter(d => d.companyType === filters.companyType)
    }
    if (filters.experience && filters.experience !== "all") {
        filtered = filtered.filter(d => {
            if (filters.experience === "0-2") return d.experience >= 0 && d.experience <= 2
            if (filters.experience === "3-5") return d.experience >= 3 && d.experience <= 5
            if (filters.experience === "6-10") return d.experience >= 6 && d.experience <= 10
            if (filters.experience === "10+") return d.experience > 10
            return true
        })
    }

    if (filtered.length === 0) {
        return {
            stats: { min: 0, max: 0, avg: 0, median: 0, count: 0 },
            distribution: [],
            byExperience: [],
            byLocation: []
        }
    }

    // Stats
    const salaries = filtered.map(d => d.salary).sort((a, b) => a - b)
    const min = salaries[0]
    const max = salaries[salaries.length - 1]
    const sum = salaries.reduce((a, b) => a + b, 0)
    const avg = Math.round((sum / salaries.length) * 10) / 10
    const median = salaries[Math.floor(salaries.length / 2)]

    // Distribution (Histogram)
    const bucketSize = Math.max(2, Math.ceil((max - min) / 8))
    const distribution: Record<string, number> = {}
    salaries.forEach(sal => {
        const bucketStart = Math.floor(sal / bucketSize) * bucketSize
        const range = `${bucketStart}-${bucketStart + bucketSize} L`
        distribution[range] = (distribution[range] || 0) + 1
    })

    const distArray = Object.entries(distribution)
        .map(([range, count]) => ({ range, count }))
        .sort((a, b) => {
            const startA = parseInt(a.range.split("-")[0])
            const startB = parseInt(b.range.split("-")[0])
            return startA - startB
        })

    // By Experience (Aggregated for table context)
    // We want to show the specific ROLE's breakdown across experience levels, 
    // even if the user has selected a specific experience filter (to allow comparing).
    // So we reset experience filter for this metric, but KEEP Role/Loc/Type.
    let expContext = [...RAW_SALARY_DATA]
    if (filters.role && filters.role !== "all") expContext = expContext.filter(d => d.role === filters.role)
    if (filters.location && filters.location !== "all") expContext = expContext.filter(d => d.location === filters.location)
    if (filters.companyType && filters.companyType !== "all") expContext = expContext.filter(d => d.companyType === filters.companyType)

    const ranges = ["0-2", "3-5", "6-10", "10+"]
    const byExperience = ranges.map(range => {
        const slice = expContext.filter(d => {
            if (range === "0-2") return d.experience >= 0 && d.experience <= 2
            if (range === "3-5") return d.experience >= 3 && d.experience <= 5
            if (range === "6-10") return d.experience >= 6 && d.experience <= 10
            if (range === "10+") return d.experience > 10
            return false
        })
        const s = slice.map(d => d.salary)
        const avgSal = s.length ? s.reduce((a, b) => a + b, 0) / s.length : 0
        const minSal = s.length ? Math.min(...s) : 0
        const maxSal = s.length ? Math.max(...s) : 0

        return {
            range: range + " Years",
            avg: Math.round(avgSal * 10) / 10,
            min: minSal,
            max: maxSal
        }
    })

    // By Location (Aggregated)
    // Similarly, keep Role/Exp/Type but show Loc comparison
    let locContext = [...RAW_SALARY_DATA]
    if (filters.role && filters.role !== "all") locContext = locContext.filter(d => d.role === filters.role)
    if (filters.companyType && filters.companyType !== "all") locContext = locContext.filter(d => d.companyType === filters.companyType)
    if (filters.experience && filters.experience !== "all") {
        locContext = locContext.filter(d => {
            if (filters.experience === "0-2") return d.experience >= 0 && d.experience <= 2
            if (filters.experience === "3-5") return d.experience >= 3 && d.experience <= 5
            if (filters.experience === "6-10") return d.experience >= 6 && d.experience <= 10
            if (filters.experience === "10+") return d.experience > 10
            return true
        })
    }

    const byLocation = LOCATIONS.map(loc => {
        const slice = locContext.filter(d => d.location === loc)
        const avgSal = slice.length ? slice.reduce((a, b) => a + b, 0) / slice.length : 0
        return {
            location: loc,
            avg: Math.round(avgSal * 10) / 10
        }
    }).sort((a, b) => b.avg - a.avg)

    return {
        stats: { min, max, avg, median, count: filtered.length },
        distribution: distArray,
        byExperience,
        byLocation
    }
}
