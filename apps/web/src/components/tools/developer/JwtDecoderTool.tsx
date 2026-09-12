"use client";
import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("jwt-decoder")!;

function base64UrlDecode(str: string): string {
  // Pad to multiple of 4, replace URL-safe chars
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const padded2 = pad ? padded + "=".repeat(4 - pad) : padded;
  try {
    return decodeURIComponent(
      atob(padded2)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
  } catch {
    return atob(padded2);
  }
}

function parseJwt(token: string): {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  error: string | null;
} {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { header: null, payload: null, signature: "", error: "Invalid JWT — must have 3 parts separated by dots." };
  }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;
    const payload = JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>;
    return { header, payload, signature: parts[2], error: null };
  } catch {
    return { header: null, payload: null, signature: "", error: "Failed to decode JWT — check that the token is valid." };
  }
}

function formatTimestamp(value: unknown): string {
  if (typeof value !== "number") return "";
  const date = new Date(value * 1000);
  return ` (${date.toUTCString()})`;
}

function JsonBlock({ data }: { data: Record<string, unknown> }) {
  const lines = Object.entries(data).map(([k, v]) => {
    const isTimestamp = ["exp", "iat", "nbf"].includes(k) && typeof v === "number";
    const display = JSON.stringify(v);
    return { key: k, display, hint: isTimestamp ? formatTimestamp(v) : "" };
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 overflow-x-auto">
      <span className="text-slate-400">{"{"}</span>
      {lines.map(({ key, display, hint }, i) => (
        <div key={key} className="ml-4">
          <span className="text-indigo-600 dark:text-indigo-400">&quot;{key}&quot;</span>
          <span className="text-slate-500">: </span>
          <span className="text-emerald-700 dark:text-emerald-400">{display}</span>
          {hint && <span className="text-slate-400 text-xs">{hint}</span>}
          {i < lines.length - 1 && <span className="text-slate-400">,</span>}
        </div>
      ))}
      <span className="text-slate-400">{"}"}</span>
    </div>
  );
}

function ExpiryBadge({ payload }: { payload: Record<string, unknown> }) {
  if (typeof payload.exp !== "number") return null;
  const now = Math.floor(Date.now() / 1000);
  const expired = payload.exp < now;
  const diff = Math.abs(payload.exp - now);
  const mins = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);
  const label =
    days > 0 ? `${days}d` : hours > 0 ? `${hours}h` : `${mins}m`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        expired
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      }`}
    >
      {expired ? `⛔ Expired ${label} ago` : `✅ Valid — expires in ${label}`}
    </span>
  );
}

export function JwtDecoderTool() {
  const [token, setToken] = useState("");

  const result = useMemo(() => (token.trim() ? parseJwt(token) : null), [token]);

  const SAMPLE =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Paste JWT Token
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            rows={4}
            spellCheck={false}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 outline-none resize-y transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-900"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setToken(SAMPLE)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            Load sample
          </button>
          {token && (
            <button
              onClick={() => setToken("")}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {result?.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {result.error}
          </div>
        )}

        {result && !result.error && result.header && result.payload && (
          <div className="space-y-5">
            {/* Expiry badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <ExpiryBadge payload={result.payload} />
            </div>

            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Header
                </p>
                <CopyButton text={JSON.stringify(result.header, null, 2)} size="sm" />
              </div>
              <JsonBlock data={result.header} />
            </div>

            {/* Payload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Payload
                </p>
                <CopyButton text={JSON.stringify(result.payload, null, 2)} size="sm" />
              </div>
              <JsonBlock data={result.payload} />
            </div>

            {/* Signature */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                Signature (not verified)
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700 break-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {result.signature}
              </div>
              <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Signature verification requires the secret key and is intentionally out of scope for a client-side tool.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
