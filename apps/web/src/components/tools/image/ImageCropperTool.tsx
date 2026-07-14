"use client";
import { useRef, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";

const tool = getToolBySlug("image-cropper")!;

export function ImageCropperTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropSize, setCropSize] = useState(200);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLImageElement | null>(null);

  const loadImage = (file: File) => {
    setError(null);
    setPreviewUrl(null);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleCrop = async () => {
    if (!file || !imageUrl) return;
    setError(null);

    const image = new Image();
    image.src = imageUrl;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unsupported");

    const size = Math.min(cropSize, image.width, image.height);
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(image, cropX, cropY, size, size, 0, 0, size, size);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, file.type),
    );
    if (!blob) {
      setError("Failed to crop image.");
      return;
    }

    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload an image to crop.",
        "Set the crop coordinates and size.",
        "Generate the cropped image and download it.",
      ]}
      faqs={[
        {
          question: "Can I crop any image size?",
          answer:
            "Yes. The tool uses browser canvas resizing and works with any uploaded image.",
        },
        {
          question: "What output formats are supported?",
          answer:
            "The cropped image is exported in the same format as the original file.",
        },
      ]}
    >
      <div className="space-y-4">
        <FileUploader
          accept="image/*"
          onFilesSelected={(files) => {
            const selected = files[0] ?? null;
            setFile(selected);
            if (selected) loadImage(selected);
          }}
          label="Upload an image to crop"
          hint="Use JPG, PNG or WebP files"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            X coordinate
            <input
              type="number"
              min={0}
              value={cropX}
              onChange={(e) => setCropX(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Y coordinate
            <input
              type="number"
              min={0}
              value={cropY}
              onChange={(e) => setCropY(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Crop Size
            <input
              type="number"
              min={16}
              value={cropSize}
              onChange={(e) => setCropSize(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
        </div>

        <Button onClick={handleCrop} disabled={!file} className="w-full">
          Crop Image
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
              ref={previewRef}
              src={imageUrl}
              alt="Source preview"
              className="max-h-80 w-full rounded-xl object-contain"
            />
          </div>
        )}

        {previewUrl && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Cropped Result
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Cropped result"
              className="max-h-80 w-full rounded-xl object-contain"
            />
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Button
                onClick={() => {
                  if (!previewUrl) return;
                  fetch(previewUrl)
                    .then((res) => res.blob())
                    .then((blob) =>
                      downloadBlob(blob, `cropped-${file?.name}`),
                    );
                }}
                className="w-full sm:w-auto"
              >
                Download Cropped Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
