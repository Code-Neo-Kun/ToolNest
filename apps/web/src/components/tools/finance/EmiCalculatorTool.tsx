"use client";
import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateEmi, formatCurrency } from "@neotools/tool-modules";

const tool = getToolBySlug("emi-calculator")!;

function fmt(value: number) {
  return isNaN(value) || !isFinite(value) ? "—" : formatCurrency(value);
}

export function EmiCalculatorTool() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");

  const values = useMemo(() => {
    const principalValue = parseFloat(principal);
    const rateValue = parseFloat(rate);
    const monthsValue = parseInt(months, 10);
    if (!principalValue || !monthsValue) return null;
    return calculateEmi(principalValue, rateValue || 0, monthsValue);
  }, [principal, rate, months]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter the loan amount, annual interest rate, and duration.",
        "The calculator shows your monthly EMI, total payable amount, and interest cost.",
        "Copy any result using the copy buttons.",
      ]}
      faqs={[
        {
          question: "What does EMI mean?",
          answer:
            "EMI is the fixed monthly payment you make to repay a loan, including interest.",
        },
        {
          question: "How is total interest calculated?",
          answer:
            "Total interest is the total amount paid over the loan term minus the original principal.",
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Loan Amount
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
            placeholder="Interest rate"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Loan Term (months)
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            placeholder="Months"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Monthly EMI
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {values ? fmt(values.emi) : "—"}
          </p>
          {values && <CopyButton text={fmt(values.emi)} size="sm" />}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Total Payable
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {values ? fmt(values.totalPayable) : "—"}
          </p>
          {values && <CopyButton text={fmt(values.totalPayable)} size="sm" />}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Total Interest
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {values ? fmt(values.totalInterest) : "—"}
          </p>
          {values && <CopyButton text={fmt(values.totalInterest)} size="sm" />}
        </div>
      </div>
    </ToolLayout>
  );
}
