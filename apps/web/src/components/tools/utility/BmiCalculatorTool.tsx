"use client";
import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("bmi-calculator")!;

export function BmiCalculatorTool() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const result = useMemo(() => {
    if (!height || !weight) return null;
    const meters = height / 100;
    const bmi = weight / (meters * meters);
    if (bmi <= 0 || Number.isNaN(bmi)) return null;
    return {
      value: bmi,
      category:
        bmi < 18.5
          ? "Underweight"
          : bmi < 25
            ? "Normal"
            : bmi < 30
              ? "Overweight"
              : "Obese",
    };
  }, [height, weight]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter your weight and height.",
        "Calculate your BMI instantly.",
        "Use the category guidance for general health awareness.",
      ]}
      faqs={[
        {
          question: "What does BMI measure?",
          answer:
            "BMI measures body mass relative to height, but it does not account for muscle mass or body composition.",
        },
        {
          question: "Is BMI a medical diagnosis?",
          answer:
            "No. It is a general guideline and should not replace medical advice.",
        },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Weight (kg)
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Height (cm)
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        {result && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">BMI</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-slate-100">
              {result.value.toFixed(1)}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {result.category}
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
