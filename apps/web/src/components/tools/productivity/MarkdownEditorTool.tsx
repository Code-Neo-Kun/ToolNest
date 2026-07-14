"use client";
import { useMemo, useState } from "react";
import { marked } from "marked";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("markdown-editor")!;

const initialMarkdown = `# Markdown Editor\n\nType markdown on the left to see a preview on the right.\n\n- Bold text with **double stars**\n- Italics with *single stars*\n- Links like [NeoTools](https://neotools.example)\n`;

export function MarkdownEditorTool() {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  const html = useMemo(() => {
    try {
      return marked.parse(markdown);
    } catch {
      return "<p>Unable to render markdown.</p>";
    }
  }, [markdown]);

  const cleanMarkdown = () => {
    setMarkdown((current) =>
      current
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n"),
    );
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Edit markdown in the left pane.",
        "Preview the rendered HTML in the right pane.",
        "Clean formatting and copy rendered or source text.",
      ]}
      faqs={[
        {
          question: "Can I use markdown syntax here?",
          answer:
            "Yes — headings, lists, links, bold, italics and code blocks are supported.",
        },
        {
          question: "How do I copy the preview or markdown?",
          answer:
            "Use the copy buttons in each pane to copy the rendered HTML or markdown source.",
        },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Markdown
            </h2>
            <button
              type="button"
              onClick={cleanMarkdown}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Clean text
            </button>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="min-h-[420px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none shadow-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Source text ready for export.
            </p>
            <CopyButton text={markdown} size="sm" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Preview
            </h2>
            <CopyButton text={html} size="sm" />
          </div>
          <div className="min-h-[420px] overflow-auto rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Rendered HTML is generated live as you type.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
