"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { Calculator } from "lucide-react";

const tool = getToolBySlug("income-tax-calculator")!;

function calculateNewRegimeTax(income: number) {
  // Standard Deduction: 75,000 for FY 2025-26
  const taxable = Math.max(0, income - 75000);
  if (taxable <= 300000) return 0;
  if (taxable <= 700000) return 0; // Rebate 87A under new regime up to 7L taxable

  let tax = 0;
  if (taxable > 300000) tax += Math.min(taxable - 300000, 400000) * 0.05;
  if (taxable > 700000) tax += Math.min(taxable - 700000, 300000) * 0.10;
  if (taxable > 1000000) tax += Math.min(taxable - 1000000, 200000) * 0.15;
  if (taxable > 1200000) tax += Math.min(taxable - 1200000, 300000) * 0.20;
  if (taxable > 1500000) tax += (taxable - 1500000) * 0.30;

  return Math.round(tax * 1.04); // 4% Cess
}

function calculateOldRegimeTax(income: number, deductions: number) {
  const taxable = Math.max(0, income - 50000 - deductions); // 50k std deduction
  if (taxable <= 250000) return 0;
  if (taxable <= 500000) return 0; // Rebate up to 5L

  let tax = 0;
  if (taxable > 250000) tax += Math.min(taxable - 250000, 250000) * 0.05;
  if (taxable > 500000) tax += Math.min(taxable - 500000, 500000) * 0.20;
  if (taxable > 1000000) tax += (taxable - 1000000) * 0.30;

  return Math.round(tax * 1.04); // 4% Cess
}

export function IncomeTaxCalculatorTool() {
  const [annualIncome, setAnnualIncome] = useState<number>(1200000);
  const [deductions, setDeductions] = useState<number>(150000); // 80C default

  const newTax = calculateNewRegimeTax(annualIncome);
  const oldTax = calculateOldRegimeTax(annualIncome, deductions);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter your gross annual income in ₹ (INR).",
        "Enter total Old Regime deductions (80C, 80D, HRA, NPS).",
        "Compare tax payable under New Regime vs Old Regime side by side.",
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Gross Annual Income (₹)
            </label>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Old Regime Deductions (80C, 80D, HRA) (₹)
            </label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* New Regime */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-800/40 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-emerald-800 dark:text-emerald-400">New Tax Regime</span>
              <span className="rounded-full bg-emerald-200 text-emerald-900 px-2 py-0.5 text-xs font-bold dark:bg-emerald-900 dark:text-emerald-300">
                Default
              </span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 my-2">
              ₹{newTax.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Includes ₹75,000 Standard Deduction & 4% Health & Education Cess.
            </p>
          </div>

          {/* Old Regime */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-800/40 dark:bg-blue-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-blue-800 dark:text-blue-400">Old Tax Regime</span>
            </div>
            <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 my-2">
              ₹{oldTax.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Includes ₹50,000 Standard Deduction + ₹{deductions.toLocaleString("en-IN")} custom deductions.
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 flex items-center gap-3">
          <Calculator className="h-5 w-5 text-indigo-500 shrink-0" />
          <span>
            <strong>Recommendation:</strong> {newTax <= oldTax ? "New Tax Regime saves you more money!" : "Old Tax Regime saves you more money!"}
          </span>
        </div>
      </div>
    </ToolLayout>
  );
}
