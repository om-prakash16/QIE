"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserProfile } from "@/lib/mock-api/user-profile"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface SettingsTabProps {
    data: UserProfile
}

export function SettingsTab({ data }: SettingsTabProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your profile preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive emails about new job matches.</p>
                    </div>
                    <Switch defaultChecked={data.settings.notifications} />
                </div>

                <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                        <Label className="text-base">Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">Control who can see your profile.</p>
                    </div>
                    <Select defaultValue={data.settings.visibility.toLowerCase()}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                        <Label className="text-base">Theme Preference</Label>
                        <p className="text-sm text-muted-foreground">Select your preferred interface theme.</p>
                    </div>
                    <Select
                        value={mounted ? theme : "system"}
                        onValueChange={setTheme}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
                <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">Delete Account</Button>
                <Button variant="outline">Log Out</Button>
            </CardFooter>
        </Card>
    )
}
