"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { Globe } from "lucide-react";

const tool = getToolBySlug("og-preview")!;

export function OgPreviewTool() {
  const [title, setTitle] = useState("ToolNest — Free Online Tools");
  const [description, setDescription] = useState("Fast, free, 100% client-side online tools for developers, designers, and web creators.");
  const [imageUrl, setImageUrl] = useState("https://toolnest.app/images/receive_money_image.png");
  const [siteUrl, setSiteUrl] = useState("toolnest.app");

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Enter your page Title, Description, Image URL, and Domain.",
        "Toggle preview platforms (X/Twitter, Facebook, LinkedIn).",
        "Inspect how your open graph metadata renders on social feeds.",
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Domain / Site URL
            </label>
            <input
              type="text"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Open Graph Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Social Card Preview */}
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Social Card Live Preview
          </span>
          <div className="max-w-md mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900">
            <div className="aspect-[1.91/1] w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="OG Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x315?text=Invalid+Image+URL";
                }}
              />
            </div>
            <div className="p-4 space-y-1">
              <span className="text-xs uppercase text-slate-400 font-semibold">{siteUrl}</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-1">{title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
