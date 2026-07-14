"use client";
import { useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("pdf-watermark")!;

export function PdfWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(20);
  const [fontSize, setFontSize] = useState(60);
  const [angle, setAngle] = useState(45);
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

  const addWatermark = async () => {
    if (!file || !text.trim()) {
      setError("Enter watermark text.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();
      const alpha = opacity / 100;

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        // Centre the watermark on the page
        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: height / 2 - fontSize / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: alpha,
          rotate: degrees(angle),
        });
      });

      const bytes = await doc.save();
      downloadBlob(
        new Blob([bytes], { type: "application/pdf" }),
        "watermarked.pdf",
      );
    } catch {
      setError("Failed to add watermark. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a PDF file.",
        "Type the watermark text and adjust opacity, size, and angle.",
        "Click Add Watermark to download the result.",
      ]}
      faqs={[
        {
          question: "Can I remove a watermark added with this tool?",
          answer:
            "Watermarks added by this tool are embedded as page content. They cannot be cleanly removed after the fact.",
        },
        {
          question: "Can I use an image watermark?",
          answer:
            "Text watermarks are supported. Image watermark support is planned.",
        },
        {
          question: "What opacity should I use?",
          answer:
            "15–25% is the sweet spot — visible enough to deter copying but not distracting when reading.",
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

          {/* Watermark text */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Watermark text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="CONFIDENTIAL"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Opacity: {opacity}%
              </label>
              <input
                type="range"
                min={5}
                max={100}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Size (pt)
              </label>
              <input
                type="number"
                min={10}
                max={200}
                value={fontSize}
                onChange={(e) =>
                  setFontSize(Math.min(200, Math.max(10, Number(e.target.value))))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Angle (°)
              </label>
              <input
                type="number"
                min={-180}
                max={180}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <Button onClick={addWatermark} loading={loading} disabled={!text.trim()} className="w-full">
            <Download className="h-4 w-4" />
            Add Watermark
          </Button>
        </div>
      )}
    </ToolLayout>
  );
}
