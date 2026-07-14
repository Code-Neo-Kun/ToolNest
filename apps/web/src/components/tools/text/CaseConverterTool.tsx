"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("case-converter")!;

const conversions = [
  {
    label: "UPPERCASE",
    fn: (t: string) => t.toUpperCase(),
  },
  {
    label: "lowercase",
    fn: (t: string) => t.toLowerCase(),
  },
  {
    label: "Title Case",
    fn: (t: string) =>
      t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    label: "Sentence case",
    fn: (t: string) =>
      t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(),
  },
  {
    label: "camelCase",
    fn: (t: string) =>
      t
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^[A-Z]/, (c) => c.toLowerCase()),
  },
  {
    label: "PascalCase",
    fn: (t: string) =>
      t
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^[a-z]/, (c) => c.toUpperCase()),
  },
  {
    label: "snake_case",
    fn: (t: string) =>
      t
        .replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toLowerCase(),
  },
  {
    label: "kebab-case",
    fn: (t: string) =>
      t
        .replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase(),
  },
];

export function CaseConverterTool() {
  const [input, setInput] = useState("");

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Type or paste your text in the input box.",
        "All case conversions appear below automatically.",
        "Click Copy next to any result.",
      ]}
      faqs={[
        {
          question: "What is camelCase?",
          answer: "camelCase writes compound words with no spaces and each word capitalized except the first, like: helloWorldExample.",
        },
        {
          question: "What is snake_case?",
          answer: "snake_case uses underscores between words in lowercase, commonly used in Python variable names and file names.",
        },
      ]}
    >
      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to convert..."
          rows={4}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none resize-y transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          aria-label="Text input"
        />
        <div className="space-y-3">
          {conversions.map((c) => {
            const result = input ? c.fn(input) : "";
            return (
              <div
                key={c.label}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="w-28 shrink-0 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {c.label}
                </span>
                <span className="flex-1 text-sm text-slate-800 dark:text-slate-200 truncate font-mono">
                  {result || <span className="text-slate-300 dark:text-slate-600">...</span>}
                </span>
                {result && <CopyButton text={result} size="sm" />}
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}
