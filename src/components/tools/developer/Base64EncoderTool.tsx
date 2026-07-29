"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("base64-encoder")!;

export function Base64EncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState<string | null>(null);

  const process = () => {
    setError(null);
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError(`Invalid input for ${mode === "encode" ? "Base64 encoding" : "Base64 decoding"}`);
      setOutput("");
    }
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
    setError(null);
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Select Encode or Decode mode.",
        "Paste your text in the input area.",
        "Click the button to process.",
        "Copy the result.",
      ]}
      faqs={[
        {
          question: "What is Base64?",
          answer: "Base64 is an encoding scheme that represents binary data as ASCII text. It's commonly used to embed images in HTML/CSS, transmit data in URLs, and store binary data as text.",
        },
        {
          question: "Is Base64 encryption?",
          answer: "No. Base64 is encoding, not encryption. It's easily reversible and provides no security.",
        },
        {
          question: "Does this support Unicode?",
          answer: "Yes. The encoder handles UTF-8 text including emojis and non-Latin characters.",
        },
      ]}
    >
      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden w-fit">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(""); setError(null); }}
              className={`px-5 py-2 text-sm font-medium transition-colors capitalize ${
                mode === m
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {mode === "encode" ? "Plain Text" : "Base64 String"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
            rows={6}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm outline-none resize-y transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            spellCheck={false}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={process} className="capitalize">{mode}</Button>
          {output && <Button onClick={swap} variant="secondary">Swap ↕</Button>}
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {mode === "encode" ? "Base64 Encoded" : "Decoded Text"}
              </label>
              <CopyButton text={output} />
            </div>
            <textarea
              readOnly
              value={output}
              rows={6}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 resize-y"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
