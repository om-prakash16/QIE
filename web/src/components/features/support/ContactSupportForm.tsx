"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CheckCircle2, FileText, Mail, Phone } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    userType: z.enum(["job_seeker", "company", "visitor"]),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(20, "Message must be at least 20 characters"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export function ContactSupportForm() {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    })

    function onSubmit(data: ContactFormValues) {
        console.log("Support form data:", data)
        // Simulate API call
        setTimeout(() => setIsSubmitted(true), 1000)
    }

    return (
        <section id="contact" className="max-w-5xl mx-auto bg-background rounded-2xl border shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-5">

                {/* Contact Info Sidebar */}
                <div className="bg-slate-900 text-white p-8 md:col-span-2 flex flex-col justify-between">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">Get in touch</h3>
                        <p className="text-slate-300">
                            Our team is available Mon-Fri, 9am to 6pm IST. We usually respond within 24 hours.
                        </p>

                        <div className="space-y-4 pt-6">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary" />
                                <span>support@skillsutra.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary" />
                                <span>+91 80 1234 5678</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-primary" />
                                <span>Read Documentation</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 md:mt-0 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                        <p className="text-sm font-medium">"Top-notch support team! solved my billing issue in minutes."</p>
                        <p className="text-xs text-slate-400 mt-2">- Acme Corp</p>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8 md:p-12 md:col-span-3">
                    {isSubmitted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold">Message Sent!</h3>
                            <p className="text-muted-foreground max-w-xs">
                                Thanks for reaching out. We've received your message and will get back to you shortly.
                            </p>
                            <Button variant="outline" onClick={() => setIsSubmitted(false)} className="mt-4">
                                Send another message
                            </Button>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="userType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>I am a...</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="job_seeker">Job Seeker</SelectItem>
                                                        <SelectItem value="company">Employer / Recruiter</SelectItem>
                                                        <SelectItem value="visitor">Visitor</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Login issue..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe your issue in detail..."
                                                    className="resize-none min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full md:w-auto px-8">
                                    Send Message
                                </Button>
                            </form>
                        </Form>
                    )}
                </div>
            </div>
        </section>
    )
}
