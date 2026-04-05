import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UserProfile } from "@/lib/mock-api/user-profile"
import { Edit2, Save, X } from "lucide-react"

interface BasicInfoTabProps {
    data: UserProfile
    isEditing?: boolean
}

export function BasicInfoTab({ data, isEditing = false }: BasicInfoTabProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div className="space-y-1">
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Your personal details and contact info. These are visible to recruiters.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue={data.basic.firstName} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue={data.basic.lastName} disabled={!isEditing} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue={data.basic.email} disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground">Contact support to change email.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue={data.basic.phone} disabled={!isEditing} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                        id="bio"
                        defaultValue={data.basic.bio}
                        className="min-h-[120px] leading-relaxed"
                        placeholder="Tell recruiters about yourself..."
                        disabled={!isEditing}
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue={data.basic.location} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="exp">Experience Level</Label>
                        <Input id="exp" defaultValue={data.basic.experienceLevel} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type">Preferred Job Type</Label>
                        <Input id="type" defaultValue={data.basic.jobType} disabled={!isEditing} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
