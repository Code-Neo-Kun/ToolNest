import Link from "next/link";
import { type ToolDefinition } from "@/lib/tools-registry";
import { ToolLayout } from "@/components/layout/ToolLayout";

interface ComingSoonToolProps {
  tool: ToolDefinition;
}

export function ComingSoonTool({ tool }: ComingSoonToolProps) {
  return (
    <ToolLayout tool={tool}>
      <div className="space-y-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
          <span className="text-4xl">🚧</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {tool.name} is coming soon
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-400">
            This tool is not available yet, but it is planned for a future
            release. Check back soon or explore other tools while we finish
            development.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold">What you can do next:</p>
          <ul className="mt-3 space-y-2">
            <li>• Browse other tools in the same category.</li>
            <li>• Search for available utilities using the search page.</li>
            <li>• Return to the homepage for featured and new tools.</li>
          </ul>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/all-tools"
            className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            View all tools
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    </ToolLayout>
  );
}
