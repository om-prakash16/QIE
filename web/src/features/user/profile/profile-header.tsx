import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MapPin, Download, Edit, Briefcase, CheckCircle2, Eye, Loader2, Camera } from "lucide-react"
import { UserProfile } from "@/lib/mock-api/user-profile"
import Link from "next/link"
import { useState, useRef, ChangeEvent } from "react"

interface ProfileHeaderProps {
    user: UserProfile["basic"]
    profileId?: string
    action?: React.ReactNode
    isEditing?: boolean
    onUpdateAvatar?: (url: string) => void
}

export function ProfileHeader({ user, profileId, action, isEditing, onUpdateAvatar }: ProfileHeaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const avatarInputRef = useRef<HTMLInputElement>(null)

    const handleAvatarClick = () => {
        if (!isEditing || !onUpdateAvatar) return
        avatarInputRef.current?.click()
    }

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !onUpdateAvatar) return

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file.")
            return
        }

        // Create a local URL for the uploaded image
        const objectUrl = URL.createObjectURL(file)
        onUpdateAvatar(objectUrl)
    }

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file.")
            return
        }

        setIsUploading(true)
        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsUploading(false)
        alert("Resume uploaded successfully!")

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="bg-background border rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start w-full md:w-auto">
                <div className="relative group">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-md">
                        <AvatarImage src={user.avatar} alt={user.firstName} />
                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                            {user.firstName[0]}{user.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <button
                            onClick={handleAvatarClick}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <Camera className="w-8 h-8 text-white" />
                        </button>
                    )}
                </div>

                <div className="text-center md:text-left space-y-2 flex-1">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold font-heading">{user.firstName} {user.lastName}</h1>
                        <p className="text-lg text-muted-foreground font-medium">{user.title}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                            <MapPin className="w-4 h-4" />
                            <span>{user.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                            <Briefcase className="w-4 h-4" />
                            <span>{user.experienceLevel}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{user.jobType}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-72 space-y-4 bg-muted/30 p-4 rounded-xl border border-muted/50 relative">
                {action && (
                    <div className="absolute top-2 right-2">
                        {action}
                    </div>
                )}

                <div className="space-y-2 pt-6"> {/* Added padding top for the absolute action if needed, or I can flow it */}
                    <div className="flex justify-between text-sm font-medium">
                        <span>Profile Completion</span>
                        <span className="text-primary">{user.completion}%</span>
                    </div>
                    <Progress value={user.completion} className="h-2" />
                    <p className="text-xs text-muted-foreground">Complete your profile to increase visibility.</p>
                </div>

                <div className="space-y-2">
                    <input
                        type="file"
                        className="hidden"
                        ref={avatarInputRef}
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="application/pdf"
                        onChange={handleFileUpload}
                    />
                    <Button
                        variant="outline"
                        className="w-full relative"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Upload Resume
                            </>
                        )}
                    </Button>
                    <Link href="/user/profile" className="block w-full">
                        <Button className="w-full" variant="secondary">
                            <Eye className="w-4 h-4 mr-2" />
                            View Public Profile
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
