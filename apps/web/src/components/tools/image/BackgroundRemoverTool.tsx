"use client";
import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download, Loader2 } from "lucide-react";

const tool = getToolBySlug("background-remover")!;

export function BackgroundRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResultUrl(null);
    setResultBlob(null);
    setError(null);
    setSrcUrl(URL.createObjectURL(f));
  };

  /**
   * Decode the file through a canvas and re-encode as PNG.
   * This normalises exotic JPEGs (CMYK, progressive, odd sub-sampling)
   * into a plain RGBA bitmap that the ONNX model can always read.
   */
  const normaliseImage = async (src: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(src);
      img.onload = () => {
        URL.revokeObjectURL(url);
        // Cap at 2048 px on the longest side to stay within model memory limits
        const MAX = 2048;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width >= height) { height = Math.round(height * MAX / width); width = MAX; }
          else { width = Math.round(width * MAX / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas 2D context unavailable")); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob returned null"));
        }, "image/png");
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Could not decode image — the file may be corrupt or an unsupported format."));
      };
      img.src = url;
    });
  };

  const removeBackground = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress("Preparing image…");

    try {
      // Normalise the image first so the model always gets a clean PNG bitmap
      const normalised = await normaliseImage(file);

      const { removeBackground: removeBg } = await import(
        "@imgly/background-removal"
      );

      setProgress("Loading AI model…");

      const blob = await removeBg(normalised, {
        // The JS bundle ships on unpkg but the WASM + ONNX model assets
        // are hosted on IMG.LY's own CDN under the separate
        // @imgly/background-removal-data package. Using unpkg for publicPath
        // returns an empty resources.json ({}) which causes the
        // "Resource /models/medium not found" error.
        publicPath: `https://staticimgly.com/@imgly/background-removal-data/1.4.5/dist/`,
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            const label =
              key.includes("fetch") ? "Downloading model"
              : key.includes("compute") ? "Processing"
              : "Loading";
            setProgress(`${label}… ${pct}%`);
          }
        },
      });

      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultBlob(blob);
      setProgress("");
    } catch (e) {
      console.error("Background removal error:", e);
      const detail = e instanceof Error ? e.message : String(e);
      const isNetwork = detail.toLowerCase().includes("fetch") || detail.toLowerCase().includes("network");
      setError(
        isNetwork
          ? `Model download failed — check your internet connection and try again. (${detail})`
          : `Background removal failed: ${detail}`,
      );
    } finally {
      setLoading(false);
    }
  }, [file]);

  const download = () => {
    if (!resultBlob || !file) return;
    const name = file.name.replace(/\.[^.]+$/, "") + "-no-bg.png";
    downloadBlob(resultBlob, name);
  };

  return (
    <ToolLayout
      tool={tool}
    >
      <div className="space-y-5">
        <FileUploader
          accept="image/jpeg,image/png,image/webp"
          onFilesSelected={handleFiles}
          label="Drop a photo here or click to browse"
          hint="Best results with portraits and product photos — JPG, PNG, WebP"
        />

        {file && !loading && (
          <Button onClick={removeBackground} className="w-full">
            ✨ Remove Background
          </Button>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {progress || "Processing…"}
            </p>
            <p className="text-xs text-slate-400">
              First run downloads the AI model (~40 MB) — subsequent runs are instant
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800/40 dark:bg-red-900/20">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Side-by-side comparison */}
        {resultUrl && srcUrl && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Original
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={srcUrl}
                  alt="Original"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 object-contain max-h-64"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  Background removed
                </p>
                {/* Checkerboard pattern to show transparency */}
                <div
                  className="w-full rounded-xl border border-indigo-200 dark:border-indigo-700 overflow-hidden max-h-64 flex items-center justify-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg,#cbd5e1 25%,transparent 25%)," +
                      "linear-gradient(-45deg,#cbd5e1 25%,transparent 25%)," +
                      "linear-gradient(45deg,transparent 75%,#cbd5e1 75%)," +
                      "linear-gradient(-45deg,transparent 75%,#cbd5e1 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
                    backgroundColor: "#f1f5f9",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resultUrl}
                    alt="Background removed"
                    className="max-h-64 w-full object-contain"
                  />
                </div>
              </div>
            </div>

            <Button onClick={download} variant="secondary" className="w-full">
              <Download className="h-4 w-4" />
              Download PNG (transparent background)
            </Button>

            <Button
              onClick={() => {
                setResultUrl(null);
                setResultBlob(null);
                setFile(null);
                setSrcUrl(null);
              }}
              variant="ghost"
              className="w-full text-slate-500"
            >
              Try another image
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
