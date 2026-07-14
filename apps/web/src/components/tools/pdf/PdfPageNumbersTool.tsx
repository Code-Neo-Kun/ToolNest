"use client";
import { useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("pdf-add-page-numbers")!;

type Position = "bottom-center" | "bottom-right" | "bottom-left" | "top-center";

const POSITIONS: { label: string; value: Position }[] = [
  { label: "Bottom center", value: "bottom-center" },
  { label: "Bottom right", value: "bottom-right" },
  { label: "Bottom left", value: "bottom-left" },
  { label: "Top center", value: "top-center" },
];

export function PdfPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(12);
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
      setError("Could not read the PDF.");
    }
  };

  const addNumbers = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const margin = 20;

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const label = String(i + startNumber);
        const textWidth = font.widthOfTextAtSize(label, fontSize);

        let x: number;
        let y: number;

        switch (position) {
          case "bottom-center":
            x = (width - textWidth) / 2;
            y = margin;
            break;
          case "bottom-right":
            x = width - textWidth - margin;
            y = margin;
            break;
          case "bottom-left":
            x = margin;
            y = margin;
            break;
          case "top-center":
            x = (width - textWidth) / 2;
            y = height - margin - fontSize;
            break;
        }

        page.drawText(label, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
      });

      const bytes = await doc.save();
      downloadBlob(
        new Blob([bytes], { type: "application/pdf" }),
        "numbered.pdf",
      );
    } catch {
      setError("Failed to add page numbers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a PDF file.",
        "Choose the position, starting number, and font size.",
        "Click Add Page Numbers to download the stamped PDF.",
      ]}
      faqs={[
        {
          question: "Can I start numbering from a number other than 1?",
          answer:
            "Yes — set the starting number in the options. Useful if this PDF continues from a previous document.",
        },
        {
          question: "What font is used?",
          answer:
            "Helvetica, which is a standard built-in PDF font that works without embedding.",
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
            {pageCount} pages
          </p>

          {/* Position */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Position
            </p>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPosition(p.value)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    position === p.value
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Options row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Start at
              </label>
              <input
                type="number"
                min={1}
                value={startNumber}
                onChange={(e) => setStartNumber(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Font size (pt)
              </label>
              <input
                type="number"
                min={6}
                max={36}
                value={fontSize}
                onChange={(e) =>
                  setFontSize(Math.min(36, Math.max(6, Number(e.target.value))))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <Button onClick={addNumbers} loading={loading} className="w-full">
            <Download className="h-4 w-4" />
            Add Page Numbers
          </Button>
        </div>
      )}
    </ToolLayout>
  );
}
