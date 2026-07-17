"use client";
import { useState } from "react";
import { marked } from "marked";
import TurndownService from "turndown";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("markdown-html-converter")!;
const turndownService = new TurndownService();

export function MarkdownHtmlConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"md-to-html" | "html-to-md">("md-to-html");

  const convert = async () => {
    if (mode === "md-to-html") {
      // marked() returns string | Promise<string> depending on version/config
      const result = await Promise.resolve(marked(input));
      setOutput(result as string);
    } else {
      setOutput(turndownService.turndown(input));
    }
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Paste Markdown or HTML into the editor.",
        "Choose the conversion direction.",
        "Copy the generated output for your project.",
      ]}
      faqs={[
        {
          question: "Can this convert complex Markdown?",
          answer:
            "It supports common Markdown elements like headings, lists, links, images, and code blocks.",
        },
        {
          question: "Does it preserve HTML formatting?",
          answer:
            "Yes, HTML is converted back to Markdown while preserving structure as much as possible.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("md-to-html")}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${mode === "md-to-html" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
          >
            Markdown → HTML
          </button>
          <button
            type="button"
            onClick={() => setMode("html-to-md")}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${mode === "html-to-md" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
          >
            HTML → Markdown
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Input
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={12}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Output
              </span>
              <CopyButton text={output} />
            </div>
            <textarea
              readOnly
              value={output}
              rows={12}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>
        </div>

        <Button onClick={convert} className="w-full">
          Convert
        </Button>
      </div>
    </ToolLayout>
  );
}
