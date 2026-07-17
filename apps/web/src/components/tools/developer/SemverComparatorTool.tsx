"use client";
import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("semver-comparator")!;

function parseVersion(value: string): number[] | null {
  const parts = value.trim().split(".");
  if (parts.length === 0) return null;
  // Validate that each segment is a non-negative integer
  if (!parts.every((p) => /^[0-9]+$/.test(p))) return null;
  return parts.map((part) => Number(part));
}

export function SemverComparatorTool() {
  const [versionA, setVersionA] = useState("1.0.0");
  const [versionB, setVersionB] = useState("1.0.1");

  const result = useMemo(() => {
    const a = parseVersion(versionA);
    const b = parseVersion(versionB);
    if (!a || !b) return "Invalid version format";
    for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
      const diff = (a[i] ?? 0) - (b[i] ?? 0);
      if (diff > 0) return "A is newer";
      if (diff < 0) return "B is newer";
    }
    return "Versions are equal";
  }, [versionA, versionB]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter two semantic version strings.",
        "Compare which release is newer.",
        "Use the result to validate version ordering.",
      ]}
      faqs={[
        {
          question: "How does semantic versioning work?",
          answer:
            "Semver uses MAJOR.MINOR.PATCH, where higher numbers represent newer releases.",
        },
        {
          question: "Can this compare prereleases?",
          answer:
            "This basic comparator compares numeric segments and ignores prerelease metadata.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Version A
            <input
              value={versionA}
              onChange={(e) => setVersionA(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Version B
            <input
              value={versionB}
              onChange={(e) => setVersionB(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              Comparison result
            </p>
            <CopyButton text={result} />
          </div>
          <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
            {result}
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
