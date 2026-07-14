"use client";
import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("keyword-density-checker")!;

export function KeywordDensityCheckerTool() {
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");

  const density = useMemo(() => {
    const normalized = text
      .toLowerCase()
      .replace(/[\W_]+/g, " ")
      .trim();
    const words = normalized ? normalized.split(/\s+/) : [];
    const count = words.filter((word) => word === keyword.toLowerCase()).length;
    return words.length === 0 ? 0 : (count / words.length) * 100;
  }, [text, keyword]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Paste your content.",
        "Enter a keyword to analyze.",
        "Review keyword frequency and density percentage.",
      ]}
      faqs={[
        {
          question: "What is keyword density?",
          answer:
            "It is the percentage of times a keyword appears in the total content.",
        },
        {
          question: "What is a good density?",
          answer: "A natural keyword density is usually between 1% and 3%.",
        },
      ]}
    >
      <div className="space-y-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Keyword
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            placeholder="Enter keyword"
          />
        </label>

        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Content
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            placeholder="Paste your content here..."
          />
        </label>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Keyword density
            </p>
            <CopyButton text={`${density.toFixed(2)}%`} />
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {density.toFixed(2)}%
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Calculated for the keyword:{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {keyword || "—"}
            </span>
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
