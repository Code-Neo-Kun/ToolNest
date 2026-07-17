"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("meta-tag-generator")!;

export function MetaTagGeneratorTool() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    keywords: "",
    author: "",
    url: "",
    image: "",
    twitterHandle: "",
    robots: "index, follow",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  function escapeHtml(s: string) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const tags = `<!-- Primary Meta Tags -->
<title>${escapeHtml(form.title)}</title>
<meta name="title" content="${escapeHtml(form.title)}" />
<meta name="description" content="${escapeHtml(form.description)}" />
${form.keywords ? `<meta name="keywords" content="${escapeHtml(form.keywords)}" />` : ""}
${form.author ? `<meta name="author" content="${escapeHtml(form.author)}" />` : ""}
<meta name="robots" content="${escapeHtml(form.robots)}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
${form.url ? `<meta property="og:url" content="${escapeHtml(form.url)}" />` : ""}
<meta property="og:title" content="${escapeHtml(form.title)}" />
<meta property="og:description" content="${escapeHtml(form.description)}" />
${form.image ? `<meta property="og:image" content="${escapeHtml(form.image)}" />` : ""}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
${form.url ? `<meta property="twitter:url" content="${escapeHtml(form.url)}" />` : ""}
<meta property="twitter:title" content="${escapeHtml(form.title)}" />
<meta property="twitter:description" content="${escapeHtml(form.description)}" />
${form.image ? `<meta property="twitter:image" content="${escapeHtml(form.image)}" />` : ""}
${form.twitterHandle ? `<meta property="twitter:creator" content="${escapeHtml(form.twitterHandle)}" />` : ""}`.trim();

  const titleLen = form.title.length;
  const descLen = form.description.length;

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Fill in your page title, description, and other details.",
        "The meta tags are generated in real time.",
        "Copy and paste them into your HTML <head> section.",
      ]}
      faqs={[
        {
          question: "What is the ideal meta description length?",
          answer: "Google typically shows 150–160 characters. Keep descriptions between 120–160 characters for best results.",
        },
        {
          question: "What is the ideal title length?",
          answer: "Aim for 50–60 characters. Google truncates titles that are too long in search results.",
        },
        {
          question: "What are Open Graph tags?",
          answer: "Open Graph tags control how your page appears when shared on social media platforms like Facebook, LinkedIn, and Slack.",
        },
      ]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Page Title *</label>
              <span className={`text-xs ${titleLen > 60 ? "text-red-500" : titleLen > 50 ? "text-orange-500" : "text-slate-400"}`}>
                {titleLen}/60
              </span>
            </div>
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="My Awesome Page Title"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description *</label>
              <span className={`text-xs ${descLen > 160 ? "text-red-500" : descLen > 150 ? "text-orange-500" : "text-slate-400"}`}>
                {descLen}/160
              </span>
            </div>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="A brief description of this page for search engines."
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 resize-none"
            />
          </div>

          {[
            { key: "keywords" as const, label: "Keywords", placeholder: "seo, tools, free, online" },
            { key: "author" as const, label: "Author", placeholder: "John Doe" },
            { key: "url" as const, label: "Page URL", placeholder: "https://example.com/page" },
            { key: "image" as const, label: "Social Image URL", placeholder: "https://example.com/og-image.png" },
            { key: "twitterHandle" as const, label: "Twitter Handle", placeholder: "@username" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{f.label}</label>
              <input
                value={form[f.key]}
                onChange={set(f.key)}
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Robots</label>
            <select
              value={form.robots}
              onChange={set("robots")}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="index, follow">index, follow</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </select>
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Generated Tags</label>
            <CopyButton text={tags} />
          </div>
          <textarea
            readOnly
            value={tags}
            rows={22}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 resize-none"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
