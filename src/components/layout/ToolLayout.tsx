import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Tool, CATEGORIES, getRelatedTools } from "@/lib/tools-registry";
import { ToolCard } from "@/components/ui/ToolCard";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  howToUse?: string[];
  faqs?: FAQItem[];
  className?: string;
}

export function ToolLayout({ tool, children, howToUse, faqs, className }: ToolLayoutProps) {
  const category = CATEGORIES[tool.category];
  const relatedTools = getRelatedTools(tool, 4);

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

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href={`/category/${tool.category}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {category.label}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-800 dark:text-slate-200">{tool.name}</span>
        </nav>

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl" role="img" aria-label={tool.name}>{tool.icon}</span>
            <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", category.color)}>
              {category.icon} {category.label}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{tool.name}</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">{tool.description}</p>
        </div>

        {/* Tool */}
        <div className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800", className)}>
          {children}
        </div>

        {/* How to use */}
        {howToUse && howToUse.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">How to Use</h2>
            <ol className="space-y-3">
              {howToUse.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {i + 1}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 pt-0.5">{step}</span>
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Related Tools</h2>
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
