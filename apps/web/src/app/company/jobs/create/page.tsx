"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Job title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    skills: z.string().min(2, {
        message: "Please add at least one skill."
    }),
    location: z.string().min(2, {
        message: "Location is required."
    }),
    type: z.string({
        required_error: "Please select a job type.",
    }),
    experience: z.string({
        required_error: "Please select experience level.",
    }),
    salary: z.string().optional(),
})

export default function CreateJobPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            skills: "",
            location: "",
            salary: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        console.log(values)
        toast.success("Job posted successfully!")
        setIsLoading(false)
        router.push("/company/jobs")
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Link href="/company/jobs">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold font-heading tracking-tight">Post a New Job</h1>
                    <p className="text-muted-foreground">Find your next great hire.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Fill in the requirements for the position.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Senior Frontend Engineer" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                                    <SelectItem value="Contract">Contract</SelectItem>
                                                    <SelectItem value="Freelance">Freelance</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="experience"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Experience Level</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                                                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                                                    <SelectItem value="Senior Level">Senior Level</SelectItem>
                                                    <SelectItem value="Director">Director/Executive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. San Francisco (Remote)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="salary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Salary Range (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. $120k - $150k" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="skills"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Required Skills</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. React, TypeScript, Node.js (Comma separated)" {...field} />
                                        </FormControl>
                                        <FormDescription>Separate multiple skills with commas.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe role responsibilities, requirements, and benefits..."
                                                className="min-h-[200px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-4 pt-4">
                                <Link href="/company/jobs">
                                    <Button type="button" variant="ghost">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Create Job Post
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
