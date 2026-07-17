"use client";
import { useState, useEffect, useCallback } from "react";
import { marked } from "marked";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadFile } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("markdown-editor")!;

// Configure marked for synchronous operation
marked.setOptions({ async: false });

const INITIAL_MARKDOWN = `# Welcome to Markdown Editor

Write your Markdown on the left and see a live preview on the right.

## Formatting

**Bold**, *italic*, and \`inline code\` are all supported.

## Lists

- Item one
- Item two
- Item three

## Code blocks

\`\`\`javascript
const greeting = "Hello, world!";
console.log(greeting);
\`\`\`

## Links & Images

[Visit ToolNest](https://toolnest.app)

> Blockquotes work too — great for callouts and notes.
`;

export function MarkdownEditorTool() {
  const [markdown, setMarkdown] = useState(INITIAL_MARKDOWN);
  const [html, setHtml] = useState("");
  const [activeTab, setActiveTab] = useState<"split" | "preview">("split");
  const [wordCount, setWordCount] = useState(0);

  // Render markdown → HTML asynchronously to handle both sync & async marked
  useEffect(() => {
    let cancelled = false;
    Promise.resolve(marked.parse(markdown))
      .then((result) => {
        if (!cancelled) setHtml(result as string);
      })
      .catch(() => {
        if (!cancelled) setHtml("<p>Unable to render Markdown.</p>");
      });

    // Word count
    const words = markdown.trim().replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    return () => { cancelled = true; };
  }, [markdown]);

  const cleanText = useCallback(() => {
    setMarkdown((curr) =>
      curr
        .split("\n")
        .map((l) => l.trimEnd())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim(),
    );
  }, []);

  const clearAll = useCallback(() => setMarkdown(""), []);

  const downloadMd = useCallback(() => {
    downloadFile(markdown, "document.md", "text/markdown");
  }, [markdown]);

  const downloadHtml = useCallback(() => {
    const full = `<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>Document</title></head>\n<body>\n${html}\n</body>\n</html>`;
    downloadFile(full, "document.html", "text/html");
  }, [html]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Type or paste your Markdown in the editor pane.",
        "The preview updates live as you type.",
        "Use the toolbar buttons to clean formatting, copy, or download.",
        "Switch to Preview-only mode on mobile for a distraction-free read.",
      ]}
      faqs={[
        {
          question: "Is my content sent to a server?",
          answer:
            "No. Everything runs in your browser. Nothing is uploaded anywhere.",
        },
        {
          question: "What Markdown syntax is supported?",
          answer:
            "CommonMark: headings, bold, italic, code, lists, blockquotes, links, images, tables, and fenced code blocks.",
        },
        {
          question: "Can I export my document?",
          answer:
            "Yes — download as .md (Markdown source) or .html (rendered HTML page).",
        },
        {
          question: "Does it auto-save?",
          answer:
            "There is no server-side saving, but your browser session keeps the content while the tab stays open.",
        },
      ]}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        {/* View toggle */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden dark:border-slate-700">
          {(["split", "preview"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {tab === "split" ? "Editor + Preview" : "Preview only"}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">{wordCount} words</span>
          <Button size="sm" variant="ghost" onClick={cleanText}>
            Clean
          </Button>
          <Button size="sm" variant="ghost" onClick={clearAll}>
            Clear
          </Button>
          <Button size="sm" variant="secondary" onClick={downloadMd}>
            <Download className="h-3.5 w-3.5" /> .md
          </Button>
          <Button size="sm" variant="secondary" onClick={downloadHtml}>
            <Download className="h-3.5 w-3.5" /> .html
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${activeTab === "split" ? "lg:grid-cols-2" : ""}`}>
        {/* Editor — hidden in preview-only mode */}
        {activeTab === "split" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Markdown
              </span>
              <CopyButton text={markdown} />
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
              className="min-h-[520px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none resize-y transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Start writing Markdown…"
            />
          </div>
        )}

        {/* Preview */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Preview
            </span>
            <CopyButton text={html} />
          </div>
          <div
            className="min-h-[520px] overflow-auto rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950
              prose prose-sm prose-slate max-w-none
              dark:prose-invert
              prose-headings:font-bold
              prose-code:before:content-none prose-code:after:content-none
              prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5
              dark:prose-code:bg-slate-800"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </ToolLayout>
  );
}


