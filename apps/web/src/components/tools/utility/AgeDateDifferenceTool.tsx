"use client";
import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("age-date-difference")!;

function calculateAge(birth: Date, target: Date) {
  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    // Days in the previous month relative to target
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export function AgeDateDifferenceTool() {
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [targetDate, setTargetDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const result = useMemo(() => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    return calculateAge(birth, target);
  }, [birthDate, targetDate]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Choose a birth date and optional target date.",
        "See the age or interval in years, months, and days.",
        "Use the result for planning or milestone calculations.",
      ]}
      faqs={[
        {
          question: "What if the target date is in the future?",
          answer:
            "The tool calculates the interval between the two dates, even if the target date is later.",
        },
        {
          question: "Does it account for leap years?",
          answer:
            "It calculates date differences using calendar months and days, not exact leap year day counts.",
        },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Birth date
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Target date
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        {result && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Age / interval
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {result.years} years, {result.months} months, {result.days} days
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
