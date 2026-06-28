"use client";
import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("lorem-ipsum")!;

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function randomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateSentence(wordCount = 10): string {
  const words = Array.from({ length: wordCount }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(sentenceCount = 5): string {
  return Array.from({ length: sentenceCount }, () =>
    generateSentence(Math.floor(Math.random() * 10) + 8)
  ).join(" ");
}

export function LoremIpsumTool() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");

  const generate = () => {
    let result = "";
    if (type === "paragraphs") {
      result = Array.from({ length: count }, generateParagraph).join("\n\n");
    } else if (type === "sentences") {
      result = Array.from({ length: count }, () =>
        generateSentence(Math.floor(Math.random() * 10) + 8)
      ).join(" ");
    } else {
      result = Array.from({ length: count }, randomWord).join(" ");
    }
    setOutput(result);
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Choose between paragraphs, sentences, or words.",
        "Set the count and click Generate.",
        "Copy the generated text.",
      ]}
      faqs={[
        {
          question: "What is Lorem Ipsum?",
          answer: "Lorem Ipsum is placeholder text used in design and publishing since the 1500s. It simulates real text without distracting with readable content.",
        },
        {
          question: "Is this the same as the standard Lorem Ipsum?",
          answer: "It uses the same word pool but is randomly generated, so each generation is unique.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Count</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <Button onClick={generate} className="w-full">Generate</Button>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Result</span>
              <CopyButton text={output} />
            </div>
            <textarea
              readOnly
              value={output}
              rows={10}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 resize-y"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
