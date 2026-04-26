import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MapPin, Clock, DollarSign, Briefcase, Bookmark } from "lucide-react"
import Link from "next/link"

interface JobCardProps {
    job: {
        id: string
        title: string
        company: string
        location: string
        type: string
        salary: string
        postedAt: string
        tags: string[]
        description?: string
        rating?: number
        reviews?: number
        experience?: string
        openings?: number
        applicants?: string
        roleCategory?: string
        education?: string
        keySkills?: string[]
    }
}

export function JobCard({ job }: JobCardProps) {
    const createSlug = (title: string, company: string, id: string) => {
        const slug = `${title}-${company}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        return `/jobs/${slug}-${id}`
    }

    return (
        <Card className="group relative overflow-hidden glass border-white/5 hover:border-primary/40 transition-all duration-500 rounded-[2.5rem] shadow-2xl hover:shadow-primary/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full group-hover:bg-primary/10 transition-colors" />
            
            <CardHeader className="relative overflow-hidden pt-10 px-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-xl font-black text-white/20 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 shadow-inner italic">
                        {job.company.substring(0, 2)}
                    </div>
                    <Badge variant="outline" className="glass bg-white/5 text-white/30 border-white/10 text-[9px] font-black uppercase tracking-widest py-1.5 px-4 rounded-xl group-hover:border-primary/20 group-hover:text-primary transition-all">
                        {job.type}
                    </Badge>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{job.company}</p>
                    <Link href={createSlug(job.title, job.company, job.id)}>
                        <h3 className="text-2xl font-black tracking-tight leading-none text-white uppercase italic group-hover:text-primary transition-all duration-500">
                            {job.title}
                        </h3>
                    </Link>
                </div>
            </CardHeader>

            <CardContent className="pb-8 px-8 space-y-8 relative z-10">
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-[9px] font-black uppercase tracking-widest text-white/30">
                    {job.experience && (
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-primary/50" />
                            <span>{job.experience}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 text-primary/50" />
                        <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary/50" />
                        <span>{job.location}</span>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap pt-1">
                    {job.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="glass border-white/10 text-[9px] text-white/40 font-black uppercase tracking-widest py-1.5 px-3 rounded-lg group-hover:border-primary/20 group-hover:text-primary/60 transition-colors">
                            {tag}
                        </Badge>
                    ))}
                    {job.tags.length > 3 && (
                        <span className="text-[9px] text-white/10 font-black tracking-widest uppercase py-1">+{job.tags.length - 3}</span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-8 pt-6 border-t border-white/5 mt-auto relative z-10 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/20">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{job.postedAt}</span>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/5 text-white/20 hover:text-primary hover:bg-primary/10 transition-all">
                        <Bookmark className="w-5 h-5" />
                    </Button>
                    <Link href={createSlug(job.title, job.company, job.id)}>
                        <Button variant="premium" size="sm" className="h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest">
                            DETAILS
                        </Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
