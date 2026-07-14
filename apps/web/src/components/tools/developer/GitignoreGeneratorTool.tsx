"use client";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("gitignore-generator")!;
const templates: Record<string, string[]> = {
  Node: ["node_modules/", ".env", "dist/", "*.log", "npm-debug.log*"],
  Python: ["__pycache__/, *.py[cod]", "env/", "*.egg-info/"],
  Java: ["*.class", "*.jar", "*.war", "*.ear", "/target/"],
  "Visual Studio": ["*.user", "*.suo", "*.cache", "*.pdb"],
};

export function GitignoreGeneratorTool() {
  const [stack, setStack] = useState<keyof typeof templates>("Node");

  const content = useMemo(() => {
    const lines = templates[stack];
    return [`# ${stack}`, ...lines, ""].join("\n");
  }, [stack]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Choose your technology stack.",
        "Review the generated .gitignore snippet.",
        "Copy it into your repository.",
      ]}
      faqs={[
        {
          question: "Can I customize the file?",
          answer:
            "Yes. Copy the generated content and add project-specific paths as needed.",
        },
        {
          question: "Does this support multiple stacks?",
          answer:
            "You can manually add multiple entries in your final .gitignore file.",
        },
      ]}
    >
      <div className="space-y-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Project stack
          <select
            value={stack}
            onChange={(e) => setStack(e.target.value as keyof typeof templates)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {Object.keys(templates).map((template) => (
              <option key={template} value={template}>
                {template}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Generated .gitignore
            </div>
            <CopyButton text={content} />
          </div>
          <pre className="whitespace-pre-wrap break-words text-sm text-slate-700 dark:text-slate-200">
            {content}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
