'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Users, 
  Mail, 
  Phone, 
  FileText, 
  Github, 
  Globe 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const FIELDS = [
  { id: 'email', label: 'Email Address', icon: Mail },
  { id: 'phone', label: 'Phone Number', icon: Phone },
  { id: 'resume', label: 'Resume / CV', icon: FileText },
  { id: 'github', label: 'GitHub Activity', icon: Github },
  { id: 'portfolio', label: 'Portfolio site', icon: Globe },
];

export function PrivacyToggles() {
  const [globalVisibility, setGlobalVisibility] = useState('public');

  return (
    <div className="space-y-8">
      <Card className="p-6 bg-primary/5 border-primary/20 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
               <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
               <p className="font-bold text-base">Global Profile Status</p>
               <p className="text-xs text-muted-foreground italic">Master switch for your Best Hiring Tool discovery presence.</p>
            </div>
          </div>
          <Select value={globalVisibility} onValueChange={setGlobalVisibility}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">🌍 Public</SelectItem>
              <SelectItem value="recruiters_only">👔 Recruiters Only</SelectItem>
              <SelectItem value="private">🔒 Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid gap-4">
        {FIELDS.map((field) => (
          <Card key={field.id} className="p-5 bg-card/20 border-primary/10 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center">
                  <field.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <Label className="text-sm font-bold tracking-tight">{field.label}</Label>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Visibility: {field.id === 'email' ? 'Private' : 'Shared'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                 <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Hide field</span>
                    <Switch />
                 </div>
                 <div className="h-4 w-[1px] bg-border hidden sm:block" />
                 <Select defaultValue="private">
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="recruiters">Recruiters</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
