"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { TrendingUp } from "lucide-react";

const tool = getToolBySlug("sip-calculator")!;

export function SipCalculatorTool() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [returnRate, setReturnRate] = useState<number>(12); // 12% p.a.
  const [years, setYears] = useState<number>(10);

  const months = years * 12;
  const i = returnRate / 12 / 100;
  const investedAmount = monthlyInvestment * months;

  // SIP Future Value formula: P * ({[1 + i]^n - 1} / i) * (1 + i)
  const futureValue = i > 0
    ? Math.round(monthlyInvestment * ((Math.pow(1 + i, months) - 1) / i) * (1 + i))
    : investedAmount;

  const estimatedReturns = Math.max(0, futureValue - investedAmount);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Set your monthly SIP investment amount.",
        "Set expected annual rate of return (%) and investment period (years).",
        "View total invested capital, estimated returns, and total wealth created.",
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Monthly Investment (₹)
            </label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Expected Return Rate (% p.a.)
            </label>
            <input
              type="number"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Time Period (Years)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500">Invested Amount</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white my-1">
              ₹{investedAmount.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800/40 dark:bg-emerald-950/20">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Est. Wealth Gain</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 my-1">
              ₹{estimatedReturns.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-800/40 dark:bg-indigo-950/20">
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">Total Future Value</span>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 my-1">
              ₹{futureValue.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
