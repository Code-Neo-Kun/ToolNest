"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { RefreshCw, Trash2 } from "lucide-react";

const tool = getToolBySlug("uuid-generator")!;

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function UuidGeneratorTool() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [uppercase, setUppercase] = useState(false);

  const generate = () => {
    const list = Array.from({ length: count }, generateUUID);
    setUuids(uppercase ? list.map((u) => u.toUpperCase()) : list);
  };

  const allText = uuids.join("\n");

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Set how many UUIDs you want to generate.",
        "Click Generate.",
        "Copy individual UUIDs or all at once.",
      ]}
      faqs={[
        {
          question: "What is a UUID?",
          answer: "A UUID (Universally Unique Identifier) is a 128-bit label used to uniquely identify information in software systems. Version 4 UUIDs are randomly generated.",
        },
        {
          question: "Are these UUIDs cryptographically random?",
          answer: "Yes, this generator uses the browser's crypto.randomUUID() API which is cryptographically secure.",
        },
        {
          question: "What is the difference between UUID and GUID?",
          answer: "They are the same thing. GUID (Globally Unique Identifier) is Microsoft's term for UUID.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Count</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer pb-2">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="accent-indigo-600" />
            Uppercase
          </label>
          <Button onClick={generate} className="pb-2">
            <RefreshCw className="h-4 w-4" /> Generate
          </Button>
          {uuids.length > 0 && (
            <>
              <CopyButton text={allText} />
              <Button variant="ghost" size="sm" onClick={() => setUuids([])} className="pb-2">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>

        {uuids.length > 0 && (
          <ul className="space-y-2">
            {uuids.map((uuid, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900"
              >
                <code className="flex-1 font-mono text-sm text-slate-800 dark:text-slate-200">{uuid}</code>
                <CopyButton text={uuid} size="sm" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </ToolLayout>
  );
}
