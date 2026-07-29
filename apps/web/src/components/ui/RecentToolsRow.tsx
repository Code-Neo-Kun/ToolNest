"use client";
/**
 * Shows a "Recently used" row on the homepage.
 * Reads from localStorage — renders nothing on SSR/first paint.
 */
import Link from "next/link";
import { Clock, X } from "lucide-react";
import { useRecentTools } from "@/hooks/useRecentTools";
import { getToolBySlug } from "@/lib/tools-registry";

export function RecentToolsRow() {
  const { recent, clearRecent } = useRecentTools();

  const tools = recent
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean) as ReturnType<typeof getToolBySlug>[];

  if (tools.length === 0) return null;

  return (
    <section className="py-6 border-b border-slate-100 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Clock className="h-4 w-4 text-slate-400" />
            Recently Used
          </h2>
          <button
            onClick={clearRecent}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <Link
              key={tool!.slug}
              href={`/tools/${tool!.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
            >
              <span className="text-base leading-none">{tool!.icon}</span>
              {tool!.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
