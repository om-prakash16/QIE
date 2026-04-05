import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function UserSkeleton() {
    return (
        <Card className="flex flex-col h-full overflow-hidden border-border/50">
            <CardHeader className="pb-4">
                <div className="flex gap-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2 mt-1">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-4 flex-grow space-y-4">
                <div className="space-y-1.5">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>
            </CardContent>
            <CardFooter className="pt-0 flex flex-col gap-3">
                <div className="w-full h-px bg-muted"></div>
                <div className="w-full flex justify-between items-center">
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <div className="flex gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-4" />
                    </div>
                </div>
                <Skeleton className="h-9 w-full rounded-md" />
            </CardFooter>
        </Card>
    )
}
