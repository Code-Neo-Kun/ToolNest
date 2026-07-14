"use client";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("title-meta-description-checker")!;

function measureTextWidth(text: string, fontSize = 18, fontFamily = "Arial") {
  if (typeof document === "undefined") return 0;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;
  ctx.font = `${fontSize}px ${fontFamily}`;
  return ctx.measureText(text).width;
}

export function MetaPixelWidthCheckerTool() {
  const [title, setTitle] = useState("My Awesome Page Title");
  const [description, setDescription] = useState(
    "A short meta description for SEO preview.",
  );

  const titleWidth = useMemo(() => measureTextWidth(title), [title]);
  const descriptionWidth = useMemo(
    () => measureTextWidth(description, 16),
    [description],
  );

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter your title and meta description.",
        "Check the pixel width for search snippet display.",
        "Copy the result once lengths are within the recommended range.",
      ]}
      faqs={[
        {
          question: "Why measure pixel width?",
          answer:
            "Search engines truncate titles and descriptions based on pixel width, not character count.",
        },
        {
          question: "What are the recommended widths?",
          answer:
            "Around 600px for titles and 920px for descriptions in Google search snippets.",
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
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
              rows={5}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Title width
              </p>
              <CopyButton text={`${titleWidth.toFixed(0)}px`} />
            </div>
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.min(100, (titleWidth / 600) * 100)}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {titleWidth.toFixed(0)}px / 600px recommended
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Description width
              </p>
              <CopyButton text={`${descriptionWidth.toFixed(0)}px`} />
            </div>
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${Math.min(100, (descriptionWidth / 920) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {descriptionWidth.toFixed(0)}px / 920px recommended
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
