"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { AlertCircle } from "lucide-react";

const tool = getToolBySlug("regex-tester")!;

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact us at support@toolnest.app or dev@example.com for help.");
  const [error, setError] = useState<string | null>(null);

  const getMatches = () => {
    if (!pattern) return [];
    try {
      const regex = new RegExp(pattern, flags);
      const matches: { match: string; index: number }[] = [];
      let m;
      if (flags.includes("g")) {
        while ((m = regex.exec(text)) !== null) {
          matches.push({ match: m[0], index: m.index });
          if (m.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        m = regex.exec(text);
        if (m) matches.push({ match: m[0], index: m.index });
      }
      return matches;
    } catch (err: unknown) {
      return [];
    }
  };

  const validatePattern = (p: string, f: string) => {
    try {
      new RegExp(p, f);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid Regular Expression";
      setError(message);
    }
  };

  const matches = getMatches();

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter your Regular Expression pattern and select regex flags (g, i, m).",
        "Type or paste test text into the test string container.",
        "View highlighted matching strings and count instantly.",
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Regex Pattern
            </label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => {
                setPattern(e.target.value);
                validatePattern(e.target.value, flags);
              }}
              placeholder="e.g. [0-9]+"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Flags
            </label>
            <input
              type="text"
              value={flags}
              onChange={(e) => {
                setFlags(e.target.value);
                validatePattern(pattern, e.target.value);
              }}
              placeholder="g, i, m"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Test String
          </label>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Results */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Matches Found: {matches.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matches.map((m, i) => (
              <span
                key={i}
                className="rounded-lg bg-indigo-100 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
              >
                {m.match} <span className="text-[10px] opacity-60">(index {m.index})</span>
              </span>
            ))}
            {matches.length === 0 && (
              <span className="text-xs text-slate-400">No matches found</span>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
