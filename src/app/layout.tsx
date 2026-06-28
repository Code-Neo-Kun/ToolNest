import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SupportFloatingButton } from "@/components/ui/SupportButton";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ToolNest — Free Online Tools",
    template: "%s | ToolNest",
  },
  description:
    "ToolNest offers 50+ fast, free online tools for images, PDFs, text, developers, SEO, and more. No signup required.",
  keywords: ["free online tools", "image compressor", "json formatter", "pdf tools", "seo tools"],
  openGraph: {
    siteName: "ToolNest",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MMT2FDG4WS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MMT2FDG4WS');
          `}
        </Script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <SupportFloatingButton />
        <Analytics />
      </body>
    </html>
  );
}
