import { Company } from "@/lib/mock-api/companies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TechStackTab({ company }: { company: Company }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Technology Stack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold mb-3">Frontend</h4>
                        <div className="flex flex-wrap gap-2">
                            {company.techStack.frontend.map(tech => (
                                <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm">{tech}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-3">Backend</h4>
                        <div className="flex flex-wrap gap-2">
                            {company.techStack.backend.map(tech => (
                                <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm">{tech}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-3">Infrastructure</h4>
                        <div className="flex flex-wrap gap-2">
                            {company.techStack.infra.map(tech => (
                                <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm">{tech}</Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
