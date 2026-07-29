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

  const removeBackground = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress("Loading AI model (first run may take ~10s)…");

    try {
      // Dynamic import keeps the heavy WASM out of the initial bundle
      const { removeBackground: removeBg } = await import(
        "@imgly/background-removal"
      );

      setProgress("Processing image…");

      const resultBlob = await removeBg(file, {
        publicPath: "/_next/static/chunks/",
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            setProgress(`${key}: ${pct}%`);
          }
        },
      });

      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
      setResultBlob(resultBlob);
      setProgress("");
    } catch (e) {
      console.error(e);
      setError(
        "Background removal failed. Try a smaller image or a different photo.",
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
      howToUse={[
        "Upload a JPG or PNG photo.",
        "Click Remove Background — the AI model runs entirely in your browser.",
        "Preview the result with a transparent background.",
        "Download the PNG with transparency.",
      ]}
      faqs={[
        {
          question: "Is my image uploaded to a server?",
          answer:
            "No. The AI model (ONNX Runtime + WebAssembly) runs entirely in your browser. Your image never leaves your device.",
        },
        {
          question: "Why does the first run take a few seconds?",
          answer:
            "The AI model (~40 MB) is downloaded and cached by your browser on the first use. Subsequent runs are much faster.",
        },
        {
          question: "What image formats are supported?",
          answer: "JPG and PNG input. Output is always PNG with a transparent background.",
        },
        {
          question: "Does it work on complex backgrounds?",
          answer:
            "The model handles most photos well — portraits, products, animals. Very busy backgrounds or fine hair may need minor touch-up in an image editor.",
        },
      ]}
    >
      <div className="space-y-5">
        <FileUploader
          accept="image/jpeg,image/png,image/webp"
          onFilesSelected={handleFiles}
          label="Drop a photo here or click to browse"
          hint="Best results with portraits and product photos — JPG, PNG, WebP"
        />

        {file && (
          <Button
            onClick={removeBackground}
            loading={loading}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {progress || "Processing…"}
              </>
            ) : (
              "✨ Remove Background"
            )}
          </Button>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {/* Side-by-side comparison */}
        {resultUrl && srcUrl && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
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
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  Background removed
                </p>
                {/* Checkerboard shows transparency */}
                <div
                  className="w-full rounded-xl border border-indigo-200 dark:border-indigo-700 overflow-hidden max-h-64 flex items-center justify-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
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

            <Button onClick={download} className="w-full">
              <Download className="h-4 w-4" />
              Download PNG (transparent background)
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
