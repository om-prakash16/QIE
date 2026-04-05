import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, Building2, Zap } from "lucide-react"

interface RoleSelectorProps {
    value: string
    onChange: (value: string) => void
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
    return (
        <RadioGroup defaultValue={value} onValueChange={onChange} className="grid grid-cols-2 gap-4">
            <div>
                <RadioGroupItem value="user" id="user" className="peer sr-only" />
                <Label
                    htmlFor="user"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                    <User className="mb-3 h-6 w-6" />
                    Job Seeker
                </Label>
            </div>
            <div>
                <RadioGroupItem value="company" id="company" className="peer sr-only" />
                <Label
                    htmlFor="company"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                    <Building2 className="mb-3 h-6 w-6" />
                    Company
                </Label>
            </div>
            <div className="col-span-2">
                <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                <Label
                    htmlFor="admin"
                    className="flex flex-row items-center justify-center gap-3 rounded-md border-2 border-dashed border-primary/20 bg-primary/5 p-4 hover:bg-primary/10 hover:border-primary/40 peer-data-[state=checked]:border-primary transition-all cursor-pointer"
                >
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="font-bold text-xs uppercase tracking-widest text-primary/80">Dev: System Admin</span>
                </Label>
            </div>
        </RadioGroup>
    )
}
