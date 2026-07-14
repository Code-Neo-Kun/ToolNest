"use client";
import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import {
  calculateCompoundInterest,
  formatCurrency,
} from "@neotools/tool-modules";

const tool = getToolBySlug("compound-interest-calculator")!;

function formatPercent(value: number) {
  return isNaN(value) || !isFinite(value) ? "—" : `${value.toFixed(2)}%`;
}

export function CompoundInterestCalculatorTool() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("1");
  const [compounds, setCompounds] = useState("1");

  const result = useMemo(() => {
    const principalValue = parseFloat(principal);
    const rateValue = parseFloat(rate);
    const yearsValue = parseFloat(years);
    const compoundsValue = parseInt(compounds, 10);
    if (!principalValue || !yearsValue || !compoundsValue) return null;
    return calculateCompoundInterest(
      principalValue,
      rateValue || 0,
      yearsValue,
      compoundsValue,
    );
  }, [principal, rate, years, compounds]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter the principal, annual rate, years, and compounding frequency.",
        "The calculator shows the final amount and total interest earned.",
        "Copy any result to use in your investment planning.",
      ]}
      faqs={[
        {
          question: "What is compound interest?",
          answer:
            "Compound interest is interest earned on the original amount plus the interest reinvested each period.",
        },
        {
          question: "What is compounding frequency?",
          answer:
            "Compounding frequency is how often interest is added to the balance each year.",
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Principal Amount
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="Principal"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Annual Interest Rate (%)
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Rate"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Years
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="Years"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Compounds per year
          <input
            type="number"
            value={compounds}
            onChange={(e) => setCompounds(e.target.value)}
            placeholder="1, 2, 4, 12"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Final Amount
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {result ? formatCurrency(result.finalAmount) : "—"}
          </p>
          {result && (
            <CopyButton text={formatCurrency(result.finalAmount)} size="sm" />
          )}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Total Interest
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {result ? formatCurrency(result.totalInterest) : "—"}
          </p>
          {result && (
            <CopyButton text={formatCurrency(result.totalInterest)} size="sm" />
          )}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Effective ROI
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {result
              ? formatPercent(
                  (result.finalAmount / parseFloat(principal || "0") - 1) * 100,
                )
              : "—"}
          </p>
          {result && (
            <CopyButton
              text={formatPercent(
                (result.finalAmount / parseFloat(principal || "0") - 1) * 100,
              )}
              size="sm"
            />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
