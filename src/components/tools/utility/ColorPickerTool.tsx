"use client";
import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("color-picker")!;

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

const SWATCHES = [
  "#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#8b5cf6","#ec4899",
  "#ffffff","#f8fafc","#cbd5e1","#64748b","#1e293b","#0f172a","#000000",
];

export function ColorPickerTool() {
  const [color, setColor] = useState("#6366f1");

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const parseInput = useCallback((val: string) => {
    const clean = val.startsWith("#") ? val : `#${val}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) setColor(clean);
  }, []);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Use the color picker or type a HEX code.",
        "Copy the color in HEX, RGB, or HSL format.",
        "Click any swatch for quick color selection.",
      ]}
      faqs={[
        {
          question: "What is the difference between HEX, RGB, and HSL?",
          answer: "HEX is a 6-digit hexadecimal code common in CSS. RGB defines colors by red, green, and blue intensity (0–255). HSL uses hue (0–360°), saturation, and lightness for a more intuitive model.",
        },
        {
          question: "Which format should I use in CSS?",
          answer: "All three work in CSS. HSL is great for creating color variations (lighten/darken). HEX is most common in design tools.",
        },
      ]}
    >
      <div className="space-y-6">
        {/* Color picker + preview */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex flex-col items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-24 w-24 cursor-pointer rounded-2xl border-0 p-0"
              aria-label="Pick a color"
            />
            <div
              className="h-12 w-24 rounded-xl border border-slate-200 shadow-sm"
              style={{ background: color }}
              aria-label={`Color preview: ${color}`}
            />
          </div>

          <div className="flex-1 space-y-3 w-full">
            {/* HEX input */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">HEX</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  defaultValue={color}
                  key={color}
                  onChange={(e) => parseInput(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm uppercase focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  maxLength={7}
                />
                <CopyButton text={color} />
              </div>
            </div>

            {/* RGB */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">RGB</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  {rgbStr}
                </div>
                <CopyButton text={rgbStr} />
              </div>
            </div>

            {/* HSL */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">HSL</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  {hslStr}
                </div>
                <CopyButton text={hslStr} />
              </div>
            </div>
          </div>
        </div>

        {/* Swatches */}
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Quick Swatches</p>
          <div className="flex flex-wrap gap-2">
            {SWATCHES.map((s) => (
              <button
                key={s}
                onClick={() => setColor(s)}
                title={s}
                style={{ background: s }}
                className={`h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110 ${color === s ? "border-indigo-500 scale-110" : "border-slate-200 dark:border-slate-600"}`}
                aria-label={`Select color ${s}`}
              />
            ))}
          </div>
        </div>

        {/* RGB sliders */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">RGB Sliders</p>
          {(["r", "g", "b"] as const).map((channel) => (
            <div key={channel} className="flex items-center gap-3">
              <span className="w-4 text-sm font-semibold uppercase text-slate-600 dark:text-slate-400">{channel}</span>
              <input
                type="range"
                min={0}
                max={255}
                value={rgb[channel]}
                onChange={(e) => {
                  const updated = { ...rgb, [channel]: Number(e.target.value) };
                  const hex = `#${[updated.r, updated.g, updated.b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
                  setColor(hex);
                }}
                className="flex-1 accent-indigo-600"
              />
              <span className="w-8 text-right text-sm text-slate-600 dark:text-slate-400">{rgb[channel]}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
