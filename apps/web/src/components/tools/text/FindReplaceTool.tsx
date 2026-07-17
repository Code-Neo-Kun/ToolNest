"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("find-replace")!;

export function FindReplaceTool() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [useRegex, setUseRegex] = useState(false);

  const result = useMemo(() => {
    if (!find) return text;
    try {
      const regex = useRegex
        ? new RegExp(find, "g")
        : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      return text.replace(regex, replaceValue);
    } catch {
      return text;
    }
  }, [text, find, replaceValue, useRegex]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Paste your text in the editor.",
        "Enter the search string and replacement text.",
        "Switch on regex to use regular expressions.",
      ]}
      faqs={[
        {
          question: "How does regex mode work?",
          answer:
            "Regex mode treats your search string as a regular expression and replaces all matches.",
        },
        {
          question: "Can I cancel find and replace?",
          answer:
            "The original text is preserved until you copy or overwrite the result.",
        },
      ]}
    >
      <div className="space-y-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Source text
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Find
            <input
              value={find}
              onChange={(e) => setFind(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Replace with
            <input
              value={replaceValue}
              onChange={(e) => setReplaceValue(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Use Regular Expression
          </label>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Result</span>
            <CopyButton text={result} />
          </div>
          <pre className="whitespace-pre-wrap break-words text-sm">
            {result}
          </pre>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => navigator.clipboard.writeText(result)} variant="secondary" className="flex-1" disabled={!result}>
            Copy Result
          </Button>
          <Button onClick={() => { setText(result); }} className="flex-1" disabled={!result || result === text}>
            Apply to Input
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
