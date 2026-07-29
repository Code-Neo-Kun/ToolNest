"use client";
/**
 * Invisible client component dropped inside every tool page.
 * Records the tool slug into localStorage on mount.
 */
import { useEffect } from "react";
import { useRecentTools } from "@/hooks/useRecentTools";

export function RecentToolTracker({ slug }: { slug: string }) {
  const { addRecent } = useRecentTools();
  useEffect(() => {
    addRecent(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  return null;
}
