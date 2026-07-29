"use client";
import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("jpg-to-png")!;

export function JpgToPngTool() {
  const [file, setFile] = useState<File | null>(null);
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
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) setResult({ url: URL.createObjectURL(blob), blob });
        setLoading(false);
      }, "image/png");
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a JPG or JPEG image.",
        "Click Convert to PNG.",
        "Download the resulting PNG file.",
      ]}
      faqs={[
        {
          question: "Will the image quality improve when converting to PNG?",
          answer: "No. Converting from JPG to PNG won't recover quality lost during JPG compression, but PNG is lossless so no additional quality is lost.",
        },
        {
          question: "Why convert JPG to PNG?",
          answer: "PNG supports transparency and lossless compression, making it better for logos, icons, and images that need editing.",
        },
      ]}
    >
      <canvas ref={canvasRef} className="hidden" />
      <FileUploader
        accept="image/jpeg,image/jpg"
        onFilesSelected={(f) => { setFile(f[0] ?? null); setResult(null); }}
        label="Drop a JPG image here"
        hint="JPG/JPEG files only"
      />
      {file && (
        <div className="mt-6 space-y-4">
          <Button onClick={handleConvert} loading={loading} className="w-full">Convert to PNG</Button>
          {result && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Converted PNG" className="mx-auto max-h-48 rounded-lg mb-4" />
              <Button onClick={() => {
                const name = file.name.replace(/\.jpe?g$/i, ".png");
                downloadBlob(result.blob, name);
              }}>
                <Download className="h-4 w-4" /> Download PNG
              </Button>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
