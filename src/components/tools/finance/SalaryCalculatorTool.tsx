"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { Banknote } from "lucide-react";

const tool = getToolBySlug("salary-calculator")!;

export function SalaryCalculatorTool() {
  const [ctc, setCtc] = useState<number>(1200000);
  const [pfContribution, setPfContribution] = useState<number>(21600); // PF per year
  const [professionalTax] = useState<number>(2500); // PT per year

  const grossMonthly = ctc / 12;
  const monthlyPf = pfContribution / 12;
  const monthlyPt = professionalTax / 12;

  // Approx monthly tax (New Regime)
  const taxableAnnual = Math.max(0, ctc - 75000);
  let annualTax = 0;
  if (taxableAnnual > 300000) annualTax += Math.min(taxableAnnual - 300000, 400000) * 0.05;
  if (taxableAnnual > 700000) annualTax += Math.min(taxableAnnual - 700000, 300000) * 0.10;
  if (taxableAnnual > 1000000) annualTax += Math.min(taxableAnnual - 1000000, 200000) * 0.15;
  if (taxableAnnual > 1200000) annualTax += Math.min(taxableAnnual - 1200000, 300000) * 0.20;
  if (taxableAnnual > 1500000) annualTax += (taxableAnnual - 1500000) * 0.30;
  annualTax = Math.round(annualTax * 1.04);

  const monthlyTax = annualTax / 12;
  const inHandMonthly = Math.max(0, Math.round(grossMonthly - monthlyPf - monthlyPt - monthlyTax));

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter your total annual Cost to Company (CTC) in ₹.",
        "Adjust Employee PF and Professional Tax options if needed.",
        "Get your accurate estimated take-home (in-hand) monthly salary.",
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Annual CTC (₹)
            </label>
            <input
              type="number"
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Annual Employee PF (₹)
            </label>
            <input
              type="number"
              value={pfContribution}
              onChange={(e) => setPfContribution(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 dark:border-indigo-900/40 dark:bg-indigo-950/20 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Estimated Monthly Take-Home Salary
          </span>
          <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">
            ₹{inHandMonthly.toLocaleString("en-IN")} <span className="text-sm font-normal text-slate-500">/ month</span>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Gross Monthly Salary</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">₹{Math.round(grossMonthly).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-rose-600">
            <span>Monthly Provident Fund (PF)</span>
            <span>- ₹{Math.round(monthlyPf).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-rose-600">
            <span>Professional Tax (PT)</span>
            <span>- ₹{Math.round(monthlyPt).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-rose-600">
            <span>Income Tax (TDS approx)</span>
            <span>- ₹{Math.round(monthlyTax).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
