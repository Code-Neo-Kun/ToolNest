"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wrench, Coffee } from "lucide-react";
import { CATEGORIES } from "@/lib/tools-registry";
import { SearchBox } from "@/components/ui/SearchBox";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Tool<span className="text-indigo-600">Nest</span>
            </span>
          </Link>

          {/* Desktop search */}
          <SearchBox
            size="sm"
            placeholder="Search tools..."
            className="hidden sm:block flex-1 max-w-md"
          />

          {/* Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <Link
                key={key}
                href={`/category/${key}`}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/30"
              >
                {cat.label.replace(" Tools", "")}
              </Link>
            ))}
            <Link
              href="/about"
              className="px-3 py-1.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors dark:text-slate-300 dark:hover:text-indigo-400"
            >
              About
            </Link>
            <a
              href="https://www.buymeacoffee.com/uddhavshrimali"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-500 transition-colors"
            >
              <Coffee className="h-3.5 w-3.5" /> Support
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="px-4 py-3 space-y-1">
            {/* Mobile search */}
            <div className="mb-3">
              <SearchBox size="sm" placeholder="Search tools..." />
            </div>

            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <Link
                key={key}
                href={`/category/${key}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              👨‍💻 About
            </Link>
            <a
              href="https://www.buymeacoffee.com/uddhavshrimali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/20"
            >
              <Coffee className="h-4 w-4" /> Buy me a coffee
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
