import Link from "next/link";
import { type ToolDefinition, CATEGORIES, type ToolCategory } from "@/lib/tools-registry";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: ToolDefinition;
  className?: string;
}

// Explicit dark-mode-aware color map per category.
// The registry's `color` string only has light-mode classes, so we define
// the full set here where Tailwind can statically detect each class.
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
};

export function ToolCard({ tool, className }: ToolCardProps) {
  const category = CATEGORIES[tool.category];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-150 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className="text-2xl leading-none"
          role="img"
          aria-label={tool.name}
        >
          {tool.icon}
        </span>
        <div className="flex gap-1">
          {tool.isNew && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              New
            </span>
          )}
          {tool.isPopular && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              Popular
            </span>
          )}
          {!tool.isFunctional && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
              Coming soon
            </span>
          )}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors dark:text-slate-100 dark:group-hover:text-indigo-400">
          {tool.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500 leading-snug dark:text-slate-400 line-clamp-2">
          {tool.description}
        </p>
      </div>
      <div className="mt-auto">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
            CATEGORY_BADGE_COLORS[tool.category],
          )}
        >
          {category.icon} {category.label}
        </span>
      </div>
    </Link>
  );
}
