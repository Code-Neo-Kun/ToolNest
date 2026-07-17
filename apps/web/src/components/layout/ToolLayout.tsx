import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  type ToolDefinition,
  type ToolCategory,
  CATEGORIES,
  getRelatedTools,
} from "@/lib/tools-registry";
import { TOOL_SEO } from "@/lib/tool-seo-data";
import { ToolCard } from "@/components/ui/ToolCard";
import { cn } from "@/lib/utils";

// Same dark-mode-aware badge colors as ToolCard.
const CATEGORY_BADGE_COLORS: Record<ToolCategory, string> = {
  image:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50",
  text:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50",
  developer:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/50",
  seo:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700/50",
  utility:
    "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700/50",
  finance:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50",
  pdf:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50",
};

interface FAQItem {
  question: string;
  answer: string;
}

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
  howToUse?: string[];
  faqs?: FAQItem[];
  /** "Why use this" paragraph naming 2–3 concrete user types — shown above How-to section */
  whyUse?: string;
  className?: string;
}

export function ToolLayout({
  tool,
  children,
  howToUse: howToUseProp,
  faqs: faqsProp,
  whyUse: whyUseProp,
  className,
}: ToolLayoutProps) {
  const category = CATEGORIES[tool.category];
  const relatedTools = getRelatedTools(tool, 4);

  // Merge per-tool SEO data (from data file) with any inline props.
  // Inline props take precedence so individual tools can still override.
  const seo = TOOL_SEO[tool.slug];
  const howToUse = howToUseProp ?? seo?.howToUse;
  const faqs = faqsProp ?? seo?.faqs;
  const whyUse = whyUseProp ?? seo?.whyUse;
  const h2 = seo?.h2 ?? `Free Online ${tool.name}`;
  const intro = seo?.intro ?? tool.description;

  const faqSchema = faqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const howToSchema =
    howToUse && howToUse.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `How to use ${tool.name}`,
          description: tool.description,
          step: howToUse.map((step, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            text: step,
          })),
        }
      : null;

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `https://toolnest.app/tools/${tool.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "ToolNest",
      url: "https://toolnest.app",
    },
  };

  const breadcrumbSchema = {
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
        name: category.label,
        item: `https://toolnest.app/category/${tool.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: `https://toolnest.app/tools/${tool.slug}`,
      },
    ],
  };

  const schemas: object[] = [webAppSchema, breadcrumbSchema];
  if (howToSchema) schemas.push(howToSchema);
  if (faqSchema) schemas.push(faqSchema);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-sm text-slate-500"
        >
          <Link
            href="/"
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href={`/category/${tool.category}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {category.label}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-800 dark:text-slate-200">
            {tool.name}
          </span>
        </nav>

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl" role="img" aria-label={tool.name}>
              {tool.icon}
            </span>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                CATEGORY_BADGE_COLORS[tool.category],
              )}
            >
              {category.icon} {category.label}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {tool.name}
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            {tool.description}
          </p>
        </div>

        {/* Tool */}
        <div
          className={cn(
            "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800",
            className,
          )}
        >
          {children}
        </div>

        {/* How to use */}
        {howToUse && howToUse.length > 0 && (
          <section className="mt-10" aria-label="How to use">
            {/* SEO content block — visible copy for search snippet & rich results */}
            <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 px-5 py-5 dark:border-slate-700/60 dark:bg-slate-800/40">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {h2}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {intro}
              </p>
              {whyUse && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {whyUse}
                </p>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              How to Use
            </h3>
            <ol className="space-y-3">
              {howToUse.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {i + 1}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 pt-0.5">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* FAQs */}
        {faqs && faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50 list-none">
                    {faq.question}
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Related Tools
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {relatedTools.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
