"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { CheckCircle, XCircle } from "lucide-react";

const tool = getToolBySlug("json-formatter")!;

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState(2);

  const format = () => {
    setError(null);
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    setError(null);
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const validate = () => {
    setError(null);
    try {
      JSON.parse(input);
      setError("✓ Valid JSON");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const isValid = input && (() => { try { JSON.parse(input); return true; } catch { return false; } })();

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
          answer: "JSON formatting adds indentation and line breaks to make JSON human-readable. Minifying removes whitespace to reduce file size.",
        },
        {
          question: "Is my JSON data safe?",
          answer: "All processing happens in your browser. No data is sent to any server.",
        },
        {
          question: "What indent size should I use?",
          answer: "2 spaces is the most common convention. 4 spaces is also widely used, especially in some languages.",
        },
      ]}
    >
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={format}>Format</Button>
          <Button onClick={minify} variant="secondary">Minify</Button>
          <Button onClick={validate} variant="secondary">Validate</Button>
          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm text-slate-600 dark:text-slate-400">Indent:</label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 space</option>
            </select>
          </div>
          {input && (
            <div className="flex items-center gap-1 text-xs">
              {isValid ? (
                <><CheckCircle className="h-3.5 w-3.5 text-green-500" /><span className="text-green-600">Valid</span></>
              ) : (
                <><XCircle className="h-3.5 w-3.5 text-red-500" /><span className="text-red-600">Invalid</span></>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value", "array": [1, 2, 3]}'
            rows={10}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 outline-none resize-y transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            spellCheck={false}
          />
        </div>

        {/* Error */}
        {error && (
          <div className={`rounded-lg px-4 py-3 text-sm ${error.startsWith("✓") ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}>
            {error}
          </div>
        )}

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Result</label>
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
