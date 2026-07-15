import type { Metadata } from "next";
import { searchTools } from "@/lib/tools-registry";
import { ToolCard } from "@/components/ui/ToolCard";
import { SearchBox } from "@/components/ui/SearchBox";
import Link from "next/link";

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
      {/* Search box with live suggestions */}
      <div className="mb-8 max-w-xl">
        <SearchBox
          autoFocus
          defaultValue={query}
          placeholder="Search for a tool..."
        />
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
