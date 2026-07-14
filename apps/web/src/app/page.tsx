import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { TOOLS, CATEGORIES, getPopularTools } from "@/lib/tools-registry";
import { ToolCard } from "@/components/ui/ToolCard";

export const metadata: Metadata = {
  // Title omits the template suffix — this IS the homepage, use the full brand name.
  title: "ToolNest — Free Online Tools",
  description:
    `${TOOLS.length}+ free online tools for images, text, developers, SEO, finance, and more. ` +
    "Instant results in your browser — no signup, no ads, no file uploads to any server.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ToolNest — Free Online Tools",
    description:
      `${TOOLS.length}+ free online tools — images, text, developer utilities, SEO, finance calculators. ` +
      "No signup required.",
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
};

export default function HomePage() {
  const popularTools = getPopularTools();
  const newTools = TOOLS.filter((t) => t.isNew);

  // ItemList structured data for popular tools — helps Google display sitelinks
  const itemListSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Popular Free Online Tools",
    description: `${TOOLS.length}+ free online tools — no signup required`,
    numberOfItems: popularTools.length,
    itemListElement: popularTools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      description: tool.description,
      url: `https://toolnest.app/tools/${tool.slug}`,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: itemListSchema }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Zap className="h-3.5 w-3.5" />
            {TOOLS.length}+ free tools — no signup required
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            Every Tool You Need,{" "}
            <span className="text-indigo-600">All in One Place</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Fast, free online tools for images, PDFs, text, developer utilities,
            SEO, and more. No ads, no registration, no nonsense.
          </p>

          {/* Search */}
          <form
            className="mt-8 mx-auto flex max-w-lg gap-2"
            action="/search"
            method="GET"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                type="search"
                placeholder={`Search ${TOOLS.length}+ tools...`}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                aria-label="Search tools"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick links */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
            Popular:
            {popularTools.slice(0, 5).map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:hover:text-indigo-400"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-y border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm text-slate-600 dark:text-slate-400">
            {[
              {
                icon: <Zap className="h-4 w-4 text-indigo-500" />,
                text: "Instant results",
              },
              {
                icon: <Shield className="h-4 w-4 text-emerald-500" />,
                text: "No file uploads to server",
              },
              {
                icon: <Globe className="h-4 w-4 text-blue-500" />,
                text: "Works in any browser",
              },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {f.icon}
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const count = TOOLS.filter((t) => t.category === key).length;
              return (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition-all hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500"
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400">
                    {cat.label}
                  </span>
                  <span className="text-xs text-slate-400">{count} tools</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-8 bg-slate-50 dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Popular Tools
            </h2>
            <Link
              href="/all-tools"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* New Tools */}
      {newTools.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                🆕 New Tools
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {newTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-indigo-600 dark:bg-indigo-700">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            All tools are completely free
          </h2>
          <p className="mt-3 text-indigo-200">
            No account needed. Just open a tool and start working.
          </p>
          <Link
            href="/all-tools"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            Explore All {TOOLS.length} Tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
