"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { Download, GripVertical, X } from "lucide-react";

const tool = getToolBySlug("pdf-merge")!;

interface PdfEntry {
  file: File;
  id: string;
}

export function PdfMergeTool() {
  const [entries, setEntries] = useState<PdfEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const addFiles = (files: File[]) => {
    const newEntries = files.map((f) => ({
      file: f,
      id: `${f.name}-${Date.now()}-${Math.random()}`,
    }));
    setEntries((prev) => [...prev, ...newEntries]);
    setError(null);
  };

  const remove = (id: string) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  // Drag-to-reorder
  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    setEntries((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIdx(i);
  };
  const onDragEnd = () => setDragIdx(null);

  const merge = async () => {
    if (entries.length < 2) {
      setError("Add at least 2 PDF files to merge.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const entry of entries) {
        const bytes = await entry.file.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      downloadBlob(new Blob([bytes], { type: "application/pdf" }), "merged.pdf");
    } catch {
      setError("Failed to merge PDFs. Make sure all files are valid PDFs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload two or more PDF files using the file picker.",
        "Drag the rows to reorder them — the final PDF will follow this order.",
        "Click Merge PDFs and the combined file downloads automatically.",
      ]}
      faqs={[
        {
          question: "Are my PDFs uploaded to a server?",
          answer:
            "No. Everything runs in your browser using pdf-lib. Your files never leave your device.",
        },
        {
          question: "Is there a file size limit?",
          answer:
            "There's no hard limit, but very large PDFs (100+ MB) may be slow depending on your device memory.",
        },
        {
          question: "Can I merge more than 2 files?",
          answer: "Yes — add as many PDFs as you need.",
        },
      ]}
    >
      <FileUploader
        accept="application/pdf"
        multiple
        onFilesSelected={addFiles}
        label="Drop PDF files here or click to browse"
        hint="Add as many PDFs as you need — drag rows below to reorder"
      />

      {entries.length > 0 && (
        <div className="mt-4 space-y-2">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDragEnd={onDragEnd}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 cursor-grab active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800"
            >
              <GripVertical className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300">
                {entry.file.name}
              </span>
              <span className="text-xs text-slate-400 shrink-0">
                {formatBytes(entry.file.size)}
              </span>
              <button
                onClick={() => remove(entry.id)}
                className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-red-500 dark:hover:bg-slate-700"
                aria-label="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <Button
        onClick={merge}
        loading={loading}
        disabled={entries.length < 2}
        className="mt-4 w-full"
      >
        <Download className="h-4 w-4" />
        Merge {entries.length > 0 ? `${entries.length} ` : ""}PDFs
      </Button>
    </ToolLayout>
  );
}
