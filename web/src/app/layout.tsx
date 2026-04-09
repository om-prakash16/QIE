import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetch(`${API_BASE_URL}/cms/seo`, { next: { revalidate: 3600 } });
    const data = await response.json();
    const seo = data.reduce((acc: any, item: any) => {
      acc[item.content_key] = item.content_value;
      return acc;
    }, {});

    return {
      title: seo.default_title || "this best hiring tool | Standardizing Global Talent",
      description: seo.default_description || "career verification and sovereign professional identity.",
      keywords: seo.keywords || "blockchain, ai hiring, solana",
    };
  } catch (e) {
    return {
      title: "this best hiring tool | Standardizing Global Talent",
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
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} antialiased font-sans bg-background text-foreground`}>
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
                  <div className="flex-1 w-full relative">
                    {children}
                  </div>
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
