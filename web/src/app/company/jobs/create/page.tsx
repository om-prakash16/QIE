"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus, Trash2, Brain, Sparkles, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api/api-client"
import { useAuth } from "@/context/auth-context"

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
    type: z.string().min(1, "Please select a job type."),
    experience: z.string().min(1, "Please select experience level."),
    salary: z.string().optional(),
    assessment_questions: z.array(z.object({
        question_text: z.string().min(5, "Question must be at least 5 chars"),
        options: z.array(z.string().min(1, "Option cannot be empty")).length(4, "Exactly 4 options required"),
        correct_option_index: z.coerce.number().min(0).max(3),
        points: z.coerce.number().min(1).max(100).default(10)
    })).default([])
})

export default function CreateJobPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isMagicLoading, setIsMagicLoading] = useState(false)

    const handleMagicImport = async (text: string) => {
        setIsMagicLoading(true);
        const tid = toast.loading("AI is parsing your Job Description...");
        try {
            const parsed = await api.jobs.parseJD(text);
            if (parsed.error) throw new Error(parsed.error);
            
            form.setValue("title", parsed.title || "");
            form.setValue("description", parsed.description || "");
            form.setValue("skills", (parsed.skills || []).join(", "));
            form.setValue("type", parsed.job_type || "");
            form.setValue("experience", parsed.experience_level || "");
            
            toast.success("Fields populated successfully!", { id: tid });
        } catch (err: any) {
            toast.error("Magic Import failed: " + (err.message || "Unknown error"), { id: tid });
        } finally {
            setIsMagicLoading(false);
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            skills: "",
            location: "",
            salary: "",
            assessment_questions: []
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "assessment_questions"
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const payload = {
                ...values,
                required_skills: values.skills.split(",").map(s => s.trim()).filter(Boolean),
                job_type: values.type,
                experience_level: values.experience,
                company_id: "pending", // Backend will resolve this via created_by
                created_by: user?.id
            }
            
            const response = await api.jobs.create(payload)
            console.log("[DEBUG] Job created:", response)
            
            toast.success("Job post with custom assessment published!")
            router.push("/company/jobs")
        } catch (err: any) {
            console.error("Failed to post job", err)
            toast.error(err.message || "Failed to post job. Please try again.")
        } finally {
            setIsLoading(false)
        }
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

            {/* Magic JD Import */}
            <Card className="bg-primary/5 border-primary/20 border-dashed">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-tight">Magic JD Import</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">AI-powered field extraction</p>
                            </div>
                        </div>
                        <Button 
                            type="button"
                            onClick={() => {
                                const raw = window.prompt("Paste your raw Job Description text here. AI will extract title, skills, and details.");
                                if (raw) handleMagicImport(raw);
                            }}
                            className="bg-primary text-white hover:bg-primary/90 rounded-xl px-6 h-10 font-black tracking-widest text-[10px] gap-2"
                        >
                            <Brain className="w-4 h-4" /> START MAGIC IMPORT
                        </Button>
                    </div>
                </CardContent>
            </Card>

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

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-bold flex items-center gap-2 tracking-tight">
                                            <Brain className="w-4 h-4 text-primary" />
                                            Custom Assessment
                                        </h3>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Verify specific technical requirements</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append({ question_text: "", options: ["", "", "", ""], correct_option_index: 0, points: 10 })}
                                        className="h-9 px-4 border-white/10 hover:bg-white/5 text-[10px] uppercase font-black tracking-widest gap-2"
                                    >
                                        <Plus className="w-3 h-3" /> Add Challenge
                                    </Button>
                                </div>

                                {fields.length > 0 ? (
                                    <Accordion type="single" collapsible className="space-y-3">
                                        {fields.map((field, index) => (
                                            <AccordionItem key={field.id} value={field.id} className="border border-white/10 rounded-xl px-4 bg-white/[0.02] overflow-hidden">
                                                <div className="flex items-center gap-3 py-1">
                                                    <AccordionTrigger className="flex-1 hover:no-underline py-3">
                                                        <div className="flex items-center gap-3 text-left">
                                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black">{index + 1}</div>
                                                            <span className="text-sm font-medium truncate max-w-[300px]">
                                                                {form.watch(`assessment_questions.${index}.question_text`) || "Draft Question..."}
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => remove(index)}
                                                        className="h-8 w-8 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <AccordionContent className="pt-0 pb-6 space-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`assessment_questions.${index}.question_text`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">The Question</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="e.g. Which of the following is a key feature of Rust's ownership system?" {...field} className="bg-white/5" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {[0, 1, 2, 3].map((optIndex) => (
                                                            <FormField
                                                                key={optIndex}
                                                                control={form.control}
                                                                name={`assessment_questions.${index}.options.${optIndex}`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                                                                            <span>Option {String.fromCharCode(65 + optIndex)}</span>
                                                                            {form.watch(`assessment_questions.${index}.correct_option_index`) === optIndex && (
                                                                                <span className="text-emerald-500 flex items-center gap-1 font-black italic tracking-tighter"><Sparkles className="w-2.5 h-2.5" /> Correct Answer</span>
                                                                            )}
                                                                        </FormLabel>
                                                                        <div className="flex items-center gap-2">
                                                                            <FormControl>
                                                                                <Input {...field} className={cn("bg-white/5", form.watch(`assessment_questions.${index}.correct_option_index`) === optIndex && "border-emerald-500/50 ring-1 ring-emerald-500/20")} />
                                                                            </FormControl>
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => form.setValue(`assessment_questions.${index}.correct_option_index`, optIndex)}
                                                                                className={cn(
                                                                                    "h-10 w-10 shrink-0 border border-white/5",
                                                                                    form.watch(`assessment_questions.${index}.correct_option_index`) === optIndex ? "bg-emerald-500 text-white" : "hover:bg-white/5 text-muted-foreground"
                                                                                )}
                                                                            >
                                                                                {String.fromCharCode(65 + optIndex)}
                                                                            </Button>
                                                                        </div>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <div className="border border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/[0.01]">
                                        <HelpCircle className="w-8 h-8 mx-auto mb-3 text-white/10" />
                                        <p className="text-xs text-muted-foreground italic">No custom challenges added. Only AI-generated MCQs will be used.</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 pt-8">
                                <Link href="/company/jobs">
                                    <Button type="button" variant="ghost" className="uppercase text-[10px] font-black tracking-widest">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={isLoading} className="h-12 px-8 shadow-xl shadow-primary/20">
                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    <span className="uppercase text-[10px] font-black tracking-[0.2em]">Deploy Pulse</span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
