"use client";
import { Coffee } from "lucide-react";
import { useState } from "react";

export function SupportFloatingButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://www.buymeacoffee.com/yourusername"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Support ToolNest — Buy me a coffee"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-amber-400 px-4 py-3 font-semibold text-white shadow-lg hover:bg-amber-500 active:scale-95 transition-all duration-200"
      style={{ boxShadow: "0 4px 20px rgba(251,191,36,0.45)" }}
    >
      <Coffee className="h-5 w-5 shrink-0" />
      <span
        className="overflow-hidden whitespace-nowrap transition-all duration-200"
        style={{
          maxWidth: hovered ? "120px" : "0px",
          opacity: hovered ? 1 : 0,
        }}
      >
        Buy me a coffee
      </span>
    </a>
  );
}
