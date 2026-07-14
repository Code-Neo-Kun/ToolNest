"use client";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("world-clock")!;

const timezones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "America/Sao_Paulo",
  "Africa/Johannesburg",
];

export function WorldClockTool() {
  const [sourceZone, setSourceZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC",
  );
  const [targetZone, setTargetZone] = useState("UTC");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const formattedSource = useMemo(
    () =>
      time.toLocaleString("en-US", {
        timeZone: sourceZone,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        timeZoneName: "short",
      }),
    [time, sourceZone],
  );

  const formattedTarget = useMemo(
    () =>
      time.toLocaleString("en-US", {
        timeZone: targetZone,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        timeZoneName: "short",
      }),
    [time, targetZone],
  );

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Pick a source and target timezone.",
        "View the current clocks in both zones.",
        "Use the result to coordinate meetings across regions.",
      ]}
      faqs={[
        {
          question: "How accurate is this?",
          answer:
            "It uses the browser's time and the Intl timezone APIs for current local times.",
        },
        {
          question: "Can I choose any timezone?",
          answer:
            "The tool includes common timezones, but you can expand the list in the source code if needed.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Source timezone
            <select
              value={sourceZone}
              onChange={(e) => setSourceZone(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {timezones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Target timezone
            <select
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {timezones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Source time
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {formattedSource}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {sourceZone}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Target time
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                  {formattedTarget}
                </p>
              </div>
              <CopyButton text={formattedTarget} />
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {targetZone}
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
