"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("csv-json-converter")!;

export function CsvJsonConverterTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"csv-to-json" | "json-to-csv">(
    "csv-to-json",
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      setError(null);
      if (mode === "csv-to-json") {
        const result = Papa.parse(input.trim(), {
          header: true,
          skipEmptyLines: true,
        });
        if (result.errors.length > 0) {
          throw new Error(result.errors[0].message);
        }
        setOutput(JSON.stringify(result.data, null, 2));
      } else {
        const data = JSON.parse(input);
        setOutput(Papa.unparse(data));
      }
    } catch (err) {
      setOutput("");
      setError((err as Error).message);
    }
  }, [input, mode]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Paste CSV or JSON input.",
        "Switch conversion direction.",
        "Copy the converted output for your workflow.",
      ]}
      faqs={[
        {
          question: "What CSV formats are supported?",
          answer:
            "The tool supports comma-delimited CSV with headers and skips empty lines.",
        },
        {
          question: "Does JSON need to be an array?",
          answer:
            "Yes. JSON should be an array of objects for conversion to CSV.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("csv-to-json")}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${mode === "csv-to-json" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
          >
            CSV → JSON
          </button>
          <button
            type="button"
            onClick={() => setMode("json-to-csv")}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${mode === "json-to-csv" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
          >
            JSON → CSV
          </button>
        </div>

        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Input
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            placeholder={
              mode === "csv-to-json"
                ? "name,age\nAlice,30\nBob,25"
                : '[{"name":"Alice","age":30}]'
            }
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Output
            </div>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            value={output}
            rows={12}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
