import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Building2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoleSelectorProps {
    value: string
    onChange: (value: string) => void
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
    return (
        <RadioGroup defaultValue={value} onValueChange={onChange} className="grid grid-cols-2 gap-4">
            <div className="relative">
                <RadioGroupItem value="user" id="user" className="peer sr-only" />
                <Label
                    htmlFor="user"
                    className={cn(
                        "flex flex-col items-center justify-center rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98]",
                        value === "user" 
                            ? "border-primary bg-primary/[0.08] shadow-[0_20px_40px_-15px_rgba(var(--primary),0.2)]" 
                            : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10"
                    )}
                >
                    {value === "user" && (
                        <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-primary animate-in zoom-in duration-300 fill-primary/10" />
                    )}
                    <div className={cn(
                        "p-4 rounded-xl mb-4 transition-all duration-300",
                        value === "user" ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110" : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground"
                    )}>
                        <User className="w-6 h-6" />
                    </div>
                    <span className={cn(
                        "font-black tracking-tight text-lg",
                        value === "user" ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                        Job Seeker
                    </span>
                    <p className="text-[10px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-widest">
                        Individual Talent
                    </p>
                </Label>
            </div>

            <div className="relative">
                <RadioGroupItem value="company" id="company" className="peer sr-only" />
                <Label
                    htmlFor="company"
                    className={cn(
                        "flex flex-col items-center justify-center rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98]",
                        value === "company" 
                            ? "border-primary bg-primary/[0.08] shadow-[0_20px_40px_-15px_rgba(var(--primary),0.2)]" 
                            : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10"
                    )}
                >
                    {value === "company" && (
                        <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-primary animate-in zoom-in duration-300 fill-primary/10" />
                    )}
                    <div className={cn(
                        "p-4 rounded-xl mb-4 transition-all duration-300",
                        value === "company" ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110" : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground"
                    )}>
                        <Building2 className="w-6 h-6" />
                    </div>
                    <span className={cn(
                        "font-black tracking-tight text-lg",
                        value === "company" ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                        Company
                    </span>
                    <p className="text-[10px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-widest">
                        Hirer / Recruiter
                    </p>
                </Label>
            </div>
        </RadioGroup>
    )
}
