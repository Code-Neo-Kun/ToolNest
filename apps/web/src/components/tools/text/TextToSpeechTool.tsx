"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("text-to-speech")!;

export function TextToSpeechTool() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !selected) {
        setSelected(available[0].name);
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selected]);

  const speak = () => {
    if (!text.trim()) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((voice) => voice.name === selected);
    if (voice) utterance.voice = voice;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Paste text into the editor.",
        "Choose a voice and press Speak.",
        "Stop playback at any time.",
      ]}
      faqs={[
        {
          question: "What browsers support this?",
          answer:
            "Most modern browsers support SpeechSynthesis, but voice availability may vary.",
        },
        {
          question: "Can I pause speech?",
          answer:
            "You can stop playback, but not all browsers support pausing and resuming.",
        },
      ]}
    >
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Enter text to read aloud..."
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none resize-y dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Voice
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {voices.length === 0 ? (
                <option>Loading voices...</option>
              ) : (
                voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} — {voice.lang}
                  </option>
                ))
              )}
            </select>
          </label>

          <div className="flex items-end gap-2">
            <Button onClick={speak} disabled={!text.trim()} className="w-full">
              Speak
            </Button>
            <Button
              variant="secondary"
              onClick={stop}
              disabled={!speaking}
              className="w-full"
            >
              Stop
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {voices.length > 0 ? (
            <p>{voices.length} voices available.</p>
          ) : (
            <p>Loading available voices from your browser.</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
