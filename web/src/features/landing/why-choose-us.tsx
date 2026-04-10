import { Shield, Target, Zap, Smile } from "lucide-react"

const features = [
    {
        icon: Target,
        title: "Precision Matching",
        description: "Our AI-driven algorithms connect you with jobs that perfectly align with your skills and career goals."
    },
    {
        icon: Shield,
        title: "Verified Companies",
        description: "We thoroughly vet every employer to ensure a safe and professional job hunting experience."
    },
    {
        icon: Zap,
        title: "Fast Applications",
        description: "Apply to multiple jobs with a single click using your stored profile and resume."
    },
    {
        icon: Smile,
        title: "Career Support",
        description: "Get access to resume reviews, interview prep, and salary insights to boost your chances."
    }
]

export function WhyChooseUs() {
    return (
        <section className="py-20 bg-background">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16 px-4">
                    <h2 className="text-4xl font-bold font-heading mb-4">Why Best Hiring Tool?</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">We are more than just a job board. We are your partner in career growth.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/20 border border-transparent hover:border-primary/20 hover:bg-muted/40 transition-colors">
                            <div className="p-3 bg-primary/10 text-primary rounded-xl mb-4">
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
