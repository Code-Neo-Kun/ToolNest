"use client";
import { useState, useEffect, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("timestamp-converter")!;

const FORMATS = [
  { label: "ISO 8601", fn: (d: Date) => d.toISOString() },
  { label: "UTC", fn: (d: Date) => d.toUTCString() },
  { label: "Local", fn: (d: Date) => d.toLocaleString() },
  { label: "Date only", fn: (d: Date) => d.toISOString().split("T")[0] },
  { label: "Time only (UTC)", fn: (d: Date) => d.toISOString().split("T")[1].replace("Z", "") },
  { label: "Unix (s)", fn: (d: Date) => String(Math.floor(d.getTime() / 1000)) },
  { label: "Unix (ms)", fn: (d: Date) => String(d.getTime()) },
];

function parseInput(raw: string): Date | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // Pure numeric → treat as Unix timestamp
  if (/^\d+$/.test(trimmed)) {
    const n = parseInt(trimmed, 10);
    // Heuristic: if <= 10 digits, assume seconds; else milliseconds
    const ms = trimmed.length <= 10 ? n * 1000 : n;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}

export function TimestampConverterTool() {
  const [input, setInput] = useState("");
  const [nowTs, setNowTs] = useState(() => Math.floor(Date.now() / 1000));

  // Tick every second for "current time" display
  useEffect(() => {
    const id = setInterval(() => setNowTs(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const parsed = useMemo(() => parseInput(input), [input]);

  const rows = useMemo(() => {
    if (!parsed) return [];
    return FORMATS.map(({ label, fn }) => ({ label, value: fn(parsed) }));
  }, [parsed]);

  function loadNow() {
    setInput(String(Math.floor(Date.now() / 1000)));
  }

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-5">
        {/* Live current time bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Current Unix time
          </span>
          <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400">
            {nowTs}
          </span>
          <CopyButton text={String(nowTs)} size="sm" />
          <button
            onClick={loadNow}
            className="ml-auto rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            Use now
          </button>
        </div>

        {/* Input */}
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Enter a Unix timestamp or date string
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 1718000000 or 2024-06-10T12:00:00Z"
            spellCheck={false}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-900"
          />
        </label>

        {input && !parsed && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            Could not parse date — try a Unix timestamp (e.g. <code>1718000000</code>) or an ISO string (e.g. <code>2024-06-10T12:00:00Z</code>).
          </div>
        )}

        {/* Output table */}
        {rows.length > 0 && (
          <div className="rounded-xl border border-slate-200 overflow-hidden dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 w-40">
                    Format
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Value
                  </th>
                  <th className="px-4 py-2.5 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {rows.map(({ label, value }) => (
                  <tr
                    key={label}
                    className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {label}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-800 dark:text-slate-200 break-all">
                      {value}
                    </td>
                    <td className="px-4 py-3">
                      <CopyButton text={value} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Epoch reference */}
        <details className="group rounded-xl border border-slate-200 overflow-hidden dark:border-slate-700">
          <summary className="flex cursor-pointer items-center justify-between gap-2 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 list-none">
            Quick reference — common timestamps
            <span className="text-slate-400 transition-transform group-open:rotate-90">›</span>
          </summary>
          <div className="grid grid-cols-2 gap-2 p-4 text-xs sm:grid-cols-3">
            {[
              { label: "Unix epoch", ts: 0 },
              { label: "Y2K", ts: 946684800 },
              { label: "2010-01-01", ts: 1262304000 },
              { label: "2020-01-01", ts: 1577836800 },
              { label: "2030-01-01", ts: 1893456000 },
              { label: "Max 32-bit (2038)", ts: 2147483647 },
            ].map(({ label, ts }) => (
              <button
                key={label}
                onClick={() => setInput(String(ts))}
                className="flex flex-col gap-0.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:hover:text-indigo-400"
              >
                <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
                <span className="font-mono text-slate-400">{ts}</span>
              </button>
            ))}
          </div>
        </details>
      </div>
    </ToolLayout>
  );
}
