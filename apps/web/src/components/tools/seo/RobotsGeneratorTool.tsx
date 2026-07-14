"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadFile } from "@/lib/utils";
import { Download, Plus, Trash2 } from "lucide-react";

const tool = getToolBySlug("robots-generator")!;

interface Rule {
  userAgent: string;
  allow: string;
  disallow: string;
}

export function RobotsGeneratorTool() {
  const [rules, setRules] = useState<Rule[]>([
    { userAgent: "*", allow: "/", disallow: "/admin" },
  ]);
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [crawlDelay, setCrawlDelay] = useState("");

  const addRule = () =>
    setRules([...rules, { userAgent: "", allow: "", disallow: "" }]);

  const removeRule = (i: number) =>
    setRules(rules.filter((_, idx) => idx !== i));

  const updateRule = (i: number, key: keyof Rule, value: string) =>
    setRules(rules.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));

  const robotsTxt = rules
    .map((r) => {
      const lines = [`User-agent: ${r.userAgent || "*"}`];
      if (r.disallow)
        r.disallow.split("\n").filter(Boolean).forEach((p) => lines.push(`Disallow: ${p.trim()}`));
      if (r.allow)
        r.allow.split("\n").filter(Boolean).forEach((p) => lines.push(`Allow: ${p.trim()}`));
      if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`);
      return lines.join("\n");
    })
    .join("\n\n")
    .concat(sitemapUrl ? `\n\nSitemap: ${sitemapUrl}` : "");

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Configure rules for each bot (use * for all bots).",
        "Add allowed and disallowed paths.",
        "Add your sitemap URL.",
        "Copy the result or download as robots.txt.",
      ]}
      faqs={[
        {
          question: "What is robots.txt?",
          answer: "robots.txt is a file at your site root that tells search engine bots which pages they can and cannot crawl.",
        },
        {
          question: "Does robots.txt prevent pages from being indexed?",
          answer: "Disallowing a URL in robots.txt prevents crawling but does not guarantee removal from search results. Use noindex meta tags for that.",
        },
        {
          question: "Where do I put robots.txt?",
          answer: "It must be placed at the root of your domain: https://yoursite.com/robots.txt",
        },
      ]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div className="space-y-4">
          {rules.map((rule, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rule {i + 1}</span>
                {rules.length > 1 && (
                  <button onClick={() => removeRule(i)} className="text-red-400 hover:text-red-600" aria-label="Remove rule">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">User-agent</label>
                <input
                  value={rule.userAgent}
                  onChange={(e) => updateRule(i, "userAgent", e.target.value)}
                  placeholder="* (all bots)"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Disallow (one per line)
                </label>
                <textarea
                  value={rule.disallow}
                  onChange={(e) => updateRule(i, "disallow", e.target.value)}
                  placeholder="/admin&#10;/private"
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-mono focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Allow (one per line)
                </label>
                <textarea
                  value={rule.allow}
                  onChange={(e) => updateRule(i, "allow", e.target.value)}
                  placeholder="/"
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-mono focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 resize-none"
                />
              </div>
            </div>
          ))}

          <Button variant="secondary" onClick={addRule} className="w-full">
            <Plus className="h-4 w-4" /> Add Rule
          </Button>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sitemap URL</label>
            <input
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://yoursite.com/sitemap.xml"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Crawl Delay (seconds)
            </label>
            <input
              value={crawlDelay}
              onChange={(e) => setCrawlDelay(e.target.value)}
              placeholder="10"
              type="number"
              min={0}
              className="w-32 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">robots.txt</label>
            <div className="flex gap-2">
              <CopyButton text={robotsTxt} />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => downloadFile(robotsTxt, "robots.txt", "text/plain")}
              >
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            </div>
          </div>
          <textarea
            readOnly
            value={robotsTxt}
            rows={18}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 resize-none"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
