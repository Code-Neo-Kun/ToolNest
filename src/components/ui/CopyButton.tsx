"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "md";
}

export function CopyButton({ text, className, size = "md" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium transition-all duration-150",
        size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
        copied
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600",
        className
      )}
    >
      {copied ? (
        <>
          <Check className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
          Copied!
        </>
      ) : (
        <>
          <Copy className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
          Copy
        </>
      )}
    </button>
  );
}
