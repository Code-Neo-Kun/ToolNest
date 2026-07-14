import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CATEGORIES,
  getToolsByCategory,
  type ToolCategory,
} from "@/lib/tools-registry";
import { ToolCard } from "@/components/ui/ToolCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES[slug as ToolCategory];
  if (!cat) return {};
  const count = getToolsByCategory(slug as ToolCategory).length;

  // Keep meta description under 160 chars.
  const rawDesc = `${count} free online ${cat.label.toLowerCase()} — ${cat.description} No signup required.`;
  const description = rawDesc.slice(0, 160);

  return {
    title: `${cat.label} — ${count} Free Online Tools`,
    description,
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title: `${cat.label} — ${count} Free Online Tools`,
      description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${cat.label} — ToolNest`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = CATEGORIES[slug as ToolCategory];
  if (!cat) notFound();

  const tools = getToolsByCategory(slug as ToolCategory);

  // BreadcrumbList + CollectionPage structured data
  const jsonLd = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://toolnest.app",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Categories",
          item: "https://toolnest.app/category",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: cat.label,
          item: `https://toolnest.app/category/${slug}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${cat.label} — Free Online Tools`,
      description: cat.description,
      url: `https://toolnest.app/category/${slug}`,
      numberOfItems: tools.length,
      hasPart: tools.map((tool) => ({
        "@type": "WebApplication",
        name: tool.name,
        description: tool.description,
        url: `https://toolnest.app/tools/${tool.slug}`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      })),
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-sm text-slate-500"
        >
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/category" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Categories
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-800 dark:text-slate-200">{cat.label}</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{cat.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {cat.label}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {tools.length} free tools — no signup required
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </>
  );
}
