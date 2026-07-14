"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import JSZip from "jszip";

const tool = getToolBySlug("favicon-generator")!;
const SIZES = [16, 32, 48, 64, 128, 192, 256, 384, 512] as const;

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return await blob.arrayBuffer();
}

async function createIcoBlob(pngBlob: Blob): Promise<Blob> {
  const pngData = new Uint8Array(await blobToArrayBuffer(pngBlob));
  const header = new Uint8Array(6);
  header[2] = 1;
  header[4] = 1;

  const entry = new Uint8Array(16);
  entry[0] = 16;
  entry[1] = 16;
  entry[2] = 0;
  entry[3] = 0;
  entry[4] = 1;
  entry[5] = 0;
  entry[6] = 32;
  entry[7] = 0;
  const sizeView = new DataView(entry.buffer);
  sizeView.setUint32(8, pngData.byteLength, true);
  sizeView.setUint32(12, header.byteLength + entry.byteLength, true);

  const buffer = new Uint8Array(
    header.byteLength + entry.byteLength + pngData.byteLength,
  );
  buffer.set(header, 0);
  buffer.set(entry, header.byteLength);
  buffer.set(pngData, header.byteLength + entry.byteLength);

  return new Blob([buffer], { type: "image/x-icon" });
}

export function FaviconGeneratorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<
    Array<{ size: number; url: string }>
  >([]);
  const [manifest, setManifest] = useState<string>("");
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!file) return;
    setError(null);
    setPreviews([]);
    setManifest("");
    setZipUrl(null);

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.src = imageUrl;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const zip = new JSZip();
    const outputs: Array<{ size: number; url: string }> = [];

    for (const size of SIZES) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unsupported");
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(image, 0, 0, size, size);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("Failed to export PNG");
      zip.file(`favicon-${size}.png`, blob);
      const url = URL.createObjectURL(blob);
      outputs.push({ size, url });
    }

    const icoCanvas = document.createElement("canvas");
    const icoCtx = icoCanvas.getContext("2d");
    if (!icoCtx) throw new Error("Canvas unsupported");
    icoCanvas.width = 16;
    icoCanvas.height = 16;
    icoCtx.drawImage(image, 0, 0, 16, 16);
    const icoBlob = await new Promise<Blob | null>((resolve) =>
      icoCanvas.toBlob(resolve, "image/png"),
    );
    if (!icoBlob) throw new Error("Failed to export icon PNG");
    const icoFile = await createIcoBlob(icoBlob);
    zip.file("favicon.ico", icoFile);

    const manifestJson = {
      name: file.name.replace(/\.[^/.]+$/, ""),
      icons: SIZES.map((size) => ({
        src: `favicon-${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
      })),
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    };
    setManifest(JSON.stringify(manifestJson, null, 2));

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    setZipUrl(url);
    setPreviews(outputs);
    URL.revokeObjectURL(imageUrl);
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload an image file to create favicon assets.",
        "Generate a set of standard icon sizes and a manifest snippet.",
        "Download the package and add the manifest to your site.",
      ]}
      faqs={[
        {
          question: "What sizes are generated?",
          answer:
            "This tool generates 16x16 through 512x512 PNG icons plus a favicon.ico file and manifest snippet.",
        },
        {
          question: "Can I use this for PWAs?",
          answer:
            "Yes. The manifest snippet includes icons suitable for progressive web apps.",
        },
      ]}
    >
      <div className="space-y-4">
        <FileUploader
          accept="image/*"
          onFilesSelected={(files) => setFile(files[0] ?? null)}
          label="Upload the source image for your favicon set"
          hint="Use a square PNG or JPG for best results"
        />

        <Button onClick={handleGenerate} disabled={!file} className="w-full">
          Generate Favicon Assets
        </Button>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {zipUrl && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Download your favicon package, including PNG icons, favicon.ico,
              and manifest snippet.
            </p>
            <a
              href={zipUrl}
              download="favicons.zip"
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#D85A30] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c64923]"
            >
              Download ZIP
            </a>
          </div>
        )}

        {previews.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Preview
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              {previews.map((preview) => (
                <div
                  key={preview.size}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.url}
                    alt={`${preview.size}px icon`}
                    className="h-14 w-14 rounded"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {preview.size}×{preview.size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {manifest && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Manifest Snippet
              </h2>
            </div>
            <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-xs text-slate-200 dark:border-slate-700">
              {manifest}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
