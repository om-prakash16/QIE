"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PostJobPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    
    const [formData, setFormData] = useState({
        title: "",
        company_name: user?.name || "",
        location: "",
        job_type: "Full-time",
        experience_level: "Mid-level",
        salary_range: "",
        description: "",
        requirements: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setIsLoading(true)
        try {
            const { error } = await supabase
                .from('jobs')
                .insert({
                    title: formData.title,
                    company_name: formData.company_name,
                    location: formData.location,
                    job_type: formData.job_type,
                    experience_level: formData.experience_level,
                    salary_range: formData.salary_range,
                    description: formData.description,
                    requirements: formData.requirements.split('\n').filter(r => r.trim() !== ''),
                    status: 'active',
                    posted_by: user.id
                })

            if (error) throw error

            toast.success("Job posted successfully!")
            router.push("/company/dashboard")
        } catch (error: any) {
            toast.error(`Error posting job: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-heading">Post a New Job</h1>
                <p className="text-muted-foreground">Fill out the details below to attract top Web3 talent.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        Job Details
                    </CardTitle>
                    <CardDescription>Provide clear and concise details about the role.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title *</Label>
                                <Input id="title" name="title" required placeholder="e.g. Senior Smart Contract Engineer" value={formData.title} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company_name">Company Name *</Label>
                                <Input id="company_name" name="company_name" required value={formData.company_name} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" placeholder="e.g. Remote, NY" value={formData.location} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Job Type</Label>
                                <Select value={formData.job_type} onValueChange={(val) => handleSelectChange('job_type', val)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Freelance">Freelance</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Experience Level</Label>
                                <Select value={formData.experience_level} onValueChange={(val) => handleSelectChange('experience_level', val)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Entry-level">Entry-level</SelectItem>
                                        <SelectItem value="Mid-level">Mid-level</SelectItem>
                                        <SelectItem value="Senior">Senior</SelectItem>
                                        <SelectItem value="Lead">Lead</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salary_range">Salary Range</Label>
                            <Input id="salary_range" name="salary_range" placeholder="e.g. 100,000 - 150,000 USDC" value={formData.salary_range} onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description *</Label>
                            <Textarea 
                                id="description" 
                                name="description" 
                                required 
                                rows={5} 
                                placeholder="Describe the role and responsibilities..."
                                value={formData.description} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirements">Requirements (One per line)</Label>
                            <Textarea 
                                id="requirements" 
                                name="requirements" 
                                rows={4} 
                                placeholder="3+ years Rust experience&#10;Familiarity with Anchor&#10;Strong English communication"
                                value={formData.requirements} 
                                onChange={handleChange} 
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</> : "Publish Job"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
