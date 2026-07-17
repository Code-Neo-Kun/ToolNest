import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS, getToolBySlug } from "@/lib/tools-registry";
import { TOOL_SEO } from "@/lib/tool-seo-data";
import ToolRenderer from "@/components/tools/ToolRenderer";
import { ComingSoonTool } from "@/components/tools/ComingSoonTool";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const seo = TOOL_SEO[slug];

  // Use hand-crafted SEO copy when available; fall back to dynamic generation.
  const title = seo?.metaTitle ?? `${tool.name} — Free Online Tool | ToolNest`;
  const rawDescription = seo?.metaDescription
    ?? `${tool.description} Free, instant results in your browser — no signup required.`;
  const description = rawDescription.slice(0, 160);

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${tool.name} — ToolNest`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.png"],
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  if (!tool.componentPath) {
    return <ComingSoonTool tool={tool} />;
  }

  return <ToolRenderer componentPath={tool.componentPath} />;
}
