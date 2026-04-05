"use client"

import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Check, Bell, Briefcase, Award, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
    id: string
    type: 'job' | 'nft' | 'system' | 'verify'
    title: str
    message: str
    time: str
    isRead: boolean
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "nft",
        title: "NFT Minted Successfully",
        message: "Your React Developer Skill NFT is now on-chain.",
        time: "2m ago",
        isRead: false
    },
    {
        id: "2",
        type: "job",
        title: "New Job Match",
        message: "A new 'Senior Rust Engineer' role matches your profile.",
        time: "1h ago",
        isRead: false
    },
    {
        id: "3",
        type: "verify",
        title: "Verification Complete",
        message: "Your GitHub activity analysis is finished. Score: 850.",
        time: "3h ago",
        isRead: false
    }
]

export function NotificationDropdown({ onResetCount }: { onResetCount: () => void }) {
    return (
        <div className="flex flex-col h-full max-h-[450px]">
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-sm font-semibold">Notifications</h3>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-8 text-primary"
                    onClick={onResetCount}
                >
                    Mark all as read
                </Button>
            </div>
            <ScrollArea className="flex-1">
                {mockNotifications.length > 0 ? (
                    <div className="flex flex-col">
                        {mockNotifications.map((notif) => (
                            <Link 
                                key={notif.id} 
                                href="/dashboard/notifications" 
                                className={cn(
                                    "flex gap-3 p-4 border-b hover:bg-muted/50 transition-colors",
                                    !notif.isRead && "bg-primary/5"
                                )}
                            >
                                <div className={cn(
                                    "mt-1 p-2 rounded-full",
                                    notif.type === 'nft' && "bg-purple-500/10 text-purple-600",
                                    notif.type === 'job' && "bg-blue-500/10 text-blue-600",
                                    notif.type === 'verify' && "bg-green-500/10 text-green-600",
                                    notif.type === 'system' && "bg-orange-500/10 text-orange-600",
                                )}
                                >
                                    {notif.type === 'nft' && <Award className="h-4 w-4" />}
                                    {notif.type === 'job' && <Briefcase className="h-4 w-4" />}
                                    {notif.type === 'verify' && <Check className="h-4 w-4" />}
                                    {notif.type === 'system' && <Bell className="h-4 w-4" />}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium leading-none">{notif.title}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                                    <span className="text-[10px] text-muted-foreground uppercase">{notif.time}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
                        <p className="text-sm text-muted-foreground">No notifications yet</p>
                    </div>
                )}
            </ScrollArea>
            <div className="p-2 border-t mt-auto">
                <Link href="/dashboard/activity">
                    <Button variant="ghost" className="w-full text-xs h-8">
                        View All Activity
                    </Button>
                </Link>
            </div>
        </div>
    )
}
