import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JobSkeleton() {
    return (
        <Card className="border-border/50">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                </div>
                <Skeleton className="h-6 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-24" />
            </CardFooter>
        </Card>
    )
}
