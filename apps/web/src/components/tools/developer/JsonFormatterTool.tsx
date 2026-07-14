"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("json-formatter")!;

type Status = { type: "success" | "error"; message: string } | null;

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [status, setStatus] = useState<Status>(null);

  const format = () => {
    if (!input.trim()) {
      setOutput("");
      return setStatus({
        type: "error",
        message: "Enter JSON text to format.",
      });
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setStatus({ type: "success", message: "JSON formatted successfully." });
    } catch (e) {
      setOutput("");
      setStatus({ type: "error", message: (e as Error).message });
    }
  };

  const minify = () => {
    if (!input.trim()) {
      setOutput("");
      return setStatus({
        type: "error",
        message: "Enter JSON text to minify.",
      });
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setStatus({ type: "success", message: "JSON minified successfully." });
    } catch (e) {
      setOutput("");
      setStatus({ type: "error", message: (e as Error).message });
    }
  };

  const validate = () => {
    if (!input.trim()) {
      setOutput("");
      return setStatus({
        type: "error",
        message: "Enter JSON text to validate.",
      });
    }

    try {
      JSON.parse(input);
      setStatus({ type: "success", message: "Valid JSON." });
    } catch (e) {
      setOutput("");
      setStatus({ type: "error", message: (e as Error).message });
    }
  };

  const isValid =
    !!input &&
    (() => {
      try {
        JSON.parse(input);
        return true;
      } catch {
        return false;
      }
    })();

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Paste your JSON in the input area.",
        "Click Format to beautify, Minify to compress, or Validate to check.",
        "Copy the result with the Copy button.",
      ]}
      faqs={[
        {
          question: "What is JSON formatting?",
          answer:
            "JSON formatting adds indentation and line breaks to make JSON human-readable. Minifying removes whitespace to reduce file size.",
        },
        {
          question: "Is my JSON data safe?",
          answer:
            "All processing happens in your browser. No data is sent to any server.",
        },
        {
          question: "What indent size should I use?",
          answer:
            "2 spaces is the most common convention. 4 spaces is also widely used, especially in some languages.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={format} disabled={!input}>
            Format
          </Button>
          <Button onClick={minify} variant="secondary" disabled={!input}>
            Minify
          </Button>
          <Button onClick={validate} variant="secondary" disabled={!input}>
            Validate
          </Button>
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {input
              ? isValid
                ? "Valid JSON"
                : "Invalid JSON"
              : "Enter JSON to start."}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {input
            ? "Choose an action to format, minify, or validate your JSON."
            : "Paste JSON into the field below to begin."}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Input JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value", "array": [1, 2, 3]}'
            rows={10}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 outline-none resize-y transition focus:border-[#D85A30] focus:bg-white focus:ring-2 focus:ring-[#D85A30]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            spellCheck={false}
          />
        </div>

        {status && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${status.type === "success" ? "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}
          >
            {status.message}
          </div>
        )}

        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Result
              </label>
              <CopyButton text={output} />
            </div>
            <textarea
              readOnly
              value={output}
              rows={12}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 resize-y"
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
