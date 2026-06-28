"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileUploader } from "@/components/ui/FileUploader";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-to-base64")!;

export function ImageToBase64Tool() {
  const [base64, setBase64] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [mimeType, setMimeType] = useState("");

  const handleFile = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setMimeType(f.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setDataUrl(result);
      setBase64(result.split(",")[1] ?? "");
    };
    reader.readAsDataURL(f);
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Upload any image file.",
        "Copy the Base64 string or the full data URL.",
        "Paste into your HTML, CSS, or code as needed.",
      ]}
      faqs={[
        {
          question: "What is Base64 encoding?",
          answer: "Base64 converts binary data (like images) into an ASCII string, which can be embedded directly in HTML or CSS without a separate file request.",
        },
        {
          question: "When should I embed images as Base64?",
          answer: "For small icons and logos where avoiding extra HTTP requests matters more than file size. Large images should stay as separate files.",
        },
      ]}
    >
      <FileUploader
        accept="image/*"
        onFilesSelected={handleFile}
        label="Drop an image to encode"
      />

      {base64 && (
        <div className="mt-6 space-y-4">
          {/* Data URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Data URL (for HTML/CSS)</label>
              <CopyButton text={dataUrl} size="sm" />
            </div>
            <textarea
              readOnly
              value={dataUrl}
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 resize-none"
            />
          </div>

          {/* Raw Base64 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Raw Base64 String</label>
              <CopyButton text={base64} size="sm" />
            </div>
            <textarea
              readOnly
              value={base64}
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 resize-none"
            />
          </div>

          {/* Preview */}
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preview</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="Base64 preview" className="max-h-32 rounded-lg border border-slate-200 dark:border-slate-700" />
          </div>

          {/* HTML snippet */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">HTML img tag</label>
              <CopyButton text={`<img src="${dataUrl}" alt="image" />`} size="sm" />
            </div>
            <code className="block rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 overflow-x-auto">
              {`<img src="data:${mimeType};base64,..." alt="image" />`}
            </code>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
