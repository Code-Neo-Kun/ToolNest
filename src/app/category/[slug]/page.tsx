import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getToolsByCategory, type ToolCategory } from "@/lib/tools-registry";
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
  return {
    title: `${cat.label} — Free Online Tools`,
    description: `${cat.description}. ${getToolsByCategory(slug as ToolCategory).length} free tools available.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = CATEGORIES[slug as ToolCategory];
  if (!cat) notFound();

  const tools = getToolsByCategory(slug as ToolCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-800 dark:text-slate-200">{cat.label}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{cat.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{cat.label}</h1>
            <p className="text-slate-600 dark:text-slate-400">{cat.description}</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-2">{tools.length} tools available</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
