"use client";
import { useMemo, useState } from "react";
import { diffWordsWithSpace, type Change } from "diff";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("text-diff-checker")!;

export function TextDiffCheckerTool() {
  const [sourceA, setSourceA] = useState("");
  const [sourceB, setSourceB] = useState("");

  const diff = useMemo(() => {
    return diffWordsWithSpace(sourceA, sourceB);
  }, [sourceA, sourceB]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Paste the first text block in the left editor.",
        "Paste the second text block in the right editor.",
        "Review the highlighted differences below.",
      ]}
      faqs={[
        {
          question: "What is being compared?",
          answer:
            "The tool compares words and whitespace between two text blocks, highlighting additions and removals.",
        },
        {
          question: "Can I use it for code?",
          answer:
            "Yes. It works with any plain text, including code snippets and prose.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Original text
            <textarea
              value={sourceA}
              onChange={(e) => setSourceA(e.target.value)}
              rows={8}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Updated text
            <textarea
              value={sourceB}
              onChange={(e) => setSourceB(e.target.value)}
              rows={8}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Diff Result
          </div>
          <div className="prose max-w-none whitespace-pre-wrap break-words text-sm dark:prose-invert">
            {diff.map((part: Change, index) => {
              const style = part.added
                ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200"
                : part.removed
                  ? "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200"
                  : "text-slate-800 dark:text-slate-200";

              return (
                <span key={index} className={`${style} rounded px-0.5 py-0.5`}>
                  {part.value}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
