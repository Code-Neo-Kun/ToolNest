"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("pdf-split")!;

/** Parse "1-3, 5, 7-9" → [[0,1,2],[4],[6,7,8]] (0-indexed) */
function parseRanges(input: string, total: number): number[][] | string {
  const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return "Enter at least one page range.";
  const groups: number[][] = [];
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      if (isNaN(a) || isNaN(b) || a < 1 || b < a || b > total)
        return `Invalid range "${part}". Pages are 1–${total}.`;
      groups.push(
        Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i),
      );
    } else {
      const n = Number(part);
      if (isNaN(n) || n < 1 || n > total)
        return `Invalid page "${part}". Pages are 1–${total}.`;
      groups.push([n - 1]);
    }
  }
  return groups;
}

export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setError(null);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(doc.getPageCount());
    } catch {
      setError("Could not read the PDF. Is it a valid, non-encrypted file?");
    }
  };

  const split = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const srcBytes = await file.arrayBuffer();
      const src = await PDFDocument.load(srcBytes);
      const groups = parseRanges(ranges, pageCount);
      if (typeof groups === "string") { setError(groups); setLoading(false); return; }

      for (let i = 0; i < groups.length; i++) {
        const doc = await PDFDocument.create();
        const pages = await doc.copyPages(src, groups[i]);
        pages.forEach((p) => doc.addPage(p));
        const bytes = await doc.save();
        const label = groups[i].length === 1
          ? `p${groups[i][0] + 1}`
          : `p${groups[i][0] + 1}-${groups[i][groups[i].length - 1] + 1}`;
        downloadBlob(
          new Blob([bytes], { type: "application/pdf" }),
          `split-${label}.pdf`,
        );
      }
    } catch {
      setError("Failed to split the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a PDF file.",
        'Enter page ranges separated by commas, e.g. "1-3, 5, 7-9".',
        "Click Split PDF — each range downloads as a separate file.",
      ]}
      faqs={[
        {
          question: "How do I specify page ranges?",
          answer:
            'Use comma-separated ranges like "1-3, 5, 8-10". Each range becomes its own PDF.',
        },
        {
          question: "Are my files processed on a server?",
          answer: "No — everything runs locally in your browser via pdf-lib.",
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
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {pageCount} pages detected
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Page ranges
            </label>
            <input
              type="text"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder={`e.g. 1-3, 5, 7-${pageCount}`}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
            <p className="mt-1 text-xs text-slate-400">
              Each range downloads as a separate PDF file.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <Button
            onClick={split}
            loading={loading}
            disabled={!ranges.trim()}
            className="w-full"
          >
            <Download className="h-4 w-4" />
            Split PDF
          </Button>
        </div>
      )}
    </ToolLayout>
  );
}
