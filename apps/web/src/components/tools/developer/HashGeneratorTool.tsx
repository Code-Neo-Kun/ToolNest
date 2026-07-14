"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("hash-generator")!;

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

type Status = { type: "success" | "error"; message: string } | null;

async function hashText(text: string, algorithm: Algorithm): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const generate = async () => {
    if (!input.trim()) {
      setHashes({});
      setStatus({ type: "error", message: "Enter text to hash." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const results: Record<string, string> = {};
      for (const algo of ALGORITHMS) {
        results[algo] = await hashText(input, algo);
      }
      setHashes(results);
      setStatus({ type: "success", message: "Hashes generated successfully." });
    } catch (e) {
      setHashes({});
      setStatus({
        type: "error",
        message: "Unable to generate hashes. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter or paste your text.",
        "Click Generate Hashes.",
        "Copy any hash value.",
      ]}
      faqs={[
        {
          question: "What is a hash?",
          answer:
            "A cryptographic hash is a fixed-size string computed from any input. The same input always produces the same hash, but you can't reverse it to get the original text.",
        },
        {
          question: "Which hash algorithm should I use?",
          answer:
            "SHA-256 is the most common for general use. SHA-512 provides more security. SHA-1 is considered weak and should be avoided for security purposes.",
        },
        {
          question: "What happened to MD5?",
          answer:
            "MD5 is not available via the WebCrypto API because it's considered cryptographically broken. Use SHA-256 or better.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {input
            ? "Click Generate Hashes to compute your values."
            : "Enter text in the box below to generate SHA hashes."}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          rows={5}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm outline-none resize-y transition focus:border-[#D85A30] focus:bg-white focus:ring-2 focus:ring-[#D85A30]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          spellCheck={false}
        />

        <Button onClick={generate} loading={loading} disabled={!input}>
          Generate Hashes
        </Button>

        {status && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${status.type === "success" ? "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`}
          >
            {status.message}
          </div>
        )}

        {Object.keys(hashes).length > 0 && (
          <div className="space-y-3">
            {ALGORITHMS.map((algo) => (
              <div key={algo}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {algo}
                  </span>
                  <CopyButton text={hashes[algo]} size="sm" />
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900">
                  <code className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all">
                    {hashes[algo]}
                  </code>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
