import Link from "next/link";
import { Wrench, Coffee } from "lucide-react";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";

export function Footer() {
  const popularTools = TOOLS.filter((t) => t.isPopular).slice(0, 6);

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Tool<span className="text-indigo-600">Nest</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Fast, free online tools for everyone. No signup required.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Categories</h3>
            <ul className="mt-3 space-y-2">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <li key={key}>
                  <Link
                    href={`/category/${key}`}
                    className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Popular Tools</h3>
            <ul className="mt-3 space-y-2">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">More</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/all-tools", label: "All Tools" },
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Support strip */}
        <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 dark:bg-amber-950/10 dark:border-amber-800/30">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            ToolNest is free forever. If it saves you time, a coffee keeps it alive ☕
          </p>
          <a
            href="https://www.buymeacoffee.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition-colors"
          >
            <Coffee className="h-4 w-4" /> Buy me a coffee
          </a>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} ToolNest · Built by{" "}
            <a href="/about" className="hover:text-indigo-500">Uddhav Shrimali</a>
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <a href="/privacy" className="hover:text-indigo-500">Privacy</a>
            <a href="/terms" className="hover:text-indigo-500">Terms</a>
            <a href="/about" className="hover:text-indigo-500">About</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
