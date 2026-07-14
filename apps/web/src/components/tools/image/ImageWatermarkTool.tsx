"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";

const tool = getToolBySlug("image-watermark")!;

export function ImageWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [text, setText] = useState("Sample watermark");
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(32);
  const [position, setPosition] = useState("bottom-right");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updatePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setOutputUrl(null);
    setError(null);
  };

  const handleWatermark = async () => {
    if (!file || !imageUrl) return;
    setError(null);
    const image = new Image();
    image.src = imageUrl;

    try {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unsupported");

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textBaseline = "bottom";
      ctx.textAlign = position.includes("right")
        ? "right"
        : position.includes("left")
          ? "left"
          : "center";
      const padding = 24;
      let x = canvas.width / 2;
      let y = canvas.height - padding;

      if (position === "bottom-left") {
        x = padding;
      } else if (position === "bottom-right") {
        x = canvas.width - padding;
      } else if (position === "top-left") {
        y = padding + fontSize;
        x = padding;
      } else if (position === "top-right") {
        y = padding + fontSize;
        x = canvas.width - padding;
      } else if (position === "top-center") {
        y = padding + fontSize;
      }

      ctx.fillText(text, x, y);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, file.type),
      );
      if (!blob) throw new Error("Failed to generate watermarked image.");
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
    } catch {
      setError("Unable to apply watermark. Try a different image.");
    }
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload an image to watermark.",
        "Enter text and adjust opacity, size, and position.",
        "Generate the watermarked image and download it.",
      ]}
      faqs={[
        {
          question: "Can I use any image format?",
          answer:
            "Most browser-supported image formats work, including JPG, PNG, and WebP.",
        },
        {
          question: "Does the watermark affect image quality?",
          answer:
            "The image is redrawn on a canvas and preserved in the original format where possible.",
        },
      ]}
    >
      <div className="space-y-4">
        <FileUploader
          accept="image/*"
          onFilesSelected={(files) => {
            const selected = files[0] ?? null;
            setFile(selected);
            if (selected) updatePreview(selected);
          }}
          label="Upload an image to add a watermark"
          hint="Use JPG, PNG, or WebP images"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Watermark text
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Opacity
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="mt-2 w-full accent-indigo-600"
            />
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {Math.round(opacity * 100)}%
            </div>
          </label>

          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Font size
            <input
              type="number"
              min={12}
              max={120}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>

          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Position
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="bottom-right">Bottom right</option>
              <option value="bottom-left">Bottom left</option>
              <option value="top-right">Top right</option>
              <option value="top-left">Top left</option>
              <option value="top-center">Top center</option>
            </select>
          </label>
        </div>

        <Button onClick={handleWatermark} disabled={!file} className="w-full">
          Apply Watermark
        </Button>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {imageUrl && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Source Preview
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="source preview"
              className="w-full rounded-3xl object-contain"
            />
          </div>
        )}

        {outputUrl && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Your watermarked image is ready.
              </p>
              <Button
                onClick={async () => {
                  const response = await fetch(outputUrl);
                  const blob = await response.blob();
                  downloadBlob(blob, `watermarked-${file?.name}`);
                }}
              >
                Download Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
