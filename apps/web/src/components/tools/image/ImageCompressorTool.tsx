"use client";
import { useState } from "react";
import imageCompression from "browser-image-compression";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { Download, ArrowDown, Info } from "lucide-react";

const tool = getToolBySlug("image-compressor")!;

const isPng = (f: File) => f.type === "image/png" || f.name.toLowerCase().endsWith(".png");

export function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(82);
  const [convertPngToJpeg, setConvertPngToJpeg] = useState(false);
  const [maxWidthHeight, setMaxWidthHeight] = useState(0); // 0 = no resize
  const [compressed, setCompressed] = useState<{ blob: Blob; url: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setCompressed(null);

    try {
      const fileIsPng = isPng(file);
      // If the user wants to convert PNG to JPEG, use image/jpeg as output type
      const outputType =
        fileIsPng && convertPngToJpeg ? "image/jpeg"
        : file.type as "image/jpeg" | "image/png" | "image/webp";

      const options: Parameters<typeof imageCompression>[1] = {
        // Set maxSizeMB very generously — we control size via quality, not an
        // arbitrary MB cap that can over-compress or refuse to compress at all.
        maxSizeMB: 50,
        initialQuality: quality / 100,
        useWebWorker: true,
        fileType: outputType,
        // Optionally limit dimensions while maintaining aspect ratio
        ...(maxWidthHeight > 0 ? { maxWidthOrHeight: maxWidthHeight } : {}),
        // Preserve EXIF for JPEG (user can strip via EXIF tool if needed)
        preserveExif: false,
      };

      const blob = await imageCompression(file, options);

      // Build the output filename
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const ext = outputType === "image/jpeg" ? "jpg"
        : outputType === "image/webp" ? "webp"
        : "png";
      const outputName = `compressed-${baseName}.${ext}`;

      const url = URL.createObjectURL(blob);
      setCompressed({ blob, url, name: outputName });
    } catch {
      setError("Compression failed. Please try a different image.");
    } finally {
      setLoading(false);
    }
  };

  const savings =
    compressed && file
      ? Math.round((1 - compressed.blob.size / file.size) * 100)
      : 0;

  const fileIsPng = file ? isPng(file) : false;

  return (
    <ToolLayout
      tool={tool}
    >
      <FileUploader
        accept="image/jpeg,image/png,image/webp"
        onFilesSelected={(files) => {
          setFile(files[0] ?? null);
          setCompressed(null);
        }}
        label="Drop an image here or click to browse"
        hint="Supports JPG, PNG, WebP"
      />

      {file && (
        <div className="mt-5 space-y-4">
          {/* PNG notice */}
          {fileIsPng && !convertPngToJpeg && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-900/20">
              <Info className="h-4 w-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                PNG is lossless — quality settings have little effect. Enable{" "}
                <strong>Convert to JPEG</strong> below for significant size reduction.
              </p>
            </div>
          )}

          {/* Quality slider */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <label className="font-medium text-slate-700 dark:text-slate-300">
                Quality
              </label>
              <span className="font-semibold text-indigo-600">{quality}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-indigo-600"
              disabled={fileIsPng && !convertPngToJpeg}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Smallest file</span>
              <span>Best quality</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* PNG → JPEG toggle */}
            {fileIsPng && (
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800">
                <input
                  type="checkbox"
                  checked={convertPngToJpeg}
                  onChange={(e) => setConvertPngToJpeg(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Convert to JPEG
                  </p>
                  <p className="text-xs text-slate-500">
                    50–80% smaller — loses transparency
                  </p>
                </div>
              </label>
            )}

            {/* Max dimension */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Max dimension (px)
              </label>
              <select
                value={maxWidthHeight}
                onChange={(e) => setMaxWidthHeight(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value={0}>No resize</option>
                <option value={3840}>3840 (4K)</option>
                <option value={1920}>1920 (FHD)</option>
                <option value={1280}>1280 (HD)</option>
                <option value={800}>800 (Web thumbnail)</option>
                <option value={400}>400 (Small)</option>
              </select>
            </div>
          </div>

          <Button onClick={handleCompress} loading={loading} className="w-full">
            Compress Image
          </Button>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {/* Result */}
          {compressed && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800/40 dark:bg-emerald-900/10">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={compressed.url}
                  alt="Compressed preview"
                  className="max-h-40 max-w-[200px] rounded-lg object-contain border border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1 w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Original</span>
                    <span className="font-medium">{formatBytes(file.size)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Compressed</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatBytes(compressed.blob.size)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Savings</span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        savings > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500"
                      }`}
                    >
                      {savings > 0 ? (
                        <>
                          <ArrowDown className="h-3.5 w-3.5" />
                          {savings}%
                        </>
                      ) : (
                        "Already optimised"
                      )}
                    </span>
                  </div>
                  {savings <= 5 && (
                    <p className="text-xs text-slate-400">
                      {fileIsPng && !convertPngToJpeg
                        ? "Enable Convert to JPEG for bigger savings"
                        : "Try reducing quality or enabling max dimension to get more savings"}
                    </p>
                  )}
                  <Button
                    onClick={() => downloadBlob(compressed.blob, compressed.name)}
                    className="w-full mt-1"
                  >
                    <Download className="h-4 w-4" />
                    Download ({formatBytes(compressed.blob.size)})
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
