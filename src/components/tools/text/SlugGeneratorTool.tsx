"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { slugify } from "@/lib/utils";

const tool = getToolBySlug("slug-generator")!;

export function SlugGeneratorTool() {
  const [input, setInput] = useState("");
  const slug = slugify(input);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Type any text, title, or phrase in the input.",
        "The URL-friendly slug is generated instantly.",
        "Copy the slug for use in your CMS, URL, or file name.",
      ]}
      faqs={[
        {
          question: "What is a URL slug?",
          answer: "A slug is the URL-friendly version of a string, using only lowercase letters, numbers, and hyphens. Example: 'Hello World!' → 'hello-world'.",
        },
        {
          question: "Are special characters removed?",
          answer: "Yes. Accented characters, punctuation, and special symbols are removed. Spaces become hyphens.",
        },
      ]}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Your text
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="My Awesome Blog Post Title!"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Generated Slug</label>
            {slug && <CopyButton text={slug} />}
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <span className="text-slate-400 text-sm">/</span>
            <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400">
              {slug || <span className="text-slate-300 dark:text-slate-600">your-slug-here</span>}
            </span>
          </div>
        </div>
        {input && (
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 dark:bg-slate-900 dark:border-slate-700">
            <p className="text-xs text-slate-500">
              <span className="font-medium">Full URL example:</span>{" "}
              <code className="text-indigo-600">https://yoursite.com/{slug}</code>
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
