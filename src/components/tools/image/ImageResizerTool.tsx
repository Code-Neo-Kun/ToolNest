"use client";
import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("image-resizer")!;

export function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<{ w: number; h: number } | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepAspect, setKeepAspect] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    const img = new Image();
    img.onload = () => {
      setOriginalSize({ w: img.naturalWidth, h: img.naturalHeight });
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    };
    img.src = URL.createObjectURL(f);
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    if (keepAspect && originalSize && val) {
      const ratio = originalSize.h / originalSize.w;
      setHeight(String(Math.round(Number(val) * ratio)));
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    if (keepAspect && originalSize && val) {
      const ratio = originalSize.w / originalSize.h;
      setWidth(String(Math.round(Number(val) * ratio)));
    }
  };

  const handleResize = () => {
    if (!file || !width || !height) return;
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const w = Number(width);
      const h = Number(height);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (blob) setResult(URL.createObjectURL(blob));
        setLoading(false);
      }, file.type || "image/png");
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current!;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `resized-${file!.name}`);
    }, file!.type || "image/png");
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload your image.",
        "Set the desired width and height in pixels.",
        "Toggle 'Keep Aspect Ratio' to prevent distortion.",
        "Click Resize and download the result.",
      ]}
      faqs={[
        {
          question: "Does resizing happen in the browser?",
          answer: "Yes, everything runs locally using the Canvas API. No files are sent to any server.",
        },
        {
          question: "Can I upscale an image?",
          answer: "Yes, but upscaling increases file size and may reduce sharpness since no extra detail is added.",
        },
      ]}
    >
      <canvas ref={canvasRef} className="hidden" />
      <FileUploader
        accept="image/*"
        onFilesSelected={handleFile}
        label="Drop an image to resize"
      />

      {file && (
        <div className="mt-6 space-y-4">
          {originalSize && (
            <p className="text-xs text-slate-400">
              Original: {originalSize.w} × {originalSize.h}px
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                min={1}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                min={1}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={keepAspect}
              onChange={(e) => setKeepAspect(e.target.checked)}
              className="accent-indigo-600"
            />
            Keep aspect ratio
          </label>

          <Button onClick={handleResize} loading={loading} className="w-full">
            Resize Image
          </Button>

          {result && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result} alt="Resized" className="mx-auto max-h-48 rounded-lg mb-4" />
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
