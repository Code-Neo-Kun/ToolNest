"use client";
import { useState } from "react";
import { PDFDocument, PageSizes } from "pdf-lib";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { Download, GripVertical, X } from "lucide-react";

const tool = getToolBySlug("jpg-to-pdf")!;

type PageSize = "A4" | "Letter" | "fit";

interface ImageEntry {
  file: File;
  id: string;
  preview: string;
}

export function JpgToPdfTool() {
  const [entries, setEntries] = useState<ImageEntry[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const addFiles = (files: File[]) => {
    const newEntries = files.map((f) => ({
      file: f,
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      preview: URL.createObjectURL(f),
    }));
    setEntries((prev) => [...prev, ...newEntries]);
    setError(null);
  };

  const remove = (id: string) =>
    setEntries((prev) => {
      const removed = prev.find((e) => e.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((e) => e.id !== id);
    });

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

  const convert = async () => {
    if (entries.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const doc = await PDFDocument.create();

      for (const entry of entries) {
        const bytes = await entry.file.arrayBuffer();
        const isJpeg =
          entry.file.type === "image/jpeg" || entry.file.name.match(/\.jpe?g$/i);
        const isPng = entry.file.type === "image/png" || entry.file.name.match(/\.png$/i);

        let img;
        if (isJpeg) img = await doc.embedJpg(bytes);
        else if (isPng) img = await doc.embedPng(bytes);
        else throw new Error(`Unsupported format: ${entry.file.name}`);

        let page;
        if (pageSize === "fit") {
          page = doc.addPage([img.width, img.height]);
        } else {
          const size = pageSize === "A4" ? PageSizes.A4 : PageSizes.Letter;
          page = doc.addPage(size);
        }

        const { width, height } = page.getSize();
        // Scale image to fit within page keeping aspect ratio
        const scale = Math.min(width / img.width, height / img.height);
        const imgW = img.width * scale;
        const imgH = img.height * scale;

        page.drawImage(img, {
          x: (width - imgW) / 2,
          y: (height - imgH) / 2,
          width: imgW,
          height: imgH,
        });
      }

      const pdfBytes = await doc.save();
      downloadBlob(
        new Blob([pdfBytes], { type: "application/pdf" }),
        "images.pdf",
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to convert images to PDF.",
      );
    } finally {
      setLoading(false);
    }
  };

  const PAGE_SIZES: { label: string; value: PageSize }[] = [
    { label: "A4", value: "A4" },
    { label: "US Letter", value: "Letter" },
    { label: "Fit to image", value: "fit" },
  ];

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload one or more JPG or PNG images.",
        "Drag rows to reorder — the PDF will follow this order.",
        "Choose a page size and click Convert to PDF.",
      ]}
      faqs={[
        {
          question: "What image formats are supported?",
          answer: "JPEG and PNG images are supported.",
        },
        {
          question: "Is there a limit on the number of images?",
          answer:
            "No hard limit, but very large images may be slow to process in the browser.",
        },
        {
          question: "What does "Fit to image" page size do?",
          answer:
            "Each page is sized exactly to the image dimensions, with no white borders.",
        },
      ]}
    >
      <FileUploader
        accept="image/jpeg,image/png"
        multiple
        onFilesSelected={addFiles}
        label="Drop JPG or PNG images here or click to browse"
        hint="Multiple files allowed — drag to reorder"
      />

      {entries.length > 0 && (
        <>
          {/* Thumbnail list */}
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.preview}
                  alt={entry.file.name}
                  className="h-10 w-10 rounded object-cover border border-slate-200 dark:border-slate-700"
                />
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

          {/* Page size */}
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Page size
            </p>
            <div className="flex gap-2">
              {PAGE_SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setPageSize(s.value)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    pageSize === s.value
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <Button
            onClick={convert}
            loading={loading}
            className="mt-4 w-full"
          >
            <Download className="h-4 w-4" />
            Convert {entries.length} Image{entries.length !== 1 ? "s" : ""} to PDF
          </Button>
        </>
      )}
    </ToolLayout>
  );
}
