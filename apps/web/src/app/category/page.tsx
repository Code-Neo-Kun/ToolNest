import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, TOOLS, type ToolCategory } from "@/lib/tools-registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Tool Categories — Free Online Tools",
  description:
    "Find the right tool category for images, text, developer workflows, SEO, finance, and more. Browse all ToolNest categories — no signup required.",
  alternates: {
    canonical: "/category",
  },
  openGraph: {
    title: "Browse Tool Categories — Free Online Tools",
    description:
      "Find the right tool category for images, text, developer workflows, SEO, finance, and more. Browse all ToolNest categories.",
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

export default function CategoryIndexPage() {
  const categories = Object.keys(CATEGORIES) as ToolCategory[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
          Browse Categories
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">
          Explore all tool categories
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
          Find the right utility for your task. Each category contains tools
          tailored for images, text, developer workflows, SEO, and more.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((key) => {
          const category = CATEGORIES[key];
          const count = TOOLS.filter((tool) => tool.category === key).length;
          return (
            <Link
              key={key}
              href={`/category/${key}`}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              {/* Icon + count badge on the same row */}
              <div className="flex items-start justify-between">
                <p className="text-3xl leading-none">{category.icon}</p>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  {count} tools
                </span>
              </div>

              {/* Label + description — full width, nothing competing */}
              <h2 className="mt-4 text-xl font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100">
                {category.label}
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                {category.description}
              </p>

              {/* Browse link pinned to the bottom */}
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Browse {category.label}
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
