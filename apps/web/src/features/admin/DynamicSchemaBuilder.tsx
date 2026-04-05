"use client"

import { useState } from "react"
import { motion, Reorder } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
    LayoutGrid, 
    Plus, 
    GripVertical, 
    Trash2, 
    Type, 
    Hash, 
    ListFilter, 
    CheckSquare, 
    Settings,
    Save,
    RefreshCw
} from "lucide-react"
import { toast } from "sonner"

const FIELD_TYPES = [
    { id: "text", label: "Text", icon: Type },
    { id: "number", label: "Number", icon: Hash },
    { id: "select", label: "Select", icon: ListFilter },
    { id: "checkbox", label: "Checkbox", icon: CheckSquare }
]

export function DynamicSchemaBuilder() {
    const [fields, setFields] = useState([
        { id: "1", field_key: "full_name", label: "FULL NAME", field_type: "text", required: true },
        { id: "2", field_key: "years_exp", label: "YEARS OF EXPERIENCE", field_type: "number", required: true },
        { id: "3", field_key: "primary_role", label: "PRIMARY ROLE", field_type: "select", required: true }
    ])
    const [isSaving, setIsSaving] = useState(false)

    const addField = () => {
        const newField = {
            id: Math.random().toString(36).substr(2, 9),
            field_key: "new_field_" + fields.length,
            label: "NEW FIELD",
            field_type: "text",
            required: false
        }
        setFields([...fields, newField])
        toast.info("New field added to schema draft")
    }

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id))
        toast.info("Field removed from schema")
    }

    const saveSchema = async () => {
        setIsSaving(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            toast.success("Profile schema synchronized to Global Registry!")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card className="border-white/5 bg-background/20 backdrop-blur-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-1">
                        <LayoutGrid className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl font-black tracking-tight uppercase">DYNAMIC SCHEMA BUILDER</CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={addField} className="border-white/10 hover:bg-white/5 font-black tracking-tighter">
                            <Plus className="w-4 h-4 mr-1" /> ADD FIELD
                        </Button>
                        <Button size="sm" onClick={saveSchema} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-tighter">
                            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                            PUBLISH REGISTRY
                        </Button>
                    </div>
                </div>
                <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                    Define and reorder universal profile fields for all candidates
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Reorder.Group axis="y" values={fields} onReorder={setFields} className="space-y-4">
                    {fields.map((field) => (
                        <Reorder.Item
                            key={field.id}
                            value={field}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 group"
                        >
                            <div className="cursor-grab active:cursor-grabbing text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors">
                                <GripVertical className="w-5 h-5" />
                            </div>
                            
                            <div className="grid grid-cols-12 gap-4 flex-1 items-center">
                                <div className="col-span-4 space-y-1">
                                    <Label className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">FIELD KEY</Label>
                                    <Input 
                                        value={field.field_key} 
                                        className="h-8 text-[11px] font-mono border-white/5 bg-white/5" 
                                        readOnly 
                                    />
                                </div>
                                <div className="col-span-4 space-y-1">
                                    <Label className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">UI LABEL</Label>
                                    <Input 
                                        value={field.label} 
                                        className="h-8 text-[11px] font-bold border-white/5 bg-white/5" 
                                        onChange={(e) => {
                                            const updated = fields.map(f => f.id === field.id ? { ...f, label: e.target.value.toUpperCase() } : f)
                                            setFields(updated)
                                        }}
                                    />
                                </div>
                                <div className="col-span-3 space-y-1">
                                    <Label className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">DATA TYPE</Label>
                                    <div className="flex gap-1">
                                        <Badge variant="secondary" className="text-[9px] h-8 w-full border-white/5 bg-white/5 font-black flex items-center justify-center gap-2">
                                            <Settings className="w-3 h-3" /> {field.field_type.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="col-span-1 pt-4">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => removeField(field.id)}
                                        className="h-8 w-8 text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </CardContent>
        </Card>
    )
}
