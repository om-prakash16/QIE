'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SendHorizontal, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export function ContactSupportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    console.log('Form data:', values);
    await new Promise(r => setTimeout(r, 1500));
    
    toast.success('Your message has been sent successfully! Our team will respond within 24 hours.', {
      style: { background: 'hsl(var(--card))', border: '1px solid hsl(var(--primary)/0.2)' }
    });
    
    setIsSubmitting(false);
    form.reset();
  }

  return (
    <Card className="max-w-2xl mx-auto p-12 bg-card/20 border-primary/10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-700" />
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tight mb-2">Send us a message</h2>
        <p className="text-muted-foreground font-medium">Have a specific question? Our support team is ready to assist.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground/80">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="bg-background/50 h-11" {...field} />
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
                  <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground/80">Work Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" className="bg-background/50 h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground/80">How can we help?</FormLabel>
                <FormControl>
                  <Input placeholder="Subject of your request" className="bg-background/50 h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground/80">Message Details</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us more about your issue..." className="bg-background/50 min-h-[140px] resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90">
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <SendHorizontal className="w-5 h-5 mr-2" />
            )}
            {isSubmitting ? 'Sending Request...' : 'Submit Support Request'}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
