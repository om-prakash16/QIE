import { Company } from "@/lib/mock-api/companies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, User } from "lucide-react"

export function ReviewsTab({ company }: { company: Company }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="text-4xl font-bold font-heading">4.5</div>
                <div className="space-y-1">
                    <div className="flex text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" />
                        <Star className="w-5 h-5 fill-current" opacity={0.5} />
                    </div>
                    <p className="text-sm text-muted-foreground">Based on {company.reviews.length} reviews</p>
                </div>
            </div>

            <div className="grid gap-4">
                {company.reviews.length > 0 ? (
                    company.reviews.map((review) => (
                        <Card key={review.id}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">{review.author}</h4>
                                            <p className="text-xs text-muted-foreground">{review.role} • {review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-500 gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-muted"}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    "{review.text}"
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No reviews yet. be the first to review!
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
