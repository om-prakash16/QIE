import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

interface FAQItem {
    question: string
    answer: string
}

interface FAQAccordionProps {
    items: FAQItem[]
}

export function FAQAccordion({ items }: FAQAccordionProps) {
    return (
        <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                    {items.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="text-left font-medium text-base">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}
