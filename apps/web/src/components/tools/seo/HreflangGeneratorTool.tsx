"use client";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("hreflang-generator")!;

export function HreflangGeneratorTool() {
  const [defaultUrl, setDefaultUrl] = useState("https://example.com/");
  const [languages, setLanguages] = useState(
    "en:https://example.com/,fr:https://example.com/fr/",
  );

  const tags = useMemo(() => {
    const entries = languages
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => item.split(":", 2))
      .filter((parts) => parts.length === 2)
      .map(
        ([lang, url]) =>
          `<link rel=\"alternate\" href=\"${url.trim()}\" hreflang=\"${lang.trim()}\" />`,
      );

    return [
      `<link rel=\"alternate\" href=\"${defaultUrl}\" hreflang=\"x-default\" />`,
      ...entries,
    ].join("\n");
  }, [defaultUrl, languages]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter your default page URL.",
        "Add comma-separated language:url pairs.",
        "Copy the hreflang tags into your head markup.",
      ]}
      faqs={[
        {
          question: "What is x-default?",
          answer:
            "x-default indicates the default URL when no language match is found.",
        },
        {
          question: "Can I use hreflang with subdomains?",
          answer:
            "Yes. Each language version can use its own URL, including subdomains or subfolders.",
        },
      ]}
    >
      <div className="space-y-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Default URL
          <input
            value={defaultUrl}
            onChange={(e) => setDefaultUrl(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Language pairs
          <textarea
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            rows={4}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            placeholder="en:https://example.com/,fr:https://example.com/fr/"
          />
        </label>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Generated hreflang tags
            </div>
            <CopyButton text={tags} />
          </div>
          <pre className="whitespace-pre-wrap break-words text-sm text-slate-700 dark:text-slate-200">
            {tags}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
