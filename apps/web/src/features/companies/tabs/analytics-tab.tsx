import { Company } from "@/lib/mock-api/companies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsTab({ company }: { company: Company }) {
    const data = company.analytics.jobsOverTime
    const maxVal = Math.max(...data.map(d => d.jobs), 1)

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Jobs Posted Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-end gap-2 sm:gap-4 mt-4">
                        {data.map((item, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-sm transition-all relative group-hover:shadow-lg"
                                    style={{ height: `${(item.jobs / maxVal) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.jobs}
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Application Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold">~45</div>
                            <div className="text-xs text-muted-foreground mt-1">Avg. Applicants per Job</div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">3 Days</div>
                            <div className="text-xs text-muted-foreground mt-1">Avg. Response Time</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
