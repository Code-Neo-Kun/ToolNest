"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";

const tool = getToolBySlug("webp-converter")!;

export function WebpConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!file) return;
    setError(null);
    setOutputUrl(null);

    try {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.src = url;
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unsupported");
      ctx.drawImage(image, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp"),
      );
      if (!blob) {
        throw new Error("Conversion failed");
      }

      const output = URL.createObjectURL(blob);
      setOutputUrl(output);
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not convert the image to WebP.");
    }
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload an image file.",
        "Convert it to the WebP format.",
        "Download the optimized output file.",
      ]}
      faqs={[
        {
          question: "What formats can I convert?",
          answer:
            "JPG, PNG, and other browser-supported image files can be converted to WebP.",
        },
        {
          question: "Will the image quality change?",
          answer:
            "The tool converts using browser canvas; the output is optimized but visual quality is preserved.",
        },
      ]}
    >
      <div className="space-y-4">
        <FileUploader
          accept="image/*"
          onFilesSelected={(files) => setFile(files[0] ?? null)}
          label="Upload an image to convert to WebP"
          hint="PNG, JPG and similar image formats supported"
        />

        <Button onClick={handleConvert} disabled={!file} className="w-full">
          Convert to WebP
        </Button>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {outputUrl && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              WebP conversion complete.
            </p>
            <a
              href={outputUrl}
              download={
                file
                  ? `${file.name.replace(/\.[^.]+$/, "")}.webp`
                  : "converted.webp"
              }
              className="mt-4 inline-flex rounded-xl bg-[#1847D5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#133bb1]"
            >
              Download WebP Image
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
