"use client";
import { useMemo, useState } from "react";
import UAParser from "ua-parser-js";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("user-agent-parser")!;

export function UserAgentParserTool() {
  const [uaString, setUaString] = useState(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
  );

  const result = useMemo(() => {
    const parser = new UAParser(uaString);
    return parser.getResult();
  }, [uaString]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Paste a user agent string.",
        "Review browser, OS, and device details.",
        "Copy the parsed result for debugging or support.",
      ]}
      faqs={[
        {
          question: "What is a user agent string?",
          answer:
            "It is a browser-provided string used to identify the browser, OS, and device during web requests.",
        },
        {
          question: "Is this accurate for all browsers?",
          answer:
            "It parses the reported string, but some browsers may use generic or custom user agent formats.",
        },
      ]}
    >
      <div className="space-y-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          User Agent
          <textarea
            value={uaString}
            onChange={(e) => setUaString(e.target.value)}
            rows={5}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Browser
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              {result.browser.name} {result.browser.version}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Operating System
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              {result.os.name} {result.os.version}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Parsed details
            </p>
            <CopyButton text={JSON.stringify(result, null, 2)} />
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
