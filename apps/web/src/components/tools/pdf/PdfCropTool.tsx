"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("pdf-crop")!;

interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function PdfCropTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [margins, setMargins] = useState<Margins>({ top: 0, right: 0, bottom: 0, left: 0 });
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

  const setMargin = (key: keyof Margins, value: number) =>
    setMargins((prev) => ({ ...prev, [key]: Math.max(0, value) }));

  const crop = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      doc.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        // Crop box trims from each edge by the specified amount in points
        page.setCropBox(
          margins.left,
          margins.bottom,
          Math.max(1, width - margins.left - margins.right),
          Math.max(1, height - margins.top - margins.bottom),
        );
      });
      const bytes = await doc.save();
      downloadBlob(new Blob([bytes], { type: "application/pdf" }), "cropped.pdf");
    } catch {
      setError("Failed to crop the PDF. Make sure the margin values are valid.");
    } finally {
      setLoading(false);
    }
  };

  const FIELDS: { label: string; key: keyof Margins }[] = [
    { label: "Top (pt)", key: "top" },
    { label: "Right (pt)", key: "right" },
    { label: "Bottom (pt)", key: "bottom" },
    { label: "Left (pt)", key: "left" },
  ];

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a PDF file.",
        "Enter how many points to remove from each edge (1 pt ≈ 0.35 mm).",
        "Click Crop PDF to download.",
      ]}
      faqs={[
        {
          question: "What unit are the margin values in?",
          answer:
            "PDF points (pt). 72pt = 1 inch. A typical A4 page is 595×842pt.",
        },
        {
          question: "Does this affect all pages?",
          answer:
            "Yes — the same crop box is applied to every page.",
        },
        {
          question: "Will it reduce file size?",
          answer:
            "The crop box hides content outside the new boundaries but doesn't remove it — so file size stays the same.",
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
            {pageCount} pages · Margins in PDF points (72pt = 1 inch)
          </p>

          <div className="grid grid-cols-2 gap-4">
            {FIELDS.map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {label}
                </label>
                <input
                  type="number"
                  min={0}
                  value={margins[key]}
                  onChange={(e) => setMargin(key, Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <Button
            onClick={crop}
            loading={loading}
            disabled={Object.values(margins).every((v) => v === 0)}
            className="w-full"
          >
            <Download className="h-4 w-4" />
            Crop PDF
          </Button>
        </div>
      )}
    </ToolLayout>
  );
}
