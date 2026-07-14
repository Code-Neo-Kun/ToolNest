"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("color-palette-extractor")!;

function getDominantColors(image: HTMLImageElement, count: number) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const colorMap = new Map<string, number>();

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) ?? 0) + 1);
  }

  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => {
      const [r, g, b] = key.split(",").map(Number);
      return `rgb(${r}, ${g}, ${b})`;
    });
}

export function ColorPaletteExtractorTool() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (file: File) => {
    setError(null);
    setColors([]);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const evaluateColors = async () => {
    if (!imageUrl) return;
    setError(null);

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    try {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });
    } catch {
      setError("Unable to process the image. Try a different file.");
      return;
    }

    const dominant = getDominantColors(image, 6);
    setColors(dominant);
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload an image to inspect its main colors.",
        "Generate a palette from the image.",
        "Copy the hex values to use in your design.",
      ]}
      faqs={[
        {
          question: "How many palette colors are shown?",
          answer:
            "The tool extracts the top 6 most common colors from the image.",
        },
        {
          question: "Can I use these colors in CSS?",
          answer:
            "Yes. Each extracted color is shown with its hex code for easy copying.",
        },
      ]}
    >
      <div className="space-y-4">
        <FileUploader
          accept="image/*"
          onFilesSelected={(files) => {
            const selected = files[0] ?? null;
            if (selected) {
              handleUpload(selected);
            }
          }}
          label="Upload an image to extract a color palette"
          hint="JPEG, PNG, WebP, and other browser-supported images"
        />

        <button
          type="button"
          onClick={evaluateColors}
          disabled={!imageUrl}
          className="inline-flex w-full justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Extract Palette
        </button>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {colors.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
              Palette
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {colors.map((color) => (
                <div
                  key={color}
                  className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <div className="h-24" style={{ backgroundColor: color }} />
                  <div className="p-3 text-sm text-slate-700 dark:text-slate-200">
                    {color}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
