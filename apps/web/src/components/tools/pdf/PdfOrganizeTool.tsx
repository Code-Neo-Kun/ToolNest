"use client";
import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download, GripVertical, RotateCw, Trash2 } from "lucide-react";

const tool = getToolBySlug("pdf-organize")!;

interface PageEntry {
  /** 0-indexed position in the *original* PDF */
  originalIndex: number;
  /** Rotation added on top of the page's existing rotation (0 | 90 | 180 | 270) */
  addedRotation: 0 | 90 | 180 | 270;
}

export function PdfOrganizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const handleFile = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setError(null);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      const count = doc.getPageCount();
      setFile(f);
      setPages(
        Array.from({ length: count }, (_, i) => ({
          originalIndex: i,
          addedRotation: 0,
        })),
      );
    } catch {
      setError("Could not read the PDF. Make sure it is not encrypted.");
    }
  };

  // ── Drag to reorder ──────────────────────────────────────────────────────
  const onDragStart = (i: number) => {
    setDragIdx(i);
  };

  const onDragOver = useCallback(
    (e: React.DragEvent, i: number) => {
      e.preventDefault();
      setDragOver(i);
    },
    [],
  );

  const onDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) {
      setDragIdx(null);
      setDragOver(null);
      return;
    }
    setPages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIdx(null);
    setDragOver(null);
  };

  const onDragEnd = () => {
    setDragIdx(null);
    setDragOver(null);
  };

  // ── Actions ─────────────────────────────────────────────────────────────
  const rotatePage = (i: number) => {
    setPages((prev) =>
      prev.map((p, idx) =>
        idx === i
          ? { ...p, addedRotation: ((p.addedRotation + 90) % 360) as 0 | 90 | 180 | 270 }
          : p,
      ),
    );
  };

  const removePage = (i: number) =>
    setPages((prev) => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    if (!file || pages.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();

      for (const entry of pages) {
        const [copied] = await out.copyPages(src, [entry.originalIndex]);
        if (entry.addedRotation !== 0) {
          const existing = copied.getRotation().angle;
          const { degrees } = await import("pdf-lib");
          copied.setRotation(degrees((existing + entry.addedRotation) % 360));
        }
        out.addPage(copied);
      }

      const bytes = await out.save();
      downloadBlob(
        new Blob([bytes], { type: "application/pdf" }),
        "organized.pdf",
      );
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const rotationLabel = (r: number) =>
    r === 0 ? "" : `+${r}°`;

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a PDF file.",
        "Drag pages to reorder them. Click the rotate icon to rotate a page by 90°. Click the trash icon to delete a page.",
        "Click Save & Download to get the reorganised PDF.",
      ]}
      faqs={[
        {
          question: "Can I undo changes?",
          answer:
            "Re-upload the file to start over — the original is never modified.",
        },
        {
          question: "How many pages can I reorder?",
          answer:
            "There's no hard limit. Very large PDFs (500+ pages) may be slow to render in the browser.",
        },
        {
          question: "Can I both reorder and rotate on the same pass?",
          answer: "Yes — all changes (order, rotation, deletions) are applied together when you download.",
        },
      ]}
    >
      <FileUploader
        accept="application/pdf"
        onFilesSelected={handleFile}
        label="Drop a PDF here or click to browse"
      />

      {pages.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {pages.length} page{pages.length !== 1 ? "s" : ""} · drag to reorder
            </p>
            <p className="text-xs text-slate-400">
              <RotateCw className="inline h-3 w-3 mr-0.5" /> rotates · <Trash2 className="inline h-3 w-3 mr-0.5" /> deletes
            </p>
          </div>

          <div className="space-y-1.5">
            {pages.map((entry, i) => (
              <div
                key={`${entry.originalIndex}-${i}`}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDrop={() => onDrop(i)}
                onDragEnd={onDragEnd}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-grab active:cursor-grabbing transition-colors ${
                  dragOver === i && dragIdx !== i
                    ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                    : dragIdx === i
                    ? "border-slate-300 bg-slate-100 opacity-50 dark:bg-slate-700"
                    : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                }`}
              >
                <GripVertical className="h-4 w-4 shrink-0 text-slate-400" />

                {/* Page number badge */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-600 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {entry.originalIndex + 1}
                </div>

                <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                  Page {i + 1}
                  {entry.originalIndex + 1 !== i + 1 && (
                    <span className="ml-1.5 text-xs text-slate-400">
                      (was {entry.originalIndex + 1})
                    </span>
                  )}
                </span>

                {entry.addedRotation !== 0 && (
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {rotationLabel(entry.addedRotation)}
                  </span>
                )}

                {/* Rotate */}
                <button
                  onClick={() => rotatePage(i)}
                  title="Rotate 90° clockwise"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-indigo-600 dark:hover:bg-slate-700 dark:hover:text-indigo-400 transition-colors"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => removePage(i)}
                  title="Remove page"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <Button
            onClick={save}
            loading={loading}
            disabled={pages.length === 0}
            className="w-full"
          >
            <Download className="h-4 w-4" />
            Save & Download ({pages.length} page{pages.length !== 1 ? "s" : ""})
          </Button>
        </div>
      )}
    </ToolLayout>
  );
}
