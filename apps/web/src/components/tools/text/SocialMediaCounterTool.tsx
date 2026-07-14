"use client";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("social-media-counter")!;

const limits = [
  { name: "Twitter", chars: 280, help: "Tweets and replies" },
  { name: "Instagram", chars: 2200, help: "Captions and comments" },
  { name: "LinkedIn", chars: 3000, help: "Posts and articles" },
];

export function SocialMediaCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const words =
      text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
    return { chars, words };
  }, [text]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Paste your social caption or post text.",
        "See live character and word counts.",
        "Use the limits reference to stay within platform rules.",
      ]}
      faqs={[
        {
          question: "Why is character count important?",
          answer:
            "Different platforms have different limits for posts, captions, and comments.",
        },
        {
          question: "Does this tool count spaces?",
          answer:
            "Yes. It counts every character, including spaces and punctuation.",
        },
      ]}
    >
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Type your social media copy here..."
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none resize-y transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500">Characters</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {stats.chars}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500">Words</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {stats.words}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Platform limits
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {limits.map((limit) => {
              const over = stats.chars > limit.chars;
              return (
                <div
                  key={limit.name}
                  className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                >
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {limit.name}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {limit.chars}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {limit.help}
                  </div>
                  <div
                    className={`mt-3 rounded-xl px-3 py-2 text-xs font-semibold ${over ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200"}`}
                  >
                    {over ? "Over limit" : "Within limit"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <CopyButton text={text} />
        </div>
      </div>
    </ToolLayout>
  );
}
