import { Separator } from "@/components/ui/separator"
import { Scroll, Info, AlertOctagon, Scale, ShieldCheck } from "lucide-react"

export const metadata = {
    title: "Terms & Conditions | Best Hiring Tool",
    description: "Read our Terms & Conditions to understand the rules and guidelines for using our platform.",
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

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-muted/5 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto bg-background rounded-2xl shadow-sm border p-8 md:p-12">

                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                        <Scroll className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold font-heading">Terms & Conditions</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Please read these terms carefully before using our platform. By accessing Best Hiring Tool, you agree to be bound by these terms.
                    </p>
                    <p className="text-sm font-medium text-muted-foreground pt-2">
                        Last Updated: December 18, 2024
                    </p>
                </div>

                <div className="space-y-2">
                    <Section title="1. Introduction">
                        <p>
                            Welcome to Best Hiring Tool. These Terms and Conditions ("Terms") govern your use of our website, services, and applications (collectively, the "Platform"). By creating an account or using the Platform, you agree to comply with these Terms and our Privacy Policy.
                        </p>
                        <p>
                            If you do not agree with any part of these Terms, you must not use our services.
                        </p>
                    </Section>

                    <Section title="2. Definitions" icon={Info}>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>"Platform"</strong> refers to the Best Hiring Tool website and associated services.</li>
                            <li><strong>"User"</strong> refers to any individual or entity accessing the Platform.</li>
                            <li><strong>"Job Seeker"</strong> refers to Users searching for employment opportunities.</li>
                            <li><strong>"Employer"</strong>/<strong>"Recruiter"</strong> refers to Users posting job opportunities.</li>
                            <li><strong>"Content"</strong> refers to text, images, and data uploaded to the Platform.</li>
                        </ul>
                    </Section>

                    <Section title="3. Eligibility & Account Registration">
                        <p>
                            You must be at least 18 years old to use this Platform. By registering, you warrant that you have the legal capacity to enter into binding contracts.
                        </p>
                        <p>
                            You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for safeguarding your password and for all activities that occur under your account.
                        </p>
                    </Section>

                    <Section title="4. User Responsibilities" icon={ShieldCheck}>
                        <p>As a User of the Platform, you agree NOT to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Violate any applicable laws or regulations.</li>
                            <li>Post false, misleading, or fraudulent content.</li>
                            <li>Infringe upon the intellectual property rights of others.</li>
                            <li>Transmit viruses, malware, or any other harmful code.</li>
                            <li>Harass, stalk, or harm another User.</li>
                            <li>Use automated scripts or bots to scrape data without permission.</li>
                        </ul>
                    </Section>

                    <Section title="5. Job Listings & Employer Obligations">
                        <p>
                            Employers solely are responsible for the content of their job postings. Best Hiring Tool does not guarantee the validity of a job offer or the identity of an employer.
                        </p>
                        <p>
                            We reserve the right to remove any job listing that violates these Terms, is discriminatory, or is deemed inappropriate at our sole discretion, without refund.
                        </p>
                    </Section>

                    <Section title="6. Intellectual Property">
                        <p>
                            The Platform and its original content, features, and functionality are owned by Best Hiring Tool and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                    </Section>

                    <Section title="7. Limitation of Liability" icon={AlertOctagon}>
                        <p className="uppercase text-xs font-bold text-muted-foreground tracking-wider mb-2">Read Carefully</p>
                        <p>
                            To the fullest extent permitted by law, Best Hiring Tool shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Your access to or use of or inability to access or use the Platform.</li>
                            <li>Any conduct or content of any third party on the Platform.</li>
                            <li>Any content obtained from the Platform.</li>
                            <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
                        </ul>
                    </Section>

                    <Section title="8. Governing Law" icon={Scale}>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Bangalore, India.
                        </p>
                    </Section>

                    <Section title="9. Changes to Terms">
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                        </p>
                    </Section>

                    <Section title="10. Contact Us">
                        <p>If you have any questions about these Terms, please contact us:</p>
                        <address className="not-italic mt-2 p-4 bg-muted rounded-lg border">
                            <strong>Best Hiring Tool Legal Team</strong><br />
                            Email: legal@the-best-hiring-tool.com<br />
                            Phone: +91 80 1234 5678
                        </address>
                    </Section>

                </div>
            </div>
        </div>
    )
}
