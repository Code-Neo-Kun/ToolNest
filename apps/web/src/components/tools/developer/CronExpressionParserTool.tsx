"use client";
import { useMemo, useState } from "react";
import parser from "cron-parser";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("cron-expression-parser")!;

export function CronExpressionParserTool() {
  const [expression, setExpression] = useState("*/5 * * * *");
  const [error, setError] = useState<string | null>(null);

  const schedule = useMemo(() => {
    if (!expression.trim()) return null;
    try {
      setError(null);
      const interval = parser.parseExpression(expression);
      return {
        nextRun: interval.next().toString(),
        nextFive: Array.from({ length: 5 }, () => interval.next().toString()),
      };
    } catch (err) {
      setError((err as Error).message);
      return null;
    }
  }, [expression]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter a cron expression.",
        "Review the next run times and schedule meaning.",
        "Copy the expression for your planner or job config.",
      ]}
      faqs={[
        {
          question: "What cron format is supported?",
          answer:
            "This tool supports standard 5-field cron expressions for minute, hour, day, month, and weekday.",
        },
        {
          question: "Can I use range values?",
          answer:
            "Yes, ranges (like 1-5), lists, wildcards, and steps are supported.",
        },
      ]}
    >
      <div className="space-y-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Cron expression
          <input
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="*/15 9-17 * * 1-5"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {schedule && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Next run
                </div>
                <div className="mt-2 text-sm text-slate-900 dark:text-slate-100">
                  {schedule.nextRun}
                </div>
              </div>
              <CopyButton text={expression} />
            </div>
            <div className="mt-4 space-y-3">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Next 5 run times
              </div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                {schedule.nextFive.map((run, index) => (
                  <li key={index}>{run}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
