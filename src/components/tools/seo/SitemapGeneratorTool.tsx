"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadBlob } from "@/lib/utils";
import { Download } from "lucide-react";

const tool = getToolBySlug("sitemap-generator")!;

export function SitemapGeneratorTool() {
  const [baseUrl, setBaseUrl] = useState("https://example.com");
  const [paths, setPaths] = useState("/\n/about\n/contact\n/blog\n/tools");
  const [changeFreq, setChangeFreq] = useState("weekly");

  const buildSitemapXml = () => {
    const cleanBase = baseUrl.replace(/\/$/, "");
    const urlList = paths
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const today = new Date().toISOString().split("T")[0];

    const xmlLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">',
      ...urlList.map((path) => {
        const fullUrl = path.startsWith("http") ? path : `${cleanBase}${path.startsWith("/") ? "" : "/"}${path}`;
        return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${path === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
      }),
      '</urlset>',
    ];

    return xmlLines.join("\n");
  };

  const xmlOutput = buildSitemapXml();

  const handleDownload = () => {
    const blob = new Blob([xmlOutput], { type: "application/xml" });
    downloadBlob(blob, "sitemap.xml");
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter your website base URL (e.g. https://mywebsite.com).",
        "Enter page paths (one per line).",
        "Copy or download your clean sitemap.xml file.",
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Website Base URL
            </label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Change Frequency
            </label>
            <select
              value={changeFreq}
              onChange={(e) => setChangeFreq(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Page Paths (one per line)
          </label>
          <textarea
            rows={5}
            value={paths}
            onChange={(e) => setPaths(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Generated sitemap.xml
            </span>
            <div className="flex gap-2">
              <CopyButton text={xmlOutput} />
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Download XML
              </button>
            </div>
          </div>
          <pre className="overflow-x-auto font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre">
            {xmlOutput}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
