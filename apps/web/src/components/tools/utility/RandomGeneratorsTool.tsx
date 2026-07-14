"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("random-generators")!;

export function RandomGeneratorsTool() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [diceSides, setDiceSides] = useState(6);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [generatedName, setGeneratedName] = useState("");

  const generateNumber = () => {
    setRandomNumber(Math.floor(Math.random() * (max - min + 1)) + min);
  };

  const rollDice = () => {
    setDiceRoll(Math.floor(Math.random() * diceSides) + 1);
  };

  const generateName = () => {
    const adjectives = [
      "Bright",
      "Curious",
      "Swift",
      "Mighty",
      "Silent",
      "Lucky",
    ];
    const nouns = [
      "Explorer",
      "Phoenix",
      "Ranger",
      "Voyager",
      "Guardian",
      "Pilot",
    ];
    setGeneratedName(
      `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`,
    );
  };

  const statusText = useMemo(() => {
    if (randomNumber !== null) return `Random number: ${randomNumber}`;
    if (diceRoll !== null) return `Dice roll: ${diceRoll}`;
    if (generatedName) return `Name: ${generatedName}`;
    return "Generate a random number, roll a die, or create a name.";
  }, [randomNumber, diceRoll, generatedName]);

  return (
    <ToolLayout
      tool={tool}
      howToUse={[
        "Generate random numbers, dice rolls, or random names.",
        "Adjust parameters and click the action buttons.",
        "Copy results for quick use in games or testing.",
      ]}
      faqs={[
        {
          question: "Can I customize the range?",
          answer:
            "Yes. Set the minimum and maximum values for the random number generator.",
        },
        {
          question: "How many dice sides are supported?",
          answer:
            "You can roll any number of sides by entering a positive integer.",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Minimum value
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="block text-sm text-slate-600 dark:text-slate-300">
            Maximum value
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Button onClick={generateNumber} className="w-full">
            Generate Number
          </Button>
          <Button onClick={rollDice} className="w-full">
            Roll Dice
          </Button>
        </div>

        <label className="block text-sm text-slate-600 dark:text-slate-300">
          Dice sides
          <input
            type="number"
            value={diceSides}
            onChange={(e) => setDiceSides(Number(e.target.value))}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>

        <Button onClick={generateName} className="w-full">
          Generate Name
        </Button>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Result
            </p>
            <CopyButton text={statusText} />
          </div>
          <p className="mt-3 text-xl text-slate-700 dark:text-slate-200">
            {statusText}
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
