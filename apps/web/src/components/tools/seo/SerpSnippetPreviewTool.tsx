"use client";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("serp-snippet-preview")!;

export function SerpSnippetPreviewTool() {
  const [title, setTitle] = useState("My Page Title");
  const [description, setDescription] = useState(
    "A short description of my website for search results.",
  );
  const lengthScore = useMemo(() => description.length, [description]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter a title and meta description.",
        "Preview how they look in Google search results.",
        "Adjust length and wording to improve click-through rate.",
      ]}
      faqs={[
        {
          question: "What length should my title be?",
          answer: "Aim for 50–60 characters to avoid truncation in results.",
        },
        {
          question: "What length should my description be?",
          answer:
            "Keep meta descriptions around 150–160 characters for best visibility.",
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Google preview
            </div>
            <div className="space-y-2">
              <div className="text-lg font-semibold text-[#1a0dab]">
                {title || "Page title"}
              </div>
              <div className="text-sm text-[#006621]">
                www.example.com › page
              </div>
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                {description || "Meta description preview"}
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Meta description length
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lengthScore} characters
                </p>
              </div>
              <CopyButton text={`${title}\n${description}`} />
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${Math.min(100, (lengthScore / 160) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {lengthScore <= 160
                ? "Within recommended length."
                : "Too long for search snippets."}
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
