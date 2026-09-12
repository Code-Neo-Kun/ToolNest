"use client";
import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { formatCurrency } from "@neotools/tool-modules";

const tool = getToolBySlug("sip-calculator")!;

function fmt(v: number) {
  return isNaN(v) || !isFinite(v) ? "—" : formatCurrency(v);
}

function calculateSip(monthly: number, annualRate: number, years: number) {
  const n = years * 12;
  const r = annualRate / 100 / 12;
  if (n <= 0) return null;
  const invested = monthly * n;
  let futureValue: number;
  if (r === 0) {
    futureValue = invested;
  } else {
    futureValue = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  }
  const estimatedReturns = futureValue - invested;
  return { invested, futureValue, estimatedReturns };
}

/** Build year-by-year data for the progress chart */
function buildYearlyData(monthly: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const n = y * 12;
    const invested = monthly * n;
    const fv =
      r === 0
        ? invested
        : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    rows.push({ year: y, invested, fv });
  }
  return rows;
}

export function SipCalculatorTool() {
  const [monthly, setMonthly] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");

  const values = useMemo(() => {
    const m = parseFloat(monthly);
    const r = parseFloat(rate);
    const y = parseInt(years, 10);
    if (!m || !y) return null;
    return calculateSip(m, r || 0, y);
  }, [monthly, rate, years]);

  const chartData = useMemo(() => {
    const m = parseFloat(monthly);
    const r = parseFloat(rate);
    const y = parseInt(years, 10);
    if (!m || !y || y > 40) return [];
    return buildYearlyData(m, r || 0, y);
  }, [monthly, rate, years]);

  const maxFv = chartData.length ? Math.max(...chartData.map((d) => d.fv)) : 1;

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Monthly Investment (₹)
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              placeholder="e.g. 5000"
              min="1"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Expected Annual Return (%)
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 12"
              min="0"
              max="100"
              step="0.1"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Investment Duration (years)
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="e.g. 10"
              min="1"
              max="40"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
        </div>

        {/* Result cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Invested Amount",
              value: values ? fmt(values.invested) : "—",
              color: "text-slate-900 dark:text-slate-100",
            },
            {
              label: "Estimated Returns",
              value: values ? fmt(values.estimatedReturns) : "—",
              color: "text-emerald-700 dark:text-emerald-400",
            },
            {
              label: "Total Value",
              value: values ? fmt(values.futureValue) : "—",
              color: "text-indigo-700 dark:text-indigo-400",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {label}
              </p>
              <p className={`mt-4 text-2xl font-bold ${color}`}>{value}</p>
              {values && <CopyButton text={value} size="sm" />}
            </div>
          ))}
        </div>

        {/* Invested vs returns donut-style split bar */}
        {values && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Invested</span>
              <span>Estimated Returns</span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="bg-slate-500 dark:bg-slate-400 transition-all"
                style={{
                  width: `${(values.invested / values.futureValue) * 100}%`,
                }}
              />
              <div
                className="bg-emerald-500 dark:bg-emerald-400 transition-all"
                style={{
                  width: `${(values.estimatedReturns / values.futureValue) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">
                {values.futureValue > 0
                  ? `${((values.invested / values.futureValue) * 100).toFixed(1)}%`
                  : "—"}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {values.futureValue > 0
                  ? `${((values.estimatedReturns / values.futureValue) * 100).toFixed(1)}%`
                  : "—"}
              </span>
            </div>
          </div>
        )}

        {/* Year-by-year growth chart */}
        {chartData.length > 1 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
              Year-by-year growth
            </p>
            <div className="flex items-end gap-1 h-32">
              {chartData.map(({ year, invested, fv }) => (
                <div
                  key={year}
                  className="relative flex-1 flex flex-col items-center justify-end gap-0.5 group"
                  title={`Year ${year}: ${fmt(fv)}`}
                >
                  {/* Returns portion */}
                  <div
                    className="w-full rounded-t bg-emerald-400 dark:bg-emerald-500 transition-all"
                    style={{ height: `${((fv - invested) / maxFv) * 100}%` }}
                  />
                  {/* Invested portion */}
                  <div
                    className="w-full bg-slate-300 dark:bg-slate-600 transition-all"
                    style={{ height: `${(invested / maxFv) * 100}%` }}
                  />
                  {/* Year label every 5 years */}
                  {(year % 5 === 0 || year === 1) && (
                    <span className="absolute -bottom-5 text-[10px] text-slate-400">
                      {year}y
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-7 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-300 dark:bg-slate-600" />
                Invested
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-500" />
                Returns
              </span>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
