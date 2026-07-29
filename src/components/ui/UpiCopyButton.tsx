"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function UpiCopyButton({ upiId }: { upiId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy UPI ID"
      aria-label="Copy UPI ID"
      className="shrink-0 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors
        bg-indigo-50 hover:bg-indigo-100 text-indigo-600
        dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 dark:text-indigo-400"
    >
      {copied ? (
        <><Check className="h-3 w-3" /> Copied!</>
      ) : (
        <><Copy className="h-3 w-3" /> Copy</>
      )}
    </button>
  );
}
