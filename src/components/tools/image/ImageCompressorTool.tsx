"use client";
import { useState } from "react";
import imageCompression from "browser-image-compression";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { Download, ArrowDown } from "lucide-react";

const tool = getToolBySlug("image-compressor")!;

export function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [compressed, setCompressed] = useState<{ blob: Blob; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const options = {
        maxSizeMB: 10,
        initialQuality: quality / 100,
        useWebWorker: true,
        fileType: file.type as "image/jpeg" | "image/png" | "image/webp",
      };
      const blob = await imageCompression(file, options);
      const url = URL.createObjectURL(blob);
      setCompressed({ blob, url });
    } catch {
      setError("Failed to compress image. Please try another file.");
    } finally {
      setLoading(false);
    }
  };

  const savings = compressed && file ? Math.round((1 - compressed.blob.size / file.size) * 100) : 0;

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a JPG, PNG, or WebP image using the file picker or drag and drop.",
        "Adjust the quality slider (lower = smaller file, higher = better quality).",
        "Click Compress and wait for the result.",
        "Download your compressed image.",
      ]}
      faqs={[
        {
          question: "Does compression reduce image quality?",
          answer:
            "A quality setting of 70–85% is usually indistinguishable from the original for most use cases. Below 60% you may start to see artifacts in JPGs.",
        },
        {
          question: "Is my image uploaded to a server?",
          answer:
            "No. All compression happens in your browser using WebAssembly. Your files never leave your device.",
        },
        {
          question: "What formats are supported?",
          answer: "JPEG, PNG, and WebP images are supported.",
        },
        {
          question: "What is the maximum file size?",
          answer: "You can compress images up to 50MB in size.",
        },
      ]}
    >
      <FileUploader
        accept="image/jpeg,image/png,image/webp"
        onFilesSelected={(files) => { setFile(files[0] ?? null); setCompressed(null); }}
        label="Drop an image here or click to browse"
        hint="Supports JPG, PNG, WebP — up to 50MB"
      />

      {file && (
        <div className="mt-6 space-y-4">
          {/* Quality slider */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <label htmlFor="quality" className="font-medium text-slate-700 dark:text-slate-300">
                Quality
              </label>
              <span className="font-semibold text-indigo-600">{quality}%</span>
            </div>
            <input
              id="quality"
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>

          <Button onClick={handleCompress} loading={loading} className="w-full">
            Compress Image
          </Button>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Result */}
          {compressed && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Preview */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={compressed.url}
                  alt="Compressed preview"
                  className="max-h-40 max-w-[200px] rounded-lg object-contain border border-slate-200 dark:border-slate-700"
                />
                {/* Stats */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Original</span>
                    <span className="font-medium">{formatBytes(file.size)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Compressed</span>
                    <span className="font-medium text-green-600">{formatBytes(compressed.blob.size)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Savings</span>
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      <ArrowDown className="h-3.5 w-3.5" />{savings}%
                    </span>
                  </div>
                  <Button
                    onClick={() => downloadBlob(compressed.blob, `compressed-${file.name}`)}
                    className="w-full mt-2"
                  >
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
