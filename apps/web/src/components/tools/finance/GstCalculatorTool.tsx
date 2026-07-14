"use client";
import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { calculateGst, formatCurrency } from "@neotools/tool-modules";

const tool = getToolBySlug("gst-calculator")!;

export function GstCalculatorTool() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("18");

  const result = useMemo(() => {
    const amountValue = parseFloat(amount);
    const rateValue = parseFloat(rate);
    if (!amountValue) return null;
    return calculateGst(amountValue, rateValue || 0);
  }, [amount, rate]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter the amount and GST rate.",
        "The calculator shows tax and total payable amount.",
        "Copy the result for invoices or pricing.",
      ]}
      faqs={[
        {
          question: "What is GST?",
          answer:
            "GST is a value-added tax applied to goods and services in many countries.",
        },
        {
          question: "How is GST calculated?",
          answer: "GST = amount × rate ÷ 100. Total = amount + GST.",
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          GST Rate (%)
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Rate"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Tax Amount
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {result ? formatCurrency(result.tax) : "—"}
          </p>
          {result && <CopyButton text={formatCurrency(result.tax)} size="sm" />}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Total Payable
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {result ? formatCurrency(result.total) : "—"}
          </p>
          {result && (
            <CopyButton text={formatCurrency(result.total)} size="sm" />
          )}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Taxable Amount
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {result ? formatCurrency(result.taxableAmount) : "—"}
          </p>
          {result && (
            <CopyButton text={formatCurrency(result.taxableAmount)} size="sm" />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
