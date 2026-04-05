import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MapPin, Download, Mail, Briefcase, CheckCircle2, MessageSquare } from "lucide-react"
import { UserProfile } from "@/lib/mock-api/user-profile"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface PublicProfileHeaderProps {
    user: UserProfile["basic"]
}

export function PublicProfileHeader({ user }: PublicProfileHeaderProps) {
    return (
        <div className="bg-background border rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start w-full md:w-auto">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-md">
                    <AvatarImage src={user.avatar} alt={user.firstName} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                        {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                </Avatar>

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

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Contact {user.firstName}</DialogTitle>
                            <DialogDescription>
                                Send a message or view contact details below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-muted-foreground">Email</Label>
                                <div className="col-span-3 font-medium select-all">{user.email}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-muted-foreground">Phone</Label>
                                <div className="col-span-3 font-medium select-all">{user.phone}</div>
                            </div>
                            <div className="border-t my-2" />
                            <div className="space-y-2">
                                <Label>Send a message</Label>
                                <Input placeholder="Subject" />
                                <Textarea placeholder="Hi, I'd like to discuss a job opportunity..." className="min-h-[100px]" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Send Message</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button className="w-full sm:w-auto" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                </Button>
            </div>
        </div>
    )
}
