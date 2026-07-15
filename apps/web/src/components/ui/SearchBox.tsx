"use client";
import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, TrendingUp } from "lucide-react";
import { searchTools, TOOLS, CATEGORIES } from "@/lib/tools-registry";
import { cn } from "@/lib/utils";
import type { ToolDefinition } from "@/lib/tools-registry";

interface SearchBoxProps {
  /** Placeholder text shown in the input */
  placeholder?: string;
  /** Extra classes on the root wrapper div */
  className?: string;
  /** Show a separate Submit button alongside the input (homepage style) */
  showButton?: boolean;
  /** Auto-focus the input on mount (search page style) */
  autoFocus?: boolean;
  /** Pre-fill the input with this value (search page) */
  defaultValue?: string;
  /** Visual size — compact (header) or default */
  size?: "sm" | "md";
}

const MIN_QUERY_LENGTH = 2;
const MAX_SUGGESTIONS = 6;

/** Wrap matched portion of text in a <mark> */
function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-indigo-100 text-indigo-700 dark:bg-indigo-800/50 dark:text-indigo-300 rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/** Popular tools shown when input is focused but empty */
const POPULAR_SLUGS = TOOLS.filter((t) => t.isPopular).slice(0, 6).map((t) => t.slug);

export function SearchBox({
  placeholder,
  className,
  showButton = false,
  autoFocus = false,
  defaultValue = "",
  size = "md",
}: SearchBoxProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Derived suggestion list
  const suggestions: ToolDefinition[] = useMemo(() => {
    const q = query.trim();
    if (q.length < MIN_QUERY_LENGTH) return [];
    return searchTools(q).slice(0, MAX_SUGGESTIONS);
  }, [query]);

  // Popular tools shown when focused with no query
  const popular: ToolDefinition[] = useMemo(() => {
    if (query.trim().length >= MIN_QUERY_LENGTH) return [];
    return TOOLS.filter((t) => POPULAR_SLUGS.includes(t.slug));
  }, [query]);

  const showSuggestions = focused && suggestions.length > 0;
  const showPopular = focused && query.trim().length === 0 && popular.length > 0;
  const dropdownOpen = showSuggestions || showPopular;
  const dropdownItems = showSuggestions ? suggestions : popular;

  // Reset active index whenever dropdown contents change
  useEffect(() => {
    setActiveIdx(-1);
  }, [query, focused]);

  const handleFocus = useCallback(() => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    blurTimer.current = setTimeout(() => setFocused(false), 150);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (!q) return;
      setFocused(false);
      router.push(`/search?q=${encodeURIComponent(q)}`);
    },
    [query, router],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!dropdownOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, dropdownItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter" && activeIdx >= 0) {
        e.preventDefault();
        const selected = dropdownItems[activeIdx];
        if (selected) {
          setFocused(false);
          setQuery("");
          router.push(`/tools/${selected.slug}`);
        }
      } else if (e.key === "Escape") {
        setFocused(false);
        inputRef.current?.blur();
      }
    },
    [dropdownOpen, dropdownItems, activeIdx, router],
  );

  const handleSelect = useCallback(() => {
    setQuery("");
    setFocused(false);
  }, []);

  const inputClasses = cn(
    "w-full rounded-xl border bg-white outline-none transition",
    "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
    "dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-800",
    size === "sm"
      ? "border-slate-200 py-2 pl-9 pr-4 text-sm dark:border-slate-700"
      : "border-slate-200 py-3 pl-10 pr-4 text-sm shadow-sm dark:border-slate-700",
  );

  const resolvedPlaceholder =
    placeholder ?? `Search ${TOOLS.length}+ tools...`;

  return (
    <div className={cn("relative", className)}>
      <form
        onSubmit={handleSubmit}
        className={cn("flex gap-2", showButton ? "w-full" : "")}
        role="search"
      >
        <div className="relative flex-1">
          {/* Icon */}
          <Search
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400",
              size === "sm" ? "left-3 h-4 w-4" : "left-3 h-4 w-4",
            )}
          />

          <input
            ref={inputRef}
            type="search"
            value={query}
            name="q"
            autoFocus={autoFocus}
            autoComplete="off"
            spellCheck={false}
            placeholder={resolvedPlaceholder}
            className={inputClasses}
            aria-label="Search tools"
            aria-expanded={dropdownOpen}
            aria-autocomplete="list"
            aria-controls={dropdownOpen ? "search-suggestions" : undefined}
            aria-activedescendant={
              activeIdx >= 0 ? `suggestion-${activeIdx}` : undefined
            }
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
              role="listbox"
              id="search-suggestions"
            >
              {/* Section header */}
              <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-2 dark:border-slate-800">
                {showSuggestions ? (
                  <Search className="h-3 w-3 text-slate-400" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-slate-400" />
                )}
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {showSuggestions ? "Suggestions" : "Popular Tools"}
                </span>
              </div>

              <ul ref={listRef}>
                {dropdownItems.map((tool, i) => {
                  const cat = CATEGORIES[tool.category];
                  const isActive = i === activeIdx;
                  return (
                    <li key={tool.slug} role="option" aria-selected={isActive} id={`suggestion-${i}`}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        onClick={handleSelect}
                        onMouseEnter={() => setActiveIdx(i)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 transition-colors",
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-900/20"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/60",
                        )}
                      >
                        {/* Emoji icon */}
                        <span className="text-lg leading-none w-6 text-center shrink-0">
                          {tool.icon}
                        </span>

                        {/* Name + description */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                            {showSuggestions
                              ? highlight(tool.name, query.trim())
                              : tool.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate leading-tight mt-0.5">
                            {tool.description}
                          </p>
                        </div>

                        {/* Category badge */}
                        <span
                          className={cn(
                            "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                            cat.color,
                          )}
                        >
                          {cat.label.replace(" Tools", "")}
                        </span>

                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Footer — only on suggestions */}
              {showSuggestions && (
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-sm text-indigo-600 hover:bg-indigo-50 dark:border-slate-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                >
                  <Search className="h-3.5 w-3.5" />
                  Search all results for{" "}
                  <span className="font-semibold">"{query.trim()}"</span>
                </button>
              )}
            </div>
          )}
        </div>

        {showButton && (
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shrink-0"
          >
            Search
          </button>
        )}
      </form>
    </div>
  );
}
