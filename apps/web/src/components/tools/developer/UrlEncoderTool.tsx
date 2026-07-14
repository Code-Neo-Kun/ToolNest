"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("url-encoder")!;

type Status = { type: "success" | "error"; message: string } | null;

export function UrlEncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [status, setStatus] = useState<Status>(null);

  const process = () => {
    if (!input.trim()) {
      setStatus({ type: "error", message: "Enter a URL or encoded string." });
      setOutput("");
      return;
    }

    try {
      const result =
        mode === "encode"
          ? encodeURIComponent(input)
          : decodeURIComponent(input);
      setOutput(result);
      setStatus({
        type: "success",
        message: `${mode === "encode" ? "Encoded" : "Decoded"} successfully.`,
      });
    } catch {
      setOutput("");
      setStatus({
        type: "error",
        message: "Invalid URL encoding. Please check your input.",
      });
    }
  };

  const changeMode = (nextMode: "encode" | "decode") => {
    setMode(nextMode);
    setOutput("");
    setStatus(null);
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
          answer:
            "URL encoding (percent-encoding) converts characters that aren't allowed in URLs to a safe format. For example, spaces become %20 and & becomes %26.",
        },
        {
          question: "When do I need to URL encode?",
          answer:
            "When passing parameters in query strings, embedding URLs in other URLs, or sending special characters in API requests.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => changeMode(m)}
              className={`px-5 py-2 text-sm font-medium transition-colors capitalize ${
                mode === m
                  ? "bg-[#D85A30] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {input
            ? "Press Convert to get your result."
            : "Enter a URL or encoded string to begin."}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {mode === "encode" ? "URL" : "Encoded URL"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "https://example.com/path?q=hello world&lang=en"
                : "https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dhello%20world"
            }
            rows={6}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm outline-none resize-y transition focus:border-[#D85A30] focus:bg-white focus:ring-2 focus:ring-[#D85A30]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            spellCheck={false}
          />
        </div>

        <Button onClick={process} disabled={!input} className="capitalize">
          Convert
        </Button>

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
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 resize-y"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
