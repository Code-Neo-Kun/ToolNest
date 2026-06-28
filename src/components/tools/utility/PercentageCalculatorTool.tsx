"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("percentage-calculator")!;

function fmt(n: number) {
  return isNaN(n) || !isFinite(n) ? "—" : n.toFixed(2).replace(/\.?0+$/, "");
}

export function PercentageCalculatorTool() {
  // Calculator 1: What is X% of Y?
  const [c1x, setC1x] = useState("");
  const [c1y, setC1y] = useState("");
  const c1result = fmt((parseFloat(c1x) / 100) * parseFloat(c1y));

  // Calculator 2: X is what % of Y?
  const [c2x, setC2x] = useState("");
  const [c2y, setC2y] = useState("");
  const c2result = fmt((parseFloat(c2x) / parseFloat(c2y)) * 100);

  // Calculator 3: Percentage change from X to Y
  const [c3x, setC3x] = useState("");
  const [c3y, setC3y] = useState("");
  const c3result = fmt(((parseFloat(c3y) - parseFloat(c3x)) / parseFloat(c3x)) * 100);
  const c3increase = parseFloat(c3y) > parseFloat(c3x);

  // Calculator 4: X increased/decreased by Y%
  const [c4x, setC4x] = useState("");
  const [c4y, setC4y] = useState("");
  const c4add = fmt(parseFloat(c4x) * (1 + parseFloat(c4y) / 100));
  const c4sub = fmt(parseFloat(c4x) * (1 - parseFloat(c4y) / 100));

  const inputClass = "w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-center font-medium focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
  const resultClass = "inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 font-semibold text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 min-w-[80px] justify-center";

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Use the calculator that fits your need.",
        "Enter your values and the result appears instantly.",
        "Copy the result with the copy button.",
      ]}
      faqs={[
        {
          question: "How do I calculate a percentage of a number?",
          answer: "Multiply the number by the percentage then divide by 100. For example, 20% of 150 = (20 × 150) ÷ 100 = 30.",
        },
        {
          question: "How do I calculate percentage change?",
          answer: "Percentage change = ((New - Old) ÷ Old) × 100. A positive result is an increase, negative is a decrease.",
        },
      ]}
    >
      <div className="space-y-6">
        {/* C1 */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">What is X% of Y?</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <input value={c1x} onChange={(e) => setC1x(e.target.value)} placeholder="%" className={inputClass} type="number" />
            <span>% of</span>
            <input value={c1y} onChange={(e) => setC1y(e.target.value)} placeholder="Y" className={inputClass} type="number" />
            <span>=</span>
            <div className={resultClass}>{c1x && c1y ? c1result : "?"}</div>
            {c1x && c1y && c1result !== "—" && <CopyButton text={c1result} size="sm" />}
          </div>
        </div>

        {/* C2 */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">X is what % of Y?</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <input value={c2x} onChange={(e) => setC2x(e.target.value)} placeholder="X" className={inputClass} type="number" />
            <span>is what % of</span>
            <input value={c2y} onChange={(e) => setC2y(e.target.value)} placeholder="Y" className={inputClass} type="number" />
            <span>=</span>
            <div className={resultClass}>{c2x && c2y ? `${c2result}%` : "?"}</div>
            {c2x && c2y && c2result !== "—" && <CopyButton text={`${c2result}%`} size="sm" />}
          </div>
        </div>

        {/* C3 */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Percentage change from X to Y</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span>From</span>
            <input value={c3x} onChange={(e) => setC3x(e.target.value)} placeholder="X" className={inputClass} type="number" />
            <span>to</span>
            <input value={c3y} onChange={(e) => setC3y(e.target.value)} placeholder="Y" className={inputClass} type="number" />
            <span>=</span>
            <div className={`${resultClass} ${c3x && c3y && c3result !== "—" ? (c3increase ? "!bg-green-50 !text-green-700 dark:!bg-green-900/20 dark:!text-green-400" : "!bg-red-50 !text-red-700 dark:!bg-red-900/20 dark:!text-red-400") : ""}`}>
              {c3x && c3y ? `${c3increase ? "+" : ""}${c3result}%` : "?"}
            </div>
            {c3x && c3y && c3result !== "—" && <CopyButton text={`${c3result}%`} size="sm" />}
          </div>
        </div>

        {/* C4 */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Increase/Decrease X by Y%</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <input value={c4x} onChange={(e) => setC4x(e.target.value)} placeholder="X" className={inputClass} type="number" />
            <span>by</span>
            <input value={c4y} onChange={(e) => setC4y(e.target.value)} placeholder="%" className={inputClass} type="number" />
            <span>%</span>
          </div>
          {c4x && c4y && (
            <div className="mt-3 flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">+{c4y}%:</span>
                <div className="rounded-lg bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">{c4add}</div>
                <CopyButton text={c4add} size="sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">-{c4y}%:</span>
                <div className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-400">{c4sub}</div>
                <CopyButton text={c4sub} size="sm" />
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
