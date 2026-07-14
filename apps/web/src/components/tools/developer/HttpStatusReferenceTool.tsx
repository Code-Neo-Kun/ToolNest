"use client";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("http-status-reference")!;

const statuses = [
  { code: 200, message: "OK", description: "The request has succeeded." },
  {
    code: 301,
    message: "Moved Permanently",
    description: "The resource has been permanently moved to a new URL.",
  },
  {
    code: 302,
    message: "Found",
    description: "The resource has been temporarily moved to another URL.",
  },
  {
    code: 400,
    message: "Bad Request",
    description:
      "The server could not understand the request due to invalid syntax.",
  },
  {
    code: 401,
    message: "Unauthorized",
    description: "Authentication is required to access the resource.",
  },
  {
    code: 403,
    message: "Forbidden",
    description:
      "The server understands the request but refuses to authorize it.",
  },
  {
    code: 404,
    message: "Not Found",
    description: "The server cannot find the requested resource.",
  },
  {
    code: 500,
    message: "Internal Server Error",
    description: "The server encountered an unexpected condition.",
  },
  {
    code: 502,
    message: "Bad Gateway",
    description:
      "The server received an invalid response from an upstream server.",
  },
  {
    code: 503,
    message: "Service Unavailable",
    description: "The server is not ready to handle the request.",
  },
];

export function HttpStatusReferenceTool() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return statuses;
    return statuses.filter(
      (status) =>
        status.code.toString().includes(query) ||
        status.message.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Search HTTP status codes by number or name.",
        "Read short guidance for each common status.",
        "Copy the code and description for docs or debugging.",
      ]}
      faqs={[
        {
          question: "Which status codes are included?",
          answer:
            "Common 2xx, 3xx, 4xx, and 5xx codes used in web development are included.",
        },
        {
          question: "Can I use this for API docs?",
          answer:
            "Yes. It is useful for reference when writing API responses or debugging server errors.",
        },
      ]}
    >
      <div className="space-y-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Search status codes
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code or message"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        <div className="grid gap-4">
          {filtered.map((status) => (
            <div
              key={status.code}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {status.code}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {status.message}
                  </p>
                </div>
                <CopyButton text={`${status.code} ${status.message}`} />
              </div>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                {status.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
