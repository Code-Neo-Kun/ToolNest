"use client";
import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("png-to-jpg")!;

export function PngToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(92);
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleConvert = () => {
    if (!file) return;
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      // Fill white background (PNG transparency → white in JPG)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) setResult({ url: URL.createObjectURL(blob), blob });
          setLoading(false);
        },
        "image/jpeg",
        quality / 100
      );
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a PNG image.",
        "Adjust the quality slider if needed.",
        "Click Convert to JPG.",
        "Download the resulting JPG file.",
      ]}
      faqs={[
        {
          question: "Will transparent areas be preserved?",
          answer: "No. JPG does not support transparency. Transparent pixels will be filled with white background.",
        },
        {
          question: "What quality should I use?",
          answer: "90–95% gives excellent quality with significant size reduction. 70–80% is good for web use.",
        },
      ]}
    >
      <canvas ref={canvasRef} className="hidden" />
      <FileUploader
        accept="image/png"
        onFilesSelected={(f) => { setFile(f[0] ?? null); setResult(null); }}
        label="Drop a PNG image here"
        hint="PNG files only"
      />

      {file && (
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label htmlFor="jpg-quality" className="font-medium text-slate-700 dark:text-slate-300">JPG Quality</label>
              <span className="font-semibold text-indigo-600">{quality}%</span>
            </div>
            <input id="jpg-quality" type="range" min={10} max={100} value={quality}
              onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <Button onClick={handleConvert} loading={loading} className="w-full">Convert to JPG</Button>
          {result && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Converted JPG" className="mx-auto max-h-48 rounded-lg mb-4" />
              <Button onClick={() => {
                const name = file.name.replace(/\.png$/i, ".jpg");
                downloadBlob(result.blob, name);
              }}>
                <Download className="h-4 w-4" /> Download JPG
              </Button>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
