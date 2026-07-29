import type { Metadata } from "next";
import { TOOLS, CATEGORIES, type ToolCategory } from "@/lib/tools-registry";
import { ToolCard } from "@/components/ui/ToolCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Free Online Tools",
  description: `Browse all ${TOOLS.length}+ free online tools. Image, PDF, Text, Developer, SEO and Utility tools — no signup required.`,
};

export default function AllToolsPage() {
  const categories = Object.keys(CATEGORIES) as ToolCategory[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Tools</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {TOOLS.length} free tools across {categories.length} categories
        </p>
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((key) => {
          const cat = CATEGORIES[key];
          const count = TOOLS.filter((t) => t.category === key).length;
          return (
            <Link
              key={key}
              href={`#${key}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:hover:text-indigo-400"
            >
              {cat.icon} {cat.label} ({count})
            </Link>
          );
        })}
      </div>

      {categories.map((key) => {
        const cat = CATEGORIES[key];
        const tools = TOOLS.filter((t) => t.category === key);
        return (
          <section key={key} id={key} className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{cat.icon}</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{cat.label}</h2>
              <span className="ml-auto text-sm text-slate-400">{tools.length} tools</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
