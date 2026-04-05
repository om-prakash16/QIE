import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase } from "lucide-react"

export default function PostJobPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold font-heading mb-4">Post a Job</h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-8">
                Recruiter dashboard and job posting features are currently in development. Cehck back soon!
            </p>
            <div className="flex gap-4">
                <Button asChild><Link href="/pricing">View Pricing</Link></Button>
                <Button variant="outline" asChild><Link href="/">Back Home</Link></Button>
            </div>
        </div>
    )
}
