import Link from "next/link";
import { Tool, CATEGORIES } from "@/lib/tools-registry";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const category = CATEGORIES[tool.category];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-150 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl leading-none" role="img" aria-label={tool.name}>
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
        <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", category.color)}>
          {category.icon} {category.label}
        </span>
      </div>
    </Link>
  );
}
