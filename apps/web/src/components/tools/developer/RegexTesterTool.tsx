"use client";
import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("regex-tester")!;

interface Match {
  index: number;
  end: number;
  value: string;
  groups: string[];
}

function buildRegex(
  pattern: string,
  flags: string,
): { regex: RegExp; error: string | null } {
  try {
    return { regex: new RegExp(pattern, flags), error: null };
  } catch (e) {
    return {
      regex: new RegExp(""),
      error: e instanceof Error ? e.message : "Invalid regular expression",
    };
  }
}

function getMatches(regex: RegExp, text: string): Match[] {
  const matches: Match[] = [];
  if (!regex.source || regex.source === "(?:)") return matches;
  // Always use global for iteration; clone with global flag
  const g = new RegExp(
    regex.source,
    regex.flags.includes("g") ? regex.flags : regex.flags + "g",
  );
  let m: RegExpExecArray | null;
  let safety = 0;
  while ((m = g.exec(text)) !== null && safety++ < 500) {
    matches.push({
      index: m.index,
      end: m.index + m[0].length,
      value: m[0],
      groups: m.slice(1),
    });
    // Avoid infinite loop on zero-length matches
    if (m[0].length === 0) g.lastIndex++;
  }
  return matches;
}

/** Render test string with match highlights */
function HighlightedText({
  text,
  matches,
}: {
  text: string;
  matches: Match[];
}) {
  if (!text) return null;
  if (matches.length === 0) {
    return (
      <span className="whitespace-pre-wrap break-all text-slate-700 dark:text-slate-300">
        {text}
      </span>
    );
  }

  const parts: { str: string; highlight: boolean }[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.index > cursor) {
      parts.push({ str: text.slice(cursor, m.index), highlight: false });
    }
    parts.push({ str: text.slice(m.index, m.end), highlight: true });
    cursor = m.end;
  }
  if (cursor < text.length) {
    parts.push({ str: text.slice(cursor), highlight: false });
  }

  return (
    <span className="whitespace-pre-wrap break-all">
      {parts.map((p, i) =>
        p.highlight ? (
          <mark
            key={i}
            className="rounded bg-amber-200 px-0.5 text-amber-900 dark:bg-amber-700/60 dark:text-amber-100"
          >
            {p.str}
          </mark>
        ) : (
          <span key={i} className="text-slate-700 dark:text-slate-300">
            {p.str}
          </span>
        ),
      )}
    </span>
  );
}

const FLAGS = [
  { flag: "g", label: "g", title: "Global — find all matches" },
  { flag: "i", label: "i", title: "Case insensitive" },
  { flag: "m", label: "m", title: "Multiline — ^ and $ match line boundaries" },
  { flag: "s", label: "s", title: "Dot-all — . matches newline" },
];

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<Set<string>>(new Set(["g"]));
  const [testString, setTestString] = useState("");
  const [replaceWith, setReplaceWith] = useState("");
  const [activeTab, setActiveTab] = useState<"match" | "replace">("match");

  const flagString = Array.from(flags).sort().join("");

  const { regex, error } = useMemo(
    () => (pattern ? buildRegex(pattern, flagString) : { regex: new RegExp(""), error: null }),
    [pattern, flagString],
  );

  const matches = useMemo(
    () => (pattern && !error ? getMatches(regex, testString) : []),
    [regex, pattern, error, testString],
  );

  const replacedText = useMemo(() => {
    if (!pattern || error || activeTab !== "replace") return "";
    try {
      return testString.replace(regex, replaceWith);
    } catch {
      return "";
    }
  }, [pattern, error, testString, replaceWith, regex, activeTab]);

  function toggleFlag(f: string) {
    setFlags((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  }

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        {/* Pattern + flags row */}
        <div className="space-y-2">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Regular Expression
          </label>
          <div className="flex items-center gap-0 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900">
            <span className="pl-4 text-slate-400 font-mono text-lg select-none">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="your pattern here"
              spellCheck={false}
              className="flex-1 bg-transparent px-2 py-3 font-mono text-sm text-slate-800 outline-none dark:text-slate-200"
              aria-label="Regex pattern"
            />
            <span className="text-slate-400 font-mono text-lg select-none">/</span>
            <span className="px-3 font-mono text-sm text-indigo-600 dark:text-indigo-400 min-w-[2rem]">
              {flagString || " "}
            </span>
          </div>
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Flags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Flags:</span>
          {FLAGS.map(({ flag, label, title }) => (
            <button
              key={flag}
              title={title}
              onClick={() => toggleFlag(flag)}
              className={`rounded-lg border px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                flags.has(flag)
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Test string */}
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Test String
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against your regex..."
            rows={5}
            spellCheck={false}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 outline-none resize-y transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-900"
            aria-label="Test string"
          />
        </label>

        {/* Tabs */}
        {pattern && !error && (
          <div className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-4">
              {(["match", "replace"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Match tab */}
        {pattern && !error && activeTab === "match" && (
          <div className="space-y-4">
            {/* Match count */}
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  matches.length > 0
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {matches.length} match{matches.length !== 1 ? "es" : ""}
              </span>
            </div>

            {/* Highlighted preview */}
            {testString && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed dark:border-slate-700 dark:bg-slate-900">
                <HighlightedText text={testString} matches={matches} />
              </div>
            )}

            {/* Match details */}
            {matches.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {matches.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <span className="text-slate-400 font-mono w-6 shrink-0">
                      [{i + 1}]
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-mono text-slate-800 dark:text-slate-200 break-all">
                        {JSON.stringify(m.value)}
                      </p>
                      <p className="text-slate-400">
                        index {m.index}–{m.end}
                        {m.groups.length > 0 &&
                          ` · groups: ${m.groups.map((g) => JSON.stringify(g ?? "undefined")).join(", ")}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Replace tab */}
        {pattern && !error && activeTab === "replace" && (
          <div className="space-y-3">
            <label className="block text-sm text-slate-600 dark:text-slate-300">
              Replace With
              <input
                type="text"
                value={replaceWith}
                onChange={(e) => setReplaceWith(e.target.value)}
                placeholder="replacement (use $1, $2 for groups)"
                spellCheck={false}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-900"
              />
            </label>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Result
                </p>
                <CopyButton text={replacedText} size="sm" />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-700 whitespace-pre-wrap break-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {replacedText || <span className="text-slate-400">—</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
