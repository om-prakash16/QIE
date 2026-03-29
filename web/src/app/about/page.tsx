import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Code2,
    Target,
    Shield,
    Users,
    GitBranch,
    BarChart3,
    Search,
    CheckCircle2
} from "lucide-react"

export const metadata: Metadata = {
    title: "About | Skillsutra",
    description: "A modern approach to hiring and career clarity.",
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* 1. Page Header */}
            <section className="pt-20 pb-12 md:pt-24 md:pb-16 bg-muted/20 border-b">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 tracking-tight">About</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                        A modern approach to hiring and career clarity.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-3xl space-y-16 py-12">

                {/* 2. What This Platform Does */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold font-heading tracking-tight">Platform Overview</h2>
                    <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-7">
                        <p>
                            Skillsutra is a specialized platform designed to bridge the gap between engineering talent and forward-thinking companies. By integrating direct data sources like GitHub, we move beyond static resumes to offer a dynamic, proof-based representation of technical skill.
                        </p>
                        <p>
                            We provide a dual-sided ecosystem: developers gain visibility based on their actual code and contributions, while companies access a signal-rich talent pool. The platform emphasizes salary transparency, role fit, and technical proficiency to facilitate meaningful professional connections.
                        </p>
                    </div>
                </section>

                <Separator />

                {/* 3. Who It Is For */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold font-heading tracking-tight mb-6">Who It Is For</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-muted/10 border-muted-foreground/20">
                            <CardHeader>
                                <Users className="w-8 h-8 text-primary mb-2" />
                                <CardTitle>Job Seekers</CardTitle>
                                <CardDescription>Developers & Engineers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <span>Discover deeply relevant roles</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <span>Showcase skills beyond the resume</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <span>Gain market and career insights</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/10 border-muted-foreground/20">
                            <CardHeader>
                                <Target className="w-8 h-8 text-primary mb-2" />
                                <CardTitle>Recruiters & Companies</CardTitle>
                                <CardDescription>Hiring Teams & Managers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <span>Find signal-driven talent</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <span>Reduce noise in the hiring funnel</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <span>Evaluate real engineering work</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <Separator />

                {/* 4. What Makes It Different */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold font-heading tracking-tight">Key Differentiators</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex gap-4 p-4 rounded-lg border bg-card">
                            <GitBranch className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">GitHub-Based Analysis</h3>
                                <p className="text-sm text-muted-foreground">Evaluates technical strengths directly from source code activity and repository history.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-lg border bg-card">
                            <Code2 className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">Project-Focused Profiles</h3>
                                <p className="text-sm text-muted-foreground">Highlights complexity, tech stacks, and contributions rather than just job titles.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-lg border bg-card">
                            <BarChart3 className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">Transparent Insights</h3>
                                <p className="text-sm text-muted-foreground">Provides clear, data-backed visibility into salaries and market role trends.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-lg border bg-card">
                            <Search className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">AI-Assisted Evaluation</h3>
                                <p className="text-sm text-muted-foreground">Leverages recruiter-grade heuristics to assess role fit and technical maturity.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* 5. Product Philosophy */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold font-heading tracking-tight">Product Philosophy</h2>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <div>
                                <span className="font-semibold text-foreground">Signal over Keywords.</span>
                                <p className="text-muted-foreground text-sm mt-1">
                                    We prioritize verifiable data and demonstrated capability over resume keyword stuffing.
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <div>
                                <span className="font-semibold text-foreground">Clarity over Volume.</span>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Our goal is high-relevance connections rather than maximizing application numbers.
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <div>
                                <span className="font-semibold text-foreground">Honest Scope.</span>
                                <p className="text-muted-foreground text-sm mt-1">
                                    We commit to data transparency and presenting professional information without bias.
                                </p>
                            </div>
                        </li>
                    </ul>
                </section>

                <Separator />

                {/* 6. Roadmap & Vision */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold font-heading tracking-tight">Roadmap & Vision</h2>
                    <Card className="bg-muted/5 border-none shadow-none">
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground mb-4 font-medium">
                                We are actively working towards:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                                <li>Improving the fidelity of technical hiring signals through deeper static analysis.</li>
                                <li>Expanding developer intelligence features to support automated vetting workflows.</li>
                                <li>Broadening support for both early-career potential and experienced staff-level engineering roles.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                {/* 7. Closing Note */}
                <section className="pt-4">
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
                        <div className="flex gap-4 items-start">
                            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                <span className="font-semibold text-foreground">Commitment to Quality:</span> Skillsutra is built with a professional intent: to make the hiring ecosystem more efficient, fair, and data-driven. We are committed to continuous improvement, refining our tools to serve the evolving needs of the technical industry.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}
