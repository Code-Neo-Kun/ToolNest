"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download, Trash2 } from "lucide-react";

const tool = getToolBySlug("pdf-remove-pages")!;

export function PdfRemovePagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setSelected(new Set());
    setError(null);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(doc.getPageCount());
    } catch {
      setError("Could not read the PDF. Make sure it is not encrypted.");
    }
  };

  const toggle = (page: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(page) ? next.delete(page) : next.add(page);
      return next;
    });
  };

  const removePages = async () => {
    if (!file || selected.size === 0) return;
    if (selected.size >= pageCount) {
      setError("You can't remove all pages — at least one must remain.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const keep = src
        .getPageIndices()
        .filter((i) => !selected.has(i));
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, keep);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(new Blob([bytes], { type: "application/pdf" }), "removed-pages.pdf");
    } catch {
      setError("Failed to process the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a PDF file.",
        "Click the page numbers you want to delete — they highlight in red.",
        "Click Remove Selected Pages to download the cleaned PDF.",
      ]}
      faqs={[
        {
          question: "Can I undo the removal?",
          answer:
            "The original file on your device is never modified. Just re-upload it if you need to start over.",
        },
        {
          question: "Is there a limit on pages?",
          answer: "No — works for PDFs of any length.",
        },
      ]}
    >
      <FileUploader
        accept="application/pdf"
        onFilesSelected={handleFile}
        label="Drop a PDF here or click to browse"
      />

      {file && pageCount > 0 && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {pageCount} pages · {selected.size} selected for removal
            </p>
            {selected.size > 0 && (
              <button
                onClick={() => setSelected(new Set())}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                Clear selection
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {pages.map((i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  selected.has(i)
                    ? "border-red-400 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <Button
            onClick={removePages}
            loading={loading}
            disabled={selected.size === 0}
            variant="danger"
            className="w-full"
          >
            <Trash2 className="h-4 w-4" />
            Remove {selected.size > 0 ? selected.size : ""} Selected Page
            {selected.size !== 1 ? "s" : ""}
          </Button>

          {selected.size > 0 && (
            <Button
              onClick={removePages}
              loading={loading}
              disabled={selected.size === 0}
              className="w-full"
            >
              <Download className="h-4 w-4" />
              Download Result
            </Button>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
