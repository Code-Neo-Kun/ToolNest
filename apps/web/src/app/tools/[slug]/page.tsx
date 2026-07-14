import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS, getToolBySlug } from "@/lib/tools-registry";
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

  // Build a richer description that includes the keyword context Google likes.
  const keywordSuffix =
    tool.keywords.length > 0
      ? ` Keywords: ${tool.keywords.slice(0, 4).join(", ")}.`
      : "";
  const description =
    `${tool.description} Free, instant results in your browser — no signup required.${keywordSuffix}`.slice(
      0,
      160,
    );

  return {
    title: `${tool.name} — Free Online Tool`,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.name} — Free Online Tool`,
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
