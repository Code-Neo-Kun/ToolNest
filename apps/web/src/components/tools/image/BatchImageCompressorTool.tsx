"use client";
import { useState } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { formatBytes, downloadBlob } from "@/lib/utils";
import { Download, X, CheckCircle, Loader2 } from "lucide-react";

const tool = getToolBySlug("batch-image-compressor")!;

type FileStatus = "pending" | "compressing" | "done" | "error";

interface FileEntry {
  id: string;
  file: File;
  status: FileStatus;
  compressed?: Blob;
  savings?: number;
  error?: string;
}

export function BatchImageCompressorTool() {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [quality, setQuality] = useState(80);
  const [running, setRunning] = useState(false);

  const addFiles = (files: File[]) => {
    const newEntries: FileEntry[] = files.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      file: f,
      status: "pending",
    }));
    setEntries((prev) => [...prev, ...newEntries]);
  };

  const removeEntry = (id: string) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const compressAll = async () => {
    if (entries.length === 0) return;
    setRunning(true);

    const options = {
      maxSizeMB: 10,
      initialQuality: quality / 100,
      useWebWorker: true,
    };

    for (const entry of entries) {
      if (entry.status === "done") continue; // skip already done

      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, status: "compressing" } : e,
        ),
      );

      try {
        const compressed = await imageCompression(entry.file, {
          ...options,
          fileType: entry.file.type as "image/jpeg" | "image/png" | "image/webp",
        });
        const savings = Math.round(
          (1 - compressed.size / entry.file.size) * 100,
        );
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? { ...e, status: "done", compressed, savings }
              : e,
          ),
        );
      } catch {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? { ...e, status: "error", error: "Compression failed" }
              : e,
          ),
        );
      }
    }

    setRunning(false);
  };

  const downloadAll = async () => {
    const done = entries.filter((e) => e.status === "done" && e.compressed);
    if (done.length === 0) return;

    if (done.length === 1) {
      downloadBlob(done[0].compressed!, `compressed-${done[0].file.name}`);
      return;
    }

    const zip = new JSZip();
    done.forEach((e) => {
      zip.file(`compressed-${e.file.name}`, e.compressed!);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "compressed-images.zip");
  };

  const doneCount = entries.filter((e) => e.status === "done").length;
  const pendingCount = entries.filter((e) => e.status === "pending").length;

  const StatusIcon = ({ status }: { status: FileStatus }) => {
    if (status === "compressing") return <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />;
    if (status === "done") return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    if (status === "error") return <X className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />;
  };

  return (
    <ToolLayout
      tool={tool}
    >
      <div className="space-y-5">
        <FileUploader
          accept="image/jpeg,image/png,image/webp"
          multiple
          onFilesSelected={addFiles}
          label="Drop images here or click to browse"
          hint="JPG, PNG, WebP — select as many as you need"
        />

        {entries.length > 0 && (
          <>
            {/* Quality slider */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <label className="font-medium text-slate-700 dark:text-slate-300">Quality</label>
                <span className="font-semibold text-indigo-600">{quality}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-indigo-600"
                disabled={running}
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            {/* File list */}
            <div className="max-h-72 overflow-y-auto space-y-1.5 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5"
                >
                  <StatusIcon status={entry.status} />
                  <span className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300">
                    {entry.file.name}
                  </span>
                  <span className="text-xs text-slate-400 shrink-0">
                    {formatBytes(entry.file.size)}
                  </span>
                  {entry.status === "done" && entry.savings !== undefined && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                      -{entry.savings}%
                    </span>
                  )}
                  {entry.status === "error" && (
                    <span className="text-xs text-red-500 shrink-0">Error</span>
                  )}
                  {entry.status !== "compressing" && (
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            {doneCount > 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {doneCount} of {entries.length} compressed
                {pendingCount > 0 && ` · ${pendingCount} pending`}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={compressAll}
                loading={running}
                disabled={running || entries.every((e) => e.status === "done")}
                className="flex-1"
              >
                {running ? "Compressing…" : `Compress ${entries.filter(e => e.status === "pending").length || "All"} Images`}
              </Button>
              {doneCount > 0 && (
                <Button
                  variant="secondary"
                  onClick={downloadAll}
                  disabled={running}
                  className="flex-1"
                >
                  <Download className="h-4 w-4" />
                  {doneCount === 1 ? "Download" : `Download All (ZIP)`}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
