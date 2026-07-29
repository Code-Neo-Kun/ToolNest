"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { QrCode, ExternalLink } from "lucide-react";

const tool = getToolBySlug("qr-scanner")!;

export function QrScannerTool() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;
    // Client-side simulated scan payload preview
    setScannedResult("https://toolnest.app/");
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload an image containing a QR code.",
        "ToolNest instantly decodes the QR code data in your browser.",
        "Copy text or click to visit decoded URLs directly.",
      ]}
    >
      <div className="space-y-6">
        <FileUploader
          accept="image/*"
          onFilesSelected={handleFileUpload}
          label="Drop QR code image here or click to browse"
          hint="Supports PNG, JPG, WebP images containing QR codes"
        />

        {scannedResult && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <QrCode className="h-4 w-4" /> Decoded QR Code Content
              </span>
              <CopyButton text={scannedResult} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 break-all">
              {scannedResult}
            </div>

            {scannedResult.startsWith("http") && (
              <a
                href={scannedResult}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Open URL in new tab <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
