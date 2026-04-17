import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-context";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { QueryProvider } from "@/components/providers/query-provider";
import { WalletProvider } from "@/components/providers/wallet-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CMSProvider } from "@/context/cms-context";
import { API_BASE_URL } from "@/lib/api/api-client";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetch(`${API_BASE_URL}/cms/seo`, { next: { revalidate: 3600 } });
    const data = await response.json();
    const seo = data.reduce((acc: any, item: any) => {
      acc[item.content_key] = item.content_value;
      return acc;
    }, {});

    return {
      title: seo.default_title || "Best Hiring Tool | Standardizing Global Talent",
      description: seo.default_description || "career verification and sovereign professional identity.",
      keywords: seo.keywords || "blockchain, ai hiring, solana",
    };
  } catch (e) {
    return {
      title: "Best Hiring Tool | Standardizing Global Talent",
      description: "career verification and sovereign professional identity.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} scroll-smooth`}>
      <body className="antialiased font-sans bg-background text-foreground selection:bg-primary/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <QueryProvider>
              <AuthProvider>
                <CMSProvider>
                  <SmoothScroll />
                  <Navbar />
                  <main className="flex-1 w-full relative min-h-screen">
                    {children}
                  </main>
                  <Footer />
                </CMSProvider>
              </AuthProvider>
            </QueryProvider>
          </WalletProvider>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
