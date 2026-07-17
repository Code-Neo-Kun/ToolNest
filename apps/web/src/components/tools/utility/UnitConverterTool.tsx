"use client";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("unit-converter")!;

type Unit = { key: string; label: string; factor?: number; toBase?: (v: number) => number; fromBase?: (v: number) => number };
type Category = { label: string; units: Unit[] };

// For linear units use factor (value in base unit = input * factor).
// For temperature, provide toBase/fromBase functions.
const converters: Record<string, Category> = {
  length: {
    label: "Length",
    units: [
      { key: "mm", label: "Millimeters", factor: 0.001 },
      { key: "cm", label: "Centimeters", factor: 0.01 },
      { key: "m", label: "Meters", factor: 1 },
      { key: "km", label: "Kilometers", factor: 1000 },
      { key: "in", label: "Inches", factor: 0.0254 },
      { key: "ft", label: "Feet", factor: 0.3048 },
      { key: "yd", label: "Yards", factor: 0.9144 },
      { key: "mi", label: "Miles", factor: 1609.344 },
    ],
  },
  weight: {
    label: "Weight / Mass",
    units: [
      { key: "mg", label: "Milligrams", factor: 0.000001 },
      { key: "g", label: "Grams", factor: 0.001 },
      { key: "kg", label: "Kilograms", factor: 1 },
      { key: "t", label: "Metric Tons", factor: 1000 },
      { key: "oz", label: "Ounces", factor: 0.0283495 },
      { key: "lb", label: "Pounds", factor: 0.453592 },
      { key: "st", label: "Stone", factor: 6.35029 },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      {
        key: "c", label: "Celsius",
        toBase: (v) => v,           // base = Celsius
        fromBase: (v) => v,
      },
      {
        key: "f", label: "Fahrenheit",
        toBase: (v) => (v - 32) * 5 / 9,
        fromBase: (v) => v * 9 / 5 + 32,
      },
      {
        key: "k", label: "Kelvin",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
  area: {
    label: "Area",
    units: [
      { key: "mm2", label: "mm²", factor: 0.000001 },
      { key: "cm2", label: "cm²", factor: 0.0001 },
      { key: "m2", label: "m²", factor: 1 },
      { key: "km2", label: "km²", factor: 1_000_000 },
      { key: "in2", label: "in²", factor: 0.00064516 },
      { key: "ft2", label: "ft²", factor: 0.092903 },
      { key: "ac", label: "Acres", factor: 4046.86 },
      { key: "ha", label: "Hectares", factor: 10_000 },
    ],
  },
  speed: {
    label: "Speed",
    units: [
      { key: "mps", label: "m/s", factor: 1 },
      { key: "kph", label: "km/h", factor: 1 / 3.6 },
      { key: "mph", label: "mph", factor: 0.44704 },
      { key: "knot", label: "Knots", factor: 0.514444 },
    ],
  },
  data: {
    label: "Data Size",
    units: [
      { key: "b", label: "Bits", factor: 1 / 8 },
      { key: "B", label: "Bytes", factor: 1 },
      { key: "KB", label: "Kilobytes", factor: 1024 },
      { key: "MB", label: "Megabytes", factor: 1024 ** 2 },
      { key: "GB", label: "Gigabytes", factor: 1024 ** 3 },
      { key: "TB", label: "Terabytes", factor: 1024 ** 4 },
    ],
  },
};

function convert(value: number, from: Unit, to: Unit): number {
  // Temperature uses custom functions
  if (from.toBase && to.fromBase) {
    return to.fromBase(from.toBase(value));
  }
  // Linear
  const fromFactor = from.factor ?? 1;
  const toFactor = to.factor ?? 1;
  return (value * fromFactor) / toFactor;
}

export function UnitConverterTool() {
  const categoryKeys = Object.keys(converters) as (keyof typeof converters)[];
  const [categoryKey, setCategoryKey] = useState(categoryKeys[0]);
  const category = converters[categoryKey];

  // Always reset from/to when category changes
  const [from, setFrom] = useState(category.units[0].key);
  const [to, setTo] = useState(category.units[1].key);
  const [value, setValue] = useState<string>("1");

  const handleCategoryChange = (key: string) => {
    const cat = converters[key];
    setCategoryKey(key);
    setFrom(cat.units[0].key);
    setTo(cat.units[1].key);
  };

  const output = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "—";
    const fromUnit = category.units.find((u) => u.key === from);
    const toUnit = category.units.find((u) => u.key === to);
    if (!fromUnit || !toUnit) return "—";
    const result = convert(num, fromUnit, toUnit);
    // Show up to 8 significant figures, strip trailing zeros
    return parseFloat(result.toPrecision(8)).toString();
  }, [category, from, to, value]);

  const toUnit = category.units.find((u) => u.key === to);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Choose a unit category.",
        "Enter a value and select the From and To units.",
        "The result updates instantly.",
      ]}
      faqs={[
        {
          question: "What unit categories are supported?",
          answer:
            "Length, weight/mass, temperature, area, speed, and data size.",
        },
        {
          question: "How accurate are the conversions?",
          answer:
            "Results use up to 8 significant figures using standard conversion factors.",
        },
        {
          question: "Why does the result change when I switch category?",
          answer:
            "The from/to units reset to the first two in the new category to avoid stale values.",
        },
      ]}
    >
      <div className="space-y-5">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                categoryKey === key
                  ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {converters[key].label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Value
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          {/* From */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              From
            </label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {category.units.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              To
            </label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {category.units.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
          <div>
            <p className="text-xs text-slate-400 mb-1">Result</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {output}
              {toUnit && (
                <span className="ml-2 text-base font-normal text-slate-500">
                  {toUnit.label}
                </span>
              )}
            </p>
          </div>
          <CopyButton text={output} />
        </div>
      </div>
    </ToolLayout>
  );
}
