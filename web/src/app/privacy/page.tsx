import { Separator } from "@/components/ui/separator"
import { Shield, Lock, Eye, FileText, Mail } from "lucide-react"

export const metadata = {
    title: "Privacy Policy | Best Hiring Tool",
    description: "Read our Privacy Policy to understand how we collect, use, and protect your data.",
}

function Section({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) {
    return (
        <section className="space-y-4 py-6">
            <div className="flex items-center gap-3">
                {Icon && <div className="p-2 bg-primary/10 rounded-lg text-primary"><Icon className="w-5 h-5" /></div>}
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed space-y-4 pl-1">
                {children}
            </div>
            <Separator className="mt-8 opacity-50" />
        </section>
    )
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-muted/5 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto bg-background rounded-2xl shadow-sm border p-8 md:p-12">

                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold font-heading">Privacy Policy</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Your privacy is important to us. This policy outlines how Best Hiring Tool collects, uses, and protects your personal information.
                    </p>
                    <p className="text-sm font-medium text-muted-foreground pt-2">
                        Last Updated: December 18, 2024
                    </p>
                </div>

                <div className="space-y-2">
                    <Section title="1. Introduction">
                        <p>
                            Welcome to Best Hiring Tool. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at privacy@the-best-hiring-tool.com.
                        </p>
                        <p>
                            When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy policy, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
                        </p>
                    </Section>

                    <Section title="2. Information We Collect" icon={Eye}>
                        <p>We collect personal information that you voluntarily provide to us when registering at the Services likely to be interested in obtaining information about us or our products and services, when participating in activities on the Services or otherwise contacting us.</p>

                        <h3 className="text-lg font-semibold text-foreground mt-4">Personal Information Provided by You</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Identity Data:</strong> Name, username, or similar identifier.</li>
                            <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
                            <li><strong>Professional Data:</strong> Resume/CV, employment history, education history, and skills.</li>
                            <li><strong>Credentials:</strong> Passwords, password hints, and similar security information used for authentication and account access.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-foreground mt-4">Information Automatically Collected</h3>
                        <p>We automatically collect certain information when you visit, use or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services and other technical information.</p>
                    </Section>

                    <Section title="3. How We Use Your Information" icon={FileText}>
                        <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To facilitate account creation and logon process.</li>
                            <li>To send you marketing and promotional communications.</li>
                            <li>To fulfill and manage your job applications and saved jobs.</li>
                            <li>To post testimonials.</li>
                            <li>To request feedback.</li>
                            <li>To enable user-to-user communications.</li>
                            <li>To enforce our terms, conditions, and policies.</li>
                        </ul>
                    </Section>

                    <Section title="4. Data Sharing and Disclosure" icon={Lock}>
                        <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Employers/Recruiters:</strong> If you apply for a job, your profile and resume data will be shared with the specific employer.</li>
                            <li><strong>Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work.</li>
                            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                        </ul>
                    </Section>

                    <Section title="5. Data Security">
                        <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the services within a secure environment.</p>
                    </Section>

                    <Section title="6. Your Privacy Rights">
                        <p>In some regions (like the European Economic Area), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.</p>
                        <p>To make such a request, please use the contact details provided below. We will consider and act upon any request in accordance with applicable data protection laws.</p>
                    </Section>

                    <Section title="7. Contact Us" icon={Mail}>
                        <p>If you have questions or comments about this policy, you may email us at privacy@the-best-hiring-tool.com or by post to:</p>
                        <address className="not-italic mt-2 p-4 bg-muted rounded-lg border">
                            <strong>Best Hiring Tool Inc.</strong><br />
                            123 Tech Park, Cyber City<br />
                            Bangalore, Karnataka 560100<br />
                            India
                        </address>
                    </Section>

                </div>
            </div>
        </div>
    )
}
