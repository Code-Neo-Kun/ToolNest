"use client";
import { useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("unit-converter")!;

const converters = {
  length: {
    label: "Length",
    units: [
      { key: "m", label: "Meters", factor: 1 },
      { key: "km", label: "Kilometers", factor: 1000 },
      { key: "mi", label: "Miles", factor: 1609.34 },
      { key: "ft", label: "Feet", factor: 0.3048 },
    ],
  },
  weight: {
    label: "Weight",
    units: [
      { key: "kg", label: "Kilograms", factor: 1 },
      { key: "g", label: "Grams", factor: 0.001 },
      { key: "lb", label: "Pounds", factor: 0.453592 },
      { key: "oz", label: "Ounces", factor: 0.0283495 },
    ],
  },
};

export function UnitConverterTool() {
  const [category, setCategory] = useState<keyof typeof converters>("length");
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState(converters.length.units[0].key);
  const [to, setTo] = useState(converters.length.units[1].key);

  const categoryData = converters[category];
  const output = useMemo(() => {
    const fromUnit = categoryData.units.find((u) => u.key === from);
    const toUnit = categoryData.units.find((u) => u.key === to);
    if (!fromUnit || !toUnit) return "";
    return ((value * fromUnit.factor) / toUnit.factor).toFixed(4);
  }, [categoryData, from, to, value]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Choose the unit category.",
        "Enter the value and select from/to units.",
        "Copy the converted result.",
      ]}
      faqs={[
        {
          question: "What units are supported?",
          answer:
            "Length and weight units are supported for basic conversions.",
        },
        {
          question: "Is this accurate?",
          answer:
            "This uses fixed factors for standard conversions and is suitable for everyday use.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Category
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as keyof typeof converters)
              }
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {Object.entries(converters).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Value
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            From
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {categoryData.units.map((unit) => (
                <option key={unit.key} value={unit.key}>
                  {unit.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            To
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {categoryData.units.map((unit) => (
                <option key={unit.key} value={unit.key}>
                  {unit.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Converted result
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {output} {categoryData.units.find((u) => u.key === to)?.label}
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
