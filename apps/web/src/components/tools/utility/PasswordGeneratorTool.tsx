"use client";
import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { RefreshCw } from "lucide-react";

const tool = getToolBySlug("password-generator")!;

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;':\",./<>?",
};

function getStrength(pwd: string): { label: string; color: string; width: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "25%" };
  if (score <= 4) return { label: "Fair", color: "bg-orange-500", width: "50%" };
  if (score <= 5) return { label: "Good", color: "bg-yellow-500", width: "75%" };
  return { label: "Strong", color: "bg-green-500", width: "100%" };
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const toggle = (key: keyof typeof options) => {
    const active = Object.values({ ...options, [key]: !options[key] }).filter(Boolean).length;
    if (active === 0) return; // at least one must be active
    setOptions((o) => ({ ...o, [key]: !o[key] }));
  };

  const generate = useCallback(() => {
    const charset = Object.entries(options)
      .filter(([, v]) => v)
      .map(([k]) => CHARSETS[k as keyof typeof CHARSETS])
      .join("");
    if (!charset) return;
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const pwd = Array.from(array, (x) => charset[x % charset.length]).join("");
    setPassword(pwd);
    setHistory((h) => [pwd, ...h].slice(0, 5));
  }, [length, options]);

  const strength = password ? getStrength(password) : null;

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Set the password length using the slider.",
        "Toggle character types on or off.",
        "Click Generate Password.",
        "Copy the password.",
      ]}
      faqs={[
        {
          question: "How long should my password be?",
          answer: "At least 12 characters. 16+ is recommended for important accounts. Longer passwords are exponentially harder to crack.",
        },
        {
          question: "Are these passwords stored anywhere?",
          answer: "No. Passwords are generated in your browser using the cryptographically secure crypto.getRandomValues() API. Nothing is sent to any server.",
        },
        {
          question: "Should I include symbols?",
          answer: "Yes, if the service allows it. Symbols significantly increase password entropy.",
        },
      ]}
    >
      <div className="space-y-5">
        {/* Length */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <label className="font-medium text-slate-700 dark:text-slate-300">Length</label>
            <span className="font-semibold text-indigo-600">{length} characters</span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>6</span><span>64</span>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(options).map(([key, val]) => (
            <button
              key={key}
              onClick={() => toggle(key as keyof typeof options)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                val
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                  : "border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <Button onClick={generate} className="w-full">
          <RefreshCw className="h-4 w-4" /> Generate Password
        </Button>

        {password && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <code className="flex-1 font-mono text-lg tracking-wider text-slate-800 dark:text-slate-200 break-all">
                {password}
              </code>
              <CopyButton text={password} />
            </div>

            {strength && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Strength</span>
                  <span className={`font-semibold ${strength.color.replace("bg-", "text-")}`}>{strength.label}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-2 rounded-full transition-all ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {history.length > 1 && (
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Recent passwords</p>
            <ul className="space-y-1">
              {history.slice(1).map((pwd, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <code className="flex-1 font-mono truncate">{pwd}</code>
                  <CopyButton text={pwd} size="sm" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
