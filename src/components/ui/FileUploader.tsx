"use client";
import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { cn, formatBytes } from "@/lib/utils";
import { Upload, X, File } from "lucide-react";

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesSelected: (files: File[]) => void;
  label?: string;
  hint?: string;
  className?: string;
}

export function FileUploader({
  accept,
  multiple = false,
  maxSizeMB = 50,
  onFilesSelected,
  label = "Drop files here or click to browse",
  hint,
  className,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const validateAndSetFiles = (files: File[]) => {
    setError(null);
    const maxBytes = maxSizeMB * 1024 * 1024;
    const oversized = files.find((f) => f.size > maxBytes);
    if (oversized) {
      setError(`File "${oversized.name}" exceeds ${maxSizeMB}MB limit`);
      return;
    }
    setSelectedFiles(files);
    onFilesSelected(files);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (!multiple && files.length > 1) {
      validateAndSetFiles([files[0]]);
    } else {
      validateAndSetFiles(files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    validateAndSetFiles(files);
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-150",
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
            : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
          <Upload className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
          {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
          {!hint && (
            <p className="text-xs text-slate-500 mt-1">
              {accept ? `Accepted: ${accept}` : "All file types"} · Max {maxSizeMB}MB
            </p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {selectedFiles.length > 0 && (
        <ul className="mt-3 space-y-2">
          {selectedFiles.map((file, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
            >
              <File className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300">{file.name}</span>
              <span className="text-xs text-slate-400">{formatBytes(file.size)}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700"
                aria-label="Remove file"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
