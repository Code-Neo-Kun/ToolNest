import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SupportFloatingButton } from "@/components/ui/SupportButton";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadataBase resolves all relative URLs in `alternates.canonical`,
// `openGraph.images`, and `twitter.images` across every page.
export const metadataBase = new URL("https://toolnest.app");

export const metadata: Metadata = {
  title: {
    default: "ToolNest — Free Online Tools",
    template: "%s | ToolNest",
  },
  description:
    "ToolNest offers 50+ fast, free online tools for images, text, developers, SEO, finance, and more. No signup required.",
  keywords: [
    "free online tools",
    "image compressor",
    "json formatter",
    "seo tools",
    "developer tools",
    "text tools",
    "finance calculator",
  ],
  // Canonical for the root is set explicitly; child pages set their own.
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "ToolNest",
    type: "website",
    locale: "en_US",
    // /og-image.png must be created — see manual to-do.
    // Falls back to /globe.svg until a proper OG image is added.
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ToolNest — Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Organisation + WebSite structured data present on every page.
  // The logo URL must point to a real image (not globe.svg).
  const structuredData = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ToolNest",
      url: "https://toolnest.app",
      // Update logo to /og-image.png once created, or a dedicated logo PNG.
      logo: "https://toolnest.app/og-image.png",
      description:
        "ToolNest offers 50+ fast, free online tools for images, text, developers, SEO, finance, and more. No signup required.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@toolnest.app",
        contactType: "customer support",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: "https://toolnest.app",
      name: "ToolNest",
      description:
        "ToolNest offers 50+ fast, free online tools for images, text, developers, SEO, finance, and more. No signup required.",
      publisher: {
        "@type": "Organization",
        name: "ToolNest",
        url: "https://toolnest.app",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://toolnest.app/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
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
        {/* Skip to main content for keyboard / screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <SupportFloatingButton />
        <Analytics />
      </body>
    </html>
  );
}
