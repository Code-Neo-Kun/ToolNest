"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { ShieldCheck, AlertCircle } from "lucide-react";

const tool = getToolBySlug("jwt-decoder")!;

function decodeBase64Url(str: string) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

export function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = (inputToken: string) => {
    setToken(inputToken);
    setError(null);
    if (!inputToken.trim()) {
      setHeader(null);
      setPayload(null);
      return;
    }

    try {
      const parts = inputToken.trim().split(".");
      if (parts.length < 2) {
        throw new Error("Invalid JWT token format. Must contain at least header and payload separated by dots.");
      }

      const decodedHeader = JSON.parse(decodeBase64Url(parts[0]));
      const decodedPayload = JSON.parse(decodeBase64Url(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to decode JWT token.";
      setError(message);
      setHeader(null);
      setPayload(null);
    }
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Paste your JSON Web Token (JWT) into the input box.",
        "View the instantly decoded Header and Payload sections.",
        "Copy header or payload data with one click.",
      ]}
      faqs={[
        {
          question: "Is my JWT sent to a server?",
          answer: "No. Decoding is performed 100% in your browser using JavaScript. Your tokens never leave your machine.",
        },
        {
          question: "What is a JWT?",
          answer: "JSON Web Token (JWT) is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object.",
        },
      ]}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Encoded JWT Token
          </label>
          <textarea
            rows={4}
            value={token}
            onChange={(e) => handleDecode(e.target.value)}
            placeholder="Paste your JWT token here (e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Header */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Header: Algorithm & Token Type
              </span>
              {header && <CopyButton text={header} />}
            </div>
            <pre className="overflow-x-auto font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
              {header || "// Decoded header will appear here"}
            </pre>
          </div>

          {/* Payload */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Payload: Data Claims
              </span>
              {payload && <CopyButton text={payload} />}
            </div>
            <pre className="overflow-x-auto font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
              {payload || "// Decoded payload will appear here"}
            </pre>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Client-side only. Your sensitive authentication tokens remain 100% private.</span>
        </div>
      </div>
    </ToolLayout>
  );
}
