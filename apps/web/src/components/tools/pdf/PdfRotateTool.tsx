"use client";
import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download, RotateCw } from "lucide-react";

const tool = getToolBySlug("pdf-rotate")!;

type Rotation = 90 | 180 | 270;

const ROTATIONS: { label: string; value: Rotation }[] = [
  { label: "90° clockwise", value: 90 },
  { label: "180°", value: 180 },
  { label: "90° counter-clockwise", value: 270 },
];

export function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotation, setRotation] = useState<Rotation>(90);
  const [applyTo, setApplyTo] = useState<"all" | "range">("all");
  const [rangeInput, setRangeInput] = useState("");
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
      setError("Could not read the PDF.");
    }
  };

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const rotate = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const pages = doc.getPages();
      const targets =
        applyTo === "all"
          ? pages.map((_, i) => i)
          : Array.from(selected);

      targets.forEach((i) => {
        const page = pages[i];
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + rotation) % 360));
      });

      const bytes = await doc.save();
      downloadBlob(new Blob([bytes], { type: "application/pdf" }), "rotated.pdf");
    } catch {
      setError("Failed to rotate the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canRotate =
    file && pageCount > 0 && (applyTo === "all" || selected.size > 0);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a PDF file.",
        "Choose a rotation angle.",
        "Select whether to rotate all pages or pick individual ones.",
        "Click Rotate PDF to download.",
      ]}
      faqs={[
        {
          question: "Can I rotate only some pages?",
          answer:
            "Yes — choose "Selected pages" and click the page numbers you want to rotate.",
        },
        {
          question: "Will the rotation be permanent?",
          answer:
            "It's permanent in the downloaded file, but your original file is never modified.",
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

          {/* Rotation angle */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Rotation
            </p>
            <div className="flex flex-wrap gap-2">
              {ROTATIONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRotation(r.value)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    rotation === r.value
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <RotateCw className="inline h-3.5 w-3.5 mr-1" />
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Apply to */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Apply to
            </p>
            <div className="flex gap-2">
              {(["all", "range"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setApplyTo(opt)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    applyTo === opt
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {opt === "all" ? "All pages" : "Selected pages"}
                </button>
              ))}
            </div>
          </div>

          {applyTo === "range" && (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: pageCount }, (_, i) => i).map((i) => (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    selected.has(i)
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <Button
            onClick={rotate}
            loading={loading}
            disabled={!canRotate}
            className="w-full"
          >
            <Download className="h-4 w-4" />
            Rotate PDF
          </Button>
        </div>
      )}
    </ToolLayout>
  );
}
