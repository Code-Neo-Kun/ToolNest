"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("url-encoder")!;

export function UrlEncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);

  const process = () => {
    setError(null);
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError("Invalid URL encoding. Please check your input.");
      setOutput("");
    }
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Choose Encode or Decode mode.",
        "Paste your URL or encoded string.",
        "Click the button to convert.",
        "Copy the result.",
      ]}
      faqs={[
        {
          question: "What is URL encoding?",
          answer: "URL encoding (percent-encoding) converts characters that aren't allowed in URLs to a safe format. For example, spaces become %20 and & becomes %26.",
        },
        {
          question: "When do I need to URL encode?",
          answer: "When passing parameters in query strings, embedding URLs in other URLs, or sending special characters in API requests.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(""); setError(null); }}
              className={`px-5 py-2 text-sm font-medium transition-colors capitalize ${
                mode === m ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "https://example.com/path?q=hello world&lang=en" : "https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dhello%20world"}
          rows={5}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm outline-none resize-y transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          spellCheck={false}
        />

        <Button onClick={process} className="capitalize">{mode}</Button>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Result</label>
              <CopyButton text={output} />
            </div>
            <textarea
              readOnly
              value={output}
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 resize-y"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
