"use client";
import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { formatCurrency } from "@neotools/tool-modules";

const tool = getToolBySlug("roi-calculator")!;

function formatPercent(value: number) {
  return isNaN(value) || !isFinite(value) ? "—" : `${value.toFixed(2)}%`;
}

export function RoiCalculatorTool() {
  const [gain, setGain] = useState("");
  const [cost, setCost] = useState("");

  const result = useMemo(() => {
    const gainValue = parseFloat(gain);
    const costValue = parseFloat(cost);
    if (!costValue) return null;
    const roi = ((gainValue - costValue) / costValue) * 100;
    return {
      roi,
      profitLoss: gainValue - costValue,
      total: gainValue,
    };
  }, [gain, cost]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter your investment cost and final value.",
        "See ROI as a percentage and total profit/loss.",
        "Copy results for your finance notes.",
      ]}
      faqs={[
        {
          question: "What is ROI?",
          answer:
            "ROI shows how much profit or loss you made relative to your investment.",
        },
        {
          question: "How is ROI calculated?",
          answer: "ROI = (Current Value - Cost) ÷ Cost × 100.",
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Final Value
          <input
            type="number"
            value={gain}
            onChange={(e) => setGain(e.target.value)}
            placeholder="Final value"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Investment Cost
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Cost"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            ROI
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {result ? formatPercent(result.roi) : "—"}
          </p>
          {result && <CopyButton text={formatPercent(result.roi)} size="sm" />}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Profit / Loss
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {result ? formatCurrency(result.profitLoss) : "—"}
          </p>
          {result && (
            <CopyButton text={formatCurrency(result.profitLoss)} size="sm" />
          )}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Total Value
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {result ? formatCurrency(result.total) : "—"}
          </p>
          {result && (
            <CopyButton text={formatCurrency(result.total)} size="sm" />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
