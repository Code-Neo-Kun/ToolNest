"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("base64-encoder")!;

type Status = { type: "success" | "error"; message: string } | null;

function encodeUTF8(value: string) {
  const encoder = new TextEncoder();
  const view = encoder.encode(value);
  let binary = "";
  for (const byte of view) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function decodeUTF8(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function Base64EncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [status, setStatus] = useState<Status>(null);

  const process = () => {
    if (!input.trim()) {
      setOutput("");
      return setStatus({
        type: "error",
        message: "Enter text to encode or decode.",
      });
    }

    try {
      const result = mode === "encode" ? encodeUTF8(input) : decodeUTF8(input);
      setOutput(result);
      setStatus({
        type: "success",
        message: `${mode === "encode" ? "Encoded" : "Decoded"} successfully.`,
      });
    } catch (e) {
      setOutput("");
      setStatus({
        type: "error",
        message: `Invalid input for ${mode === "encode" ? "Base64 encoding" : "Base64 decoding"}.`,
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
        "Select Encode or Decode mode.",
        "Paste your text in the input area.",
        "Click the button to process.",
        "Copy the result.",
      ]}
      faqs={[
        {
          question: "What is Base64?",
          answer:
            "Base64 is an encoding scheme that represents binary data as ASCII text. It's commonly used to embed images in HTML/CSS, transmit data in URLs, and store binary data as text.",
        },
        {
          question: "Is Base64 encryption?",
          answer:
            "No. Base64 is encoding, not encryption. It's easily reversible and provides no security.",
        },
        {
          question: "Does this support Unicode?",
          answer:
            "Yes. The encoder handles UTF-8 text including emojis and non-Latin characters.",
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
            ? "Ready to process your input."
            : `Enter ${mode === "encode" ? "plain text" : "Base64"} to start.`}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {mode === "encode" ? "Plain Text" : "Base64 String"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to encode..."
                : "Enter Base64 to decode..."
            }
            rows={6}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm outline-none resize-y transition focus:border-[#D85A30] focus:bg-white focus:ring-2 focus:ring-[#D85A30]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={process} disabled={!input} className="capitalize">
            {mode}
          </Button>
          {output && (
            <Button
              onClick={() =>
                changeMode(mode === "encode" ? "decode" : "encode")
              }
              variant="secondary"
            >
              Swap ↕
            </Button>
          )}
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
                {mode === "encode" ? "Base64 Result" : "Decoded Result"}
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
