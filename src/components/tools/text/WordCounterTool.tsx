"use client";
import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("word-counter")!;

export function WordCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim()).length;
    const paragraphs = text === "" ? 0 : text.split(/\n\n+/).filter((p) => p.trim()).length;
    const readingTime = Math.ceil(words / 200);
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime };
  }, [text]);

  const statCards = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "Chars (no spaces)", value: stats.charsNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading time", value: `${stats.readingTime} min` },
  ];

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Type or paste your text in the input area.",
        "Stats update in real time as you type.",
        "Use for blog posts, essays, social media copy, and more.",
      ]}
      faqs={[
        {
          question: "How is reading time calculated?",
          answer: "Based on the average adult reading speed of 200 words per minute.",
        },
        {
          question: "Is there a character limit?",
          answer: "No limit. The counter works with any length of text.",
        },
      ]}
    >
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          rows={8}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none resize-y transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-900"
          aria-label="Text input"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="text-2xl font-bold text-indigo-600">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        {text.length > 0 && (
          <button
            onClick={() => setText("")}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear text
          </button>
        )}
      </div>
    </ToolLayout>
  );
}
