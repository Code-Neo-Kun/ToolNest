import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist. Browse all free online tools on ToolNest.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-6xl mb-4">🔧</span>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">404</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        This tool doesn&apos;t exist yet, but it might soon.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to ToolNest
      </Link>
    </div>
  );
}
