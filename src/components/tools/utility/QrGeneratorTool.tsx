"use client";
import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("qr-generator")!;

// Simple QR code using the goqr.me API (free, no key required)
export function QrGeneratorTool() {
  const [input, setInput] = useState("");
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrUrl, setQrUrl] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateUrl = (text: string) => {
    if (!text.trim()) return "";
    const encoded = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=${fgColor.replace("#", "")}&bgcolor=${bgColor.replace("#", "")}`;
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQrUrl(generateUrl(input));
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, size, fgColor, bgColor]);

  const handleDownload = async () => {
    if (!qrUrl) return;
    const res = await fetch(qrUrl);
    const blob = await res.blob();
    downloadBlob(blob, "qrcode.png");
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter a URL, text, phone number, or any content.",
        "Customize the size and colors.",
        "The QR code generates automatically.",
        "Download the QR code as PNG.",
      ]}
      faqs={[
        {
          question: "What can I encode in a QR code?",
          answer: "URLs, plain text, phone numbers (tel:+1234567890), email addresses (mailto:), WiFi credentials, vCards, and more.",
        },
        {
          question: "How large should the QR code be for printing?",
          answer: "For print, use at least 300×300px. For large posters, use 500px or more. The QR code should be at least 1cm² when printed.",
        },
        {
          question: "Are QR codes free to use commercially?",
          answer: "Yes, standard QR codes are an open format. This generator is also free for commercial use.",
        },
      ]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Content
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://example.com or any text..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none resize-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="font-medium text-slate-700 dark:text-slate-300">Size</label>
              <span className="text-indigo-600 font-semibold">{size}×{size}px</span>
            </div>
            <input type="range" min={100} max={600} step={50} value={size}
              onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-indigo-600" />
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Foreground</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-slate-200" />
                <span className="font-mono text-sm text-slate-600 dark:text-slate-400">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-slate-200" />
                <span className="font-mono text-sm text-slate-600 dark:text-slate-400">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {qrUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="Generated QR code"
                width={size > 300 ? 300 : size}
                height={size > 300 ? 300 : size}
                className="rounded-xl border border-slate-200 dark:border-slate-700"
              />
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4" /> Download PNG
              </Button>
            </>
          ) : (
            <div className="flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <span className="text-sm text-slate-400">QR appears here</span>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
