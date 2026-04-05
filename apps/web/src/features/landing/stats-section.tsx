import { STATS } from "@/lib/mock-data"

export function StatsSection() {
    return (
        <section className="py-12 bg-muted transition-colors">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((stat, index) => (
                        <div key={index} className={`text-center space-y-2 relative ${index !== STATS.length - 1 ? 'md:after:content-[""] md:after:absolute md:after:right-0 md:after:top-1/2 md:after:-translate-y-1/2 md:after:h-12 md:after:w-px md:after:bg-border' : ''}`}>
                            <div className="text-4xl font-bold font-heading text-primary">{stat.value}</div>
                            <div className="text-muted-foreground font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
