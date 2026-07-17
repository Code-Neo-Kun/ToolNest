"use client";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { downloadFile } from "@/lib/utils";

const tool = getToolBySlug("gitignore-generator")!;

// Each value is an array of individual gitignore lines — no concatenation
const templates: Record<string, string[]> = {
  Node: [
    "# Dependencies",
    "node_modules/",
    ".pnp",
    ".pnp.js",
    "",
    "# Build output",
    "dist/",
    "build/",
    ".next/",
    "out/",
    "",
    "# Environment",
    ".env",
    ".env.local",
    ".env.*.local",
    "",
    "# Logs",
    "*.log",
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*",
    "",
    "# Editor",
    ".DS_Store",
    ".vscode/",
    ".idea/",
  ],
  Python: [
    "# Byte-compiled / optimised",
    "__pycache__/",
    "*.py[cod]",
    "*$py.class",
    "*.pyc",
    "",
    "# Distribution / packaging",
    "dist/",
    "build/",
    "*.egg-info/",
    "*.egg",
    "",
    "# Virtual environments",
    "env/",
    "venv/",
    ".venv/",
    "",
    "# Environment",
    ".env",
    ".env.*",
    "",
    "# Testing",
    ".pytest_cache/",
    ".coverage",
    "htmlcov/",
    "",
    "# Editor",
    ".DS_Store",
    ".idea/",
    ".vscode/",
  ],
  Java: [
    "# Compiled",
    "*.class",
    "*.jar",
    "*.war",
    "*.ear",
    "*.nar",
    "",
    "# Build output",
    "/target/",
    "out/",
    "",
    "# IDE",
    ".idea/",
    "*.iml",
    ".classpath",
    ".project",
    ".settings/",
    "",
    "# OS",
    ".DS_Store",
    "Thumbs.db",
  ],
  React: [
    "# Dependencies",
    "node_modules/",
    "",
    "# Build",
    "build/",
    "dist/",
    ".next/",
    "",
    "# Environment",
    ".env",
    ".env.local",
    ".env.*.local",
    "",
    "# Editor",
    ".DS_Store",
    ".vscode/",
    ".idea/",
    "",
    "# Logs",
    "*.log",
    "npm-debug.log*",
  ],
  "Visual Studio": [
    "# User-specific files",
    "*.user",
    "*.userosscache",
    "*.suo",
    "",
    "# Build results",
    "[Dd]ebug/",
    "[Rr]elease/",
    "x64/",
    "x86/",
    "bin/",
    "obj/",
    "",
    "# Logs",
    "*.log",
    "*.cache",
    "*.pdb",
    "",
    "# NuGet",
    "*.nupkg",
    "packages/",
    "",
    "# OS",
    ".DS_Store",
    "Thumbs.db",
  ],
  Go: [
    "# Binaries",
    "*.exe",
    "*.exe~",
    "*.dll",
    "*.so",
    "*.dylib",
    "",
    "# Test binary",
    "*.test",
    "",
    "# Output",
    "*.out",
    "dist/",
    "",
    "# Environment",
    ".env",
    "",
    "# Editor",
    ".DS_Store",
    ".vscode/",
    ".idea/",
  ],
  Rust: [
    "# Build output",
    "/target/",
    "",
    "# Cargo lock (keep for binaries, gitignore for libs)",
    "# Cargo.lock",
    "",
    "# Environment",
    ".env",
    "",
    "# Editor",
    ".DS_Store",
    ".vscode/",
    ".idea/",
  ],
};

export function GitignoreGeneratorTool() {
  const [stacks, setStacks] = useState<Set<string>>(new Set(["Node"]));

  const toggleStack = (key: string) => {
    setStacks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size === 1) return prev; // must keep at least one
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const content = useMemo(() => {
    const sections = Array.from(stacks).map((key) => {
      return [`# ── ${key} ──`, ...templates[key]].join("\n");
    });
    return sections.join("\n\n");
  }, [stacks]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Select one or more technology stacks.",
        "Review the generated .gitignore content.",
        "Copy it or download it directly into your repository.",
      ]}
      faqs={[
        {
          question: "Can I select multiple stacks?",
          answer:
            "Yes — click multiple stack buttons to merge their rules into one file.",
        },
        {
          question: "Can I customise the output?",
          answer:
            "Copy the result and add any project-specific paths you need.",
        },
        {
          question: "Where should I put the .gitignore file?",
          answer:
            "Place it in the root of your repository. Git picks it up automatically.",
        },
      ]}
    >
      <div className="space-y-5">
        {/* Stack selector */}
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Select stacks
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(templates).map((key) => (
              <button
                key={key}
                onClick={() => toggleStack(key)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  stacks.has(key)
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              .gitignore
            </span>
            <CopyButton text={content} />
          </div>
          <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap break-words text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {content}
          </pre>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => downloadFile(content, ".gitignore", "text/plain")}
        >
          Download .gitignore
        </Button>
      </div>
    </ToolLayout>
  );
}
