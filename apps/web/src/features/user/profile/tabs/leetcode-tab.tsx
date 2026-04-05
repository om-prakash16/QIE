import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target } from "lucide-react"
import { UserProfile } from "@/lib/mock-api/user-profile"

interface LeetcodeTabProps {
    data: UserProfile
}

export function LeetcodeTab({ data }: LeetcodeTabProps) {
    const total = data.leetcode.easy + data.leetcode.medium + data.leetcode.hard

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 border-b bg-muted/20">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                </div>
                <div>
                    <CardTitle>LeetCode Stats</CardTitle>
                    <CardDescription>
                        Connected as <span className="font-semibold text-foreground">{data.leetcode.username}</span>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Circle Stats Placeholder (using simpler layout for now) */}
                    <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-full w-48 h-48 mx-auto border-4 border-muted">
                        <span className="text-4xl font-bold">{data.leetcode.totalSolved}</span>
                        <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Solved</span>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-green-600 font-medium">Easy</span>
                                <span className="text-muted-foreground">{data.leetcode.easy} / {total}</span>
                            </div>
                            <Progress value={(data.leetcode.easy / total) * 100} className="h-2 bg-green-100 dark:bg-green-900/20" />
                            {/* Note: shadcn Progress color customization might need custom class or style if not using CSS variables */}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-yellow-600 font-medium">Medium</span>
                                <span className="text-muted-foreground">{data.leetcode.medium} / {total}</span>
                            </div>
                            <Progress value={(data.leetcode.medium / total) * 100} className="h-2 bg-yellow-100 dark:bg-yellow-900/20" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-red-600 font-medium">Hard</span>
                                <span className="text-muted-foreground">{data.leetcode.hard} / {total}</span>
                            </div>
                            <Progress value={(data.leetcode.hard / total) * 100} className="h-2 bg-red-100 dark:bg-red-900/20" />
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t">
                            <Target className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Global Ranking: <span className="text-foreground font-semibold">#{data.leetcode.ranking.toLocaleString()}</span></span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
