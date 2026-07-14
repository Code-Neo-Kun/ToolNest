import type { Metadata } from "next";
import { searchTools } from "@/lib/tools-registry";
import { ToolCard } from "@/components/ui/ToolCard";
import Link from "next/link";
import { Search } from "lucide-react";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  return {
    title: query ? `"${query}" — Search Tools` : "Search Tools",
    description: query
      ? `Free online tool search results for "${query}" on ToolNest.`
      : "Search 50+ free online tools on ToolNest — images, text, developer utilities, SEO, and more.",
    // Canonical always points to /search without the query — search result
    // pages should never be indexed with parameters in the URL.
    alternates: {
      canonical: "/search",
    },
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? searchTools(query) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <form action="/search" method="GET">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search for a tool..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              aria-label="Search tools"
              autoFocus
            />
          </div>
        </form>
      </div>

      {query ? (
        <>
          <p className="mb-6 text-sm text-slate-500">
            {results.length === 0
              ? `No results for "${query}"`
              : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">
                Try a different search term or browse all tools.
              </p>
              <Link
                href="/all-tools"
                className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Browse All Tools
              </Link>
            </div>
          )}
        </>
      ) : (
        <p className="text-slate-500">Type something to search tools.</p>
      )}
    </div>
  );
}
