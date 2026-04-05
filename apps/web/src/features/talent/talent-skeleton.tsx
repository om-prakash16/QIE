import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function TalentSkeleton() {
    return (
        <Card className="overflow-hidden flex flex-col h-full bg-card">
            <div className="p-6 pb-2 flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2 py-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 pt-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            </div>
            <CardContent className="px-6 py-4 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                </div>
            </CardContent>
            <CardFooter className="p-4 bg-muted/5 border-t mt-auto">
                <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
        </Card>
    )
}
