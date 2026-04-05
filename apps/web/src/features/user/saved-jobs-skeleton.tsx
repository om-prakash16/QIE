import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function SavedJobsSkeleton() {
    return (
        <Card className="border-border/50">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                </div>
                <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="pb-2">
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </CardContent>
            <CardFooter className="pt-4 flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
            </CardFooter>
        </Card>
    )
}
