"use client";
import { useState } from "react";
import exifr from "exifr";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";

const tool = getToolBySlug("exif-viewer-remover")!;

type ExifData = Record<string, unknown>;

export function ExifViewerRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [exif, setExif] = useState<ExifData | null>(null);
  const [strippedUrl, setStrippedUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadExif = async (file: File) => {
    setError(null);
    setExif(null);
    setMessage(null);
    setStrippedUrl(null);

    try {
      const data = await exifr.parse(file, { translateValues: false });
      setExif(data || {});
    } catch (err) {
      setError("Unable to read EXIF metadata.");
    }
  };

  const handleStrip = async () => {
    if (!file) return;
    setError(null);
    setMessage(null);
    setStrippedUrl(null);

    try {
      const imageUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = imageUrl;
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unsupported");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, file.type),
      );
      if (!blob) throw new Error("Failed to create stripped image.");
      const url = URL.createObjectURL(blob);
      setStrippedUrl(url);
      setMessage(
        "Metadata stripped successfully. Download the cleaned image below.",
      );
      URL.revokeObjectURL(imageUrl);
    } catch {
      setError("Failed to remove metadata from the image.");
    }
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload a photo to inspect EXIF metadata.",
        "View the extracted fields and remove metadata for privacy.",
        "Download the cleaned image when ready.",
      ]}
      faqs={[
        {
          question: "What metadata is removed?",
          answer:
            "Removing EXIF metadata strips GPS location, camera details, and other embedded photo data.",
        },
        {
          question: "Does this change the image quality?",
          answer:
            "The image is re-encoded in the same format and maintains visual quality while removing metadata.",
        },
      ]}
    >
      <div className="space-y-4">
        <FileUploader
          accept="image/*"
          onFilesSelected={(files) => {
            const selected = files[0] ?? null;
            setFile(selected);
            setExif(null);
            setStrippedUrl(null);
            if (selected) loadExif(selected);
          }}
          label="Upload an image to inspect and remove EXIF metadata"
          hint="JPEG images are best for EXIF metadata review"
        />

        {file && (
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {file.name}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {Math.round(file.size / 1024)} KB
              </span>
            </div>
            <Button onClick={handleStrip} className="w-full">
              Strip EXIF Metadata
            </Button>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {message && (
          <p className="text-sm text-teal-700 dark:text-teal-300">{message}</p>
        )}

        {exif && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Extracted EXIF Data
            </h2>
            {Object.keys(exif).length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No EXIF metadata found.
              </p>
            ) : (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {Object.entries(exif).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <p className="font-semibold">{key}</p>
                    <p className="mt-1 break-words">{String(value)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {strippedUrl && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Your cleaned image is ready.
              </p>
              <a
                href={strippedUrl}
                download={file?.name ?? "cleaned-image"}
                className="inline-flex items-center justify-center rounded-xl bg-[#D85A30] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c64923]"
              >
                Download Clean Image
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
