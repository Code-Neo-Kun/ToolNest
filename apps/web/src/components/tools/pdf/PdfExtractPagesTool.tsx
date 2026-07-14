"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("pdf-extract-pages")!;

export function PdfExtractPagesTool() {
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

  const selectAll = () =>
    setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i)));

  const extract = async () => {
    if (!file || selected.size === 0) return;
    setLoading(true);
    setError(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const indices = Array.from(selected).sort((a, b) => a - b);
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      downloadBlob(
        new Blob([bytes], { type: "application/pdf" }),
        "extracted-pages.pdf",
      );
    } catch {
      setError("Failed to extract pages. Please try again.");
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
        "Click to select the pages you want to keep.",
        "Click Extract Pages — the selected pages download as a new PDF.",
      ]}
      faqs={[
        {
          question: "How is this different from Split PDF?",
          answer:
            "Split PDF divides a PDF into ranges (multiple output files). Extract Pages lets you cherry-pick any pages and combines them into one output file.",
        },
        {
          question: "Is the original file modified?",
          answer:
            "No. The original file on your device is never touched.",
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
              {pageCount} pages · {selected.size} selected
            </p>
            <div className="flex gap-3">
              <button
                onClick={selectAll}
                className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Select all
              </button>
              {selected.size > 0 && (
                <button
                  onClick={() => setSelected(new Set())}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {pages.map((i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  selected.has(i)
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-600"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
            onClick={extract}
            loading={loading}
            disabled={selected.size === 0}
            className="w-full"
          >
            <Download className="h-4 w-4" />
            Extract {selected.size > 0 ? `${selected.size} ` : ""}Page
            {selected.size !== 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </ToolLayout>
  );
}
