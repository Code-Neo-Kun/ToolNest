"use client";
import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "toolnest_recent_tools";
const MAX_RECENT = 8;

export function useRecentTools() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecent(JSON.parse(stored) as string[]);
    } catch {
      // localStorage not available (SSR or private browsing)
    }
  }, []);

  const addRecent = useCallback((slug: string) => {
    setRecent((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { recent, addRecent, clearRecent };
}
