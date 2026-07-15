"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("image-watermark")!;

type Position =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "top-center"
  | "center";

const POSITIONS: { label: string; value: Position }[] = [
  { label: "Bottom right", value: "bottom-right" },
  { label: "Bottom center", value: "bottom-center" },
  { label: "Bottom left", value: "bottom-left" },
  { label: "Top right", value: "top-right" },
  { label: "Top center", value: "top-center" },
  { label: "Top left", value: "top-left" },
  { label: "Center", value: "center" },
];

/** Loads an Image from a URL, returns a resolved HTMLImageElement */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src; // set src AFTER handlers
  });
}

/** Draw watermark onto a canvas and return the canvas */
function drawWatermark(
  img: HTMLImageElement,
  text: string,
  fontSize: number,
  opacity: number,
  color: string,
  position: Position,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;

  // Draw source image
  ctx.drawImage(img, 0, 0);

  // Scale font size relative to image width so it looks good on any resolution
  const scaledFont = Math.max(fontSize, Math.round((img.naturalWidth / 800) * fontSize));
  ctx.font = `bold ${scaledFont}px sans-serif`;

  // Measure text before positioning
  const metrics = ctx.measureText(text);
  const textW = metrics.width;
  const textH = scaledFont;
  const pad = Math.round(scaledFont * 0.6);

  let x: number;
  let y: number;

  switch (position) {
    case "top-left":
      x = pad;
      y = pad + textH;
      break;
    case "top-center":
      x = canvas.width / 2;
      y = pad + textH;
      break;
    case "top-right":
      x = canvas.width - pad;
      y = pad + textH;
      break;
    case "bottom-left":
      x = pad;
      y = canvas.height - pad;
      break;
    case "bottom-center":
      x = canvas.width / 2;
      y = canvas.height - pad;
      break;
    case "bottom-right":
      x = canvas.width - pad;
      y = canvas.height - pad;
      break;
    case "center":
      x = canvas.width / 2;
      y = canvas.height / 2;
      break;
  }

  // Text alignment mirrors position
  ctx.textAlign = position.includes("right")
    ? "right"
    : position.includes("left")
    ? "left"
    : "center";
  ctx.textBaseline = "alphabetic";

  // Drop shadow so text is visible on any background
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = Math.max(4, scaledFont * 0.15);
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Parse hex color → rgba with opacity
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = `rgb(${r},${g},${b})`;

  ctx.fillText(text, x, y);

  return canvas;
}

export function ImageWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [text, setText] = useState("© ToolNest");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.75);
  const [color, setColor] = useState("#ffffff");
  const [position, setPosition] = useState<Position>("bottom-right");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revoke old object URLs on unmount
  const prevPreviewUrl = useRef<string | null>(null);
  useEffect(() => {
    return () => {
      if (prevPreviewUrl.current) URL.revokeObjectURL(prevPreviewUrl.current);
    };
  }, []);

  const handleFiles = (files: File[]) => {
    const f = files[0] ?? null;
    if (!f) return;
    setFile(f);
    setOutputBlob(null);
    setPreviewUrl(null);
    setError(null);
    const url = URL.createObjectURL(f);
    setSrcUrl(url);
  };

  const applyWatermark = useCallback(async () => {
    if (!srcUrl || !file || !text.trim()) {
      setError("Please upload an image and enter watermark text.");
      return;
    }
    setLoading(true);
    setError(null);
    setOutputBlob(null);

    try {
      const img = await loadImage(srcUrl);
      const canvas = drawWatermark(img, text, fontSize, opacity, color, position);

      // Use original mime type, fall back to image/png
      const mime =
        file.type && file.type.startsWith("image/") ? file.type : "image/png";

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
          mime,
          0.95,
        );
      });

      // Revoke old preview URL
      if (prevPreviewUrl.current) URL.revokeObjectURL(prevPreviewUrl.current);
      const url = URL.createObjectURL(blob);
      prevPreviewUrl.current = url;

      setPreviewUrl(url);
      setOutputBlob(blob);
    } catch {
      setError("Failed to apply watermark. Try a different image.");
    } finally {
      setLoading(false);
    }
  }, [srcUrl, file, text, fontSize, opacity, color, position]);

  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const ext = file.name.split(".").pop() ?? "png";
    downloadBlob(outputBlob, `watermarked-${file.name.replace(/\.[^.]+$/, "")}.${ext}`);
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a JPG, PNG, or WebP image.",
        "Type your watermark text and adjust font size, opacity, color, and position.",
        "Click Apply Watermark to preview the result.",
        "Download the watermarked image.",
      ]}
      faqs={[
        {
          question: "What image formats are supported?",
          answer: "JPG, PNG, and WebP. The output preserves the original format.",
        },
        {
          question: "Is my image uploaded to a server?",
          answer:
            "No — everything runs in your browser on a Canvas element. Nothing leaves your device.",
        },
        {
          question: "The watermark is hard to see. What should I do?",
          answer:
            "Try white (#ffffff) text on dark images or dark (#000000) on light ones. Increase opacity or font size for more visibility.",
        },
        {
          question: "Will the watermark reduce image quality?",
          answer:
            "The image is re-encoded at 95% quality. For lossless results, use PNG as the source format.",
        },
      ]}
    >
      <div className="space-y-5">
        <FileUploader
          accept="image/jpeg,image/png,image/webp"
          onFilesSelected={handleFiles}
          label="Drop an image here or click to browse"
          hint="Supports JPG, PNG, WebP"
        />

        {file && (
          <>
            {/* Controls */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Text */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Watermark text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="© Your Name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              {/* Font size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Font size: {fontSize}px
                </label>
                <input
                  type="range"
                  min={12}
                  max={200}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>12px</span>
                  <span>200px</span>
                </div>
              </div>

              {/* Opacity */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Opacity: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Text color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-16 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {["#ffffff", "#000000", "#ff0000", "#ffff00", "#00aaff"].map(
                      (c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          title={c}
                          className="h-7 w-7 rounded-md border-2 transition-all"
                          style={{
                            backgroundColor: c,
                            borderColor: color === c ? "#6366f1" : "#e2e8f0",
                          }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as Position)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {POSITIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <Button
              onClick={applyWatermark}
              loading={loading}
              disabled={!text.trim()}
              className="w-full"
            >
              Apply Watermark
            </Button>

            {/* Side-by-side preview */}
            {previewUrl && srcUrl && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Original
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={srcUrl}
                      alt="Original"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 object-contain max-h-72"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                      Watermarked
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Watermarked preview"
                      className="w-full rounded-xl border border-indigo-200 dark:border-indigo-700 object-contain max-h-72"
                    />
                  </div>
                </div>

                <Button onClick={handleDownload} className="w-full">
                  <Download className="h-4 w-4" />
                  Download Watermarked Image
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
