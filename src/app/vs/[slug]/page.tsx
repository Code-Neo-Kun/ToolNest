import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, X, ShieldCheck, Zap, Lock } from "lucide-react";

interface ComparisonData {
  slug: string;
  competitor: string;
  toolName: string;
  toolSlug: string;
  title: string;
  description: string;
  features: { feature: string; toolnest: string | boolean; competitor: string | boolean }[];
}

const COMPARISONS: Record<string, ComparisonData> = {
  tinypng: {
    slug: "tinypng",
    competitor: "TinyPNG",
    toolName: "Image Compressor",
    toolSlug: "image-compressor",
    title: "ToolNest vs TinyPNG — Free Client-Side Alternative",
    description: "Compare ToolNest Image Compressor with TinyPNG. Discover why 100% in-browser processing without file size limits or cloud uploads is safer and faster.",
    features: [
      { feature: "Server Upload Required", toolnest: false, competitor: true },
      { feature: "Max File Size Limit", toolnest: "50MB", competitor: "5MB (Free tier)" },
      { feature: "Batch Image Compression", toolnest: "Unlimited", competitor: "20 images" },
      { feature: "Privacy & Data Logging", toolnest: "100% Private (WASM)", competitor: "Uploaded to servers" },
      { feature: "WebP Support", toolnest: true, competitor: true },
      { feature: "Offline Processing", toolnest: true, competitor: false },
    ],
  },
  ilovepdf: {
    slug: "ilovepdf",
    competitor: "iLovePDF",
    toolName: "PDF Tools",
    toolSlug: "pdf-compressor",
    title: "ToolNest vs iLovePDF — Unlimited Free PDF Tools Without Account",
    description: "Looking for an iLovePDF alternative? ToolNest provides free PDF merge, split, and compression running 100% locally in your browser.",
    features: [
      { feature: "Files Processed Locally", toolnest: true, competitor: false },
      { feature: "Hourly Task Limits", toolnest: "None", competitor: "Restricted on free plan" },
      { feature: "Account Required", toolnest: false, competitor: "Required for large files" },
      { feature: "Watermark Added", toolnest: false, competitor: false },
      { feature: "Processing Speed", toolnest: "Instant (Local JS)", competitor: "Depends on upload speed" },
    ],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(COMPARISONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = COMPARISONS[slug];
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const item = COMPARISONS[slug];
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/all-tools"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> All Tools
      </Link>

      <div className="mb-10 text-center">
        <span className="rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-semibold dark:bg-indigo-950/40 dark:text-indigo-400">
          Alternative Comparison
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          ToolNest vs {item.competitor}
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {item.description}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden mb-10">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
              <th className="p-4 font-bold text-slate-900 dark:text-white">Feature / Metric</th>
              <th className="p-4 font-bold text-indigo-600 dark:text-indigo-400">ToolNest</th>
              <th className="p-4 font-bold text-slate-500">{item.competitor}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {item.features.map((f, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{f.feature}</td>
                <td className="p-4 font-semibold text-indigo-600 dark:text-indigo-400">
                  {typeof f.toolnest === "boolean" ? (
                    f.toolnest ? <Check className="h-5 w-5 text-emerald-500" /> : <X className="h-5 w-5 text-emerald-500" />
                  ) : (
                    f.toolnest
                  )}
                </td>
                <td className="p-4 text-slate-500">
                  {typeof f.competitor === "boolean" ? (
                    f.competitor ? <Check className="h-5 w-5 text-slate-400" /> : <X className="h-5 w-5 text-rose-500" />
                  ) : (
                    f.competitor
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA section */}
      <div className="rounded-2xl bg-indigo-600 p-8 text-center text-white shadow-lg">
        <h2 className="text-2xl font-bold">Ready to try ToolNest {item.toolName}?</h2>
        <p className="mt-2 text-indigo-100 text-sm max-w-lg mx-auto">
          No signups, no wait times, and 100% private in-browser processing.
        </p>
        <Link
          href={`/tools/${item.toolSlug}`}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-indigo-600 shadow hover:bg-slate-100 active:scale-95 transition-all"
        >
          Open {item.toolName} Now
        </Link>
      </div>
    </div>
  );
}
